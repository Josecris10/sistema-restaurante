import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Menu } from './entities/menu.entity';
import { RecipeMenu } from './entities/recipe-menu.entity';
import { DailyProduction } from './entities/daily-production.entity';
import { CreateMenuDto } from './dto/create-menu.dto';
import { RecipesService } from '../recipes/recipes.service';

@Injectable()
export class CatalogService {
  constructor(
    @InjectRepository(Menu)
    private readonly menuRepository: Repository<Menu>,

    @InjectRepository(RecipeMenu)
    private readonly recipeMenuRepository: Repository<RecipeMenu>,

    @InjectRepository(DailyProduction)
    private readonly dailyProductionRepository: Repository<DailyProduction>,
    private readonly dataSource: DataSource,
    private readonly recipesService: RecipesService,
  ) {}

  async validateMenuExists(id: number) {
    return await this.menuRepository.findOneByOrFail({ id });
  }

  async findOne(id: number, relations?: string[]) {
    try {
      await this.validateMenuExists(id);
    } catch {
      throw new NotFoundException(`No se encontró el menú con ID #${id}`);
    }

    const menu = await this.menuRepository.findOne({
      where: { id },
      relations: relations,
    });
    return menu;
  }

  async createMenu(menuInfo: CreateMenuDto) {
    const { isTemplate, parentMenuId } = menuInfo;

    if (!menuInfo.recipes)
      throw new BadRequestException('El campo "recipes" debe estar definido');
    if (menuInfo.recipes.length > 0) {
      const recipeIds = menuInfo.recipes.flatMap((r) => r.recipeId ?? []);
      await this.recipesService.validateRecipesExist(recipeIds);
    }
    if (!menuInfo.targetDay && !isTemplate) {
      throw new BadRequestException('Debe especificar la fecha del menú');
    }

    if (isTemplate) {
      const missing = (['menuName', 'basePrice', 'comboPrice'] as const).find(
        (prop) => !menuInfo[prop],
      );
      if (missing) throw new BadRequestException(`Debe especificar ${missing}`);
    }

    if (parentMenuId) {
      const parentMenu = await this.findOne(parentMenuId);
      menuInfo.menuName = menuInfo.menuName ?? parentMenu?.name;
      menuInfo.basePrice = menuInfo.basePrice ?? parentMenu?.basePrice;
      menuInfo.comboPrice = menuInfo.comboPrice ?? parentMenu?.comboPrice;
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    const newMenu = this.menuRepository.create({
      name: menuInfo.menuName,
      isTemplate: isTemplate,
      basePrice: menuInfo.basePrice,
      comboPrice: menuInfo.comboPrice,
      targetDay: menuInfo.targetDay ?? undefined,
      parentMenu: parentMenuId ? { id: parentMenuId } : undefined,
    });

    try {
      await queryRunner.manager.save(newMenu);
      const recipesMenuToSave = menuInfo.recipes.map((menuRecipeDto) => {
        return this.recipeMenuRepository.create({
          name: menuRecipeDto.recipeName,
          courseType: menuRecipeDto.courseType,
          menu: { id: newMenu.id },
          recipe: { id: menuRecipeDto.recipeId },
        });
      });
      await queryRunner.manager.save(recipesMenuToSave);
      await queryRunner.commitTransaction();
      return {
        menuId: newMenu.id,
        menuName: newMenu.name,
        recipes: recipesMenuToSave.map((rm) => {
          return {
            courseType: rm.courseType,
            recipeId: rm.recipe.id,
          };
        }),
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      if (error instanceof HttpException) throw error;
      else
        throw new InternalServerErrorException(
          'Ocurrió un error al intentar registrar el menú ',
        );
    } finally {
      await queryRunner.release();
    }
  }
}
