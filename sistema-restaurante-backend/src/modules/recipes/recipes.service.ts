import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';

import { SuppliesService } from '../supplies/supplies.service';

import { Recipe } from './entities/recipe.entity';
import { RecipeSupply } from './entities/recipe-supply.entity';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { RecipeResponseDto } from './dto/recipe-response.dto';
import { PaginatedResult } from '../../common/interfaces/paginated-result.interface';
import { paginate } from '../../common/utils/pagination.util';
import { GetRecipesFilterDto } from './dto/get-recipes-filter-dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { RecipeCreatedEvent } from './events/recipe-created.event';

@Injectable()
export class RecipesService {
  constructor(
    @InjectRepository(Recipe)
    private readonly recipeRepository: Repository<Recipe>,
    private readonly suppliesService: SuppliesService,
    private readonly dataSource: DataSource,

    @InjectRepository(RecipeSupply)
    private readonly recipeSupplyRepository: Repository<RecipeSupply>,

    private eventEmitter: EventEmitter2,
  ) {}

  async create(recipeData: CreateRecipeDto): Promise<RecipeResponseDto> {
    const { name, additionalInfo, ingredients } = recipeData;

    const existingRecipe = await this.recipeRepository.findOne({
      where: { name: name.trim() },
    });
    if (existingRecipe)
      throw new ConflictException(
        `La receta con el nombre "${name}" ya existe en el sistema.`,
      );

    const suppliesIds = [...new Set(ingredients.map((ing) => ing.supplyId))];
    const validatedSupplies =
      await this.suppliesService.validateSuppliesExist(suppliesIds);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const newRecipe = queryRunner.manager.create(Recipe, {
        name: name,
        additionalInfo: additionalInfo,
      });

      const savedRecipe = await queryRunner.manager.save(newRecipe);

      const recipeSuppliesToSave = recipeData.ingredients.map((ingredient) => {
        return queryRunner.manager.create(RecipeSupply, {
          quantity: ingredient.quantity,
          recipe: savedRecipe,
          supply: { id: ingredient.supplyId },
        });
      });

      await queryRunner.manager.save(recipeSuppliesToSave);
      await queryRunner.commitTransaction();

      this.eventEmitter.emit(
        'recipe.created',
        new RecipeCreatedEvent(savedRecipe.id, savedRecipe.name),
      );

      return {
        ...savedRecipe,
        ingredients: recipeSuppliesToSave.map((recipeSupply) => {
          const supplyInfo = validatedSupplies.find(
            (s) => s.id === recipeSupply.supply.id,
          );
          return {
            supplyName: supplyInfo?.name,
            supplyId: recipeSupply.supply.id,
            quantity: recipeSupply.quantity,
          };
        }),
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();

      throw new InternalServerErrorException(
        'Ocurrió un error al intentar guardar la receta y sus insumos',
      );
    } finally {
      await queryRunner.release();
    }
  }

  async findOne(id: number): Promise<RecipeResponseDto> {
    const recipe = await this.recipeRepository.findOne({
      where: { id },
      relations: ['recipeSupplies', 'recipeSupplies.supply'],
    });

    if (!recipe)
      throw new NotFoundException(`La receta con ID ${id} no existe`);

    return {
      id: recipe.id,
      name: recipe.name,
      additionalInfo: recipe.additionalInfo,
      ingredients: recipe.recipeSupplies.map((recipeSupply) => ({
        supplyName: recipeSupply.supply.name,
        supplyId: Number(recipeSupply.supply.id),
        quantity: Number(recipeSupply.quantity),
      })),
    };
  }

  async findAll(
    filters: GetRecipesFilterDto,
  ): Promise<PaginatedResult<RecipeResponseDto>> {
    const { name, ingredientId } = filters;

    const query = this.recipeRepository
      .createQueryBuilder('recipe')
      .select('recipe.id', 'id')
      .addSelect('recipe.name', 'name');

    if (ingredientId) {
      query
        .innerJoin('recipe.recipeSupplies', 'recipe_supply')
        .andWhere('recipe_supply.supply_id = :ingredientId', { ingredientId })
        .groupBy('recipe.id')
        .addGroupBy('recipe.name');
    }

    if (name) {
      query.andWhere('LOWER(recipe.name) LIKE LOWER(:name)', {
        name: `%${name}%`,
      });
    }

    return await paginate(query, filters);
  }

  async update(id: number, updateData: UpdateRecipeDto) {
    const recipe = await this.recipeRepository.findOne({
      where: { id },
      relations: ['recipeSupplies'],
    });

    if (!recipe)
      throw new NotFoundException(`Receta con id #${id} no encontrada`);

    if (updateData.name) {
      const duplicate = await this.recipeRepository.findOne({
        where: { name: updateData.name?.trim() },
      });

      if (duplicate && duplicate.id !== id)
        throw new ConflictException(
          `Ya existe otra receta con el nombre "${updateData.name}"`,
        );
    }

    if (updateData.ingredients && updateData.ingredients.length > 0) {
      await Promise.all(
        updateData.ingredients.map((ing) =>
          this.suppliesService.findOne(ing.supplyId),
        ),
      );
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const updatedRecipe = queryRunner.manager.merge(Recipe, recipe, {
        name: updateData.name,
        additionalInfo: updateData.additionalInfo,
      });
      await queryRunner.manager.save(updatedRecipe);

      if (updateData.ingredients) {
        await queryRunner.manager.delete(RecipeSupply, { recipe: { id: id } });

        if (updateData.ingredients.length > 0) {
          const newRecipeSupplies = updateData.ingredients.map((ing) => {
            return queryRunner.manager.create(RecipeSupply, {
              recipe: { id: id },
              supply: { id: ing.supplyId },
              quantity: ing.quantity,
            });
          });

          await queryRunner.manager.save(newRecipeSupplies);
        }
      }
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(
        'Error al actualizar la receta y sus ingredientes',
      );
    } finally {
      await queryRunner.release();
    }

    return await this.findOne(id);
  }

  async delete(id: number) {
    const recipe = await this.recipeRepository.findOne({
      where: { id },
    });
    if (!recipe)
      throw new NotFoundException(`La receta con ID ${id} no existe`);

    await this.recipeRepository.delete(id);
    return { message: `La receta con ID #${id} fue eliminada correctamente ` };
  }

  async validateRecipesExist(ids: number[]): Promise<Recipe[]> {
    const uniqueIds = [...new Set(ids)];

    const foundRecipes = await this.recipeRepository.find({
      where: { id: In(uniqueIds) },
      select: ['id', 'name'],
    });

    const foundIds = foundRecipes.map((i) => i.id);
    const missingIds = ids.filter((id) => !foundIds.includes(id));

    if (missingIds.length > 0)
      throw new BadRequestException({
        message: 'Una o más recetas proporcionados no existen en el sistema',
        missingIds: missingIds,
      });

    return foundRecipes;
  }
}
