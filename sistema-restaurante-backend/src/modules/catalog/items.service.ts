import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Item } from './entities/item.entity';
import { In, Repository } from 'typeorm';
import { OnEvent } from '@nestjs/event-emitter';
import { RecipeCreatedEvent } from '../recipes/events/recipe-created.event';
import { ItemDto } from './dto/item.dto';
import { BaseResponseDto } from 'src/common/dto/base-response.dto';
import { RecipesService } from '../recipes/recipes.service';
import { SuppliesService } from '../supplies/supplies.service';
import { SupplyCreatedEvent } from '../supplies/events/supply-created.event';
import { SupplyEvents } from 'src/common/enums/events.enum';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,

    private readonly recipesService: RecipesService,
    private readonly suppliesService: SuppliesService,
  ) {}

  async validateItemsExist(ids: number[]): Promise<Item[]> {
    const uniqueIds = [...new Set(ids)];

    const foundItems = await this.itemRepository.find({
      where: { id: In(uniqueIds) },
      select: ['id', 'name', 'unitPrice'],
    });

    const foundIds = foundItems.map((i) => i.id);
    const missingIds = ids.filter((id) => !foundIds.includes(id));

    if (missingIds.length > 0)
      throw new BadRequestException({
        message: 'Uno o más items proporcionados no existen en el sistema',
        missingIds: missingIds,
      });

    return foundItems;
  }

  async create(itemData: ItemDto): Promise<ItemDto> {
    const { name, supplyId, recipeId } = itemData;
    if (recipeId) {
      await this.recipesService.validateRecipesExist([recipeId]);
    }
    if (supplyId) {
      await this.suppliesService.validateSuppliesExist([supplyId]);
    }
    const existingItem = await this.itemRepository.findOne({
      where: { name: name.trim() },
    });
    if (existingItem)
      throw new ConflictException(
        `Ya existe un item con el nombre "${name}" en el sistema`,
      );
    const newItem = this.itemRepository.create({
      name: name,
      recipe: recipeId ? { id: recipeId } : undefined,
      supply: supplyId ? { id: supplyId } : undefined,
    });

    const savedItem = await this.itemRepository.save(newItem);

    return savedItem;
  }

  @OnEvent('recipe.created')
  async handleRecipeCreatedEvent(payload: RecipeCreatedEvent) {
    console.log('Creando item en base a receta');
    const item: ItemDto = {
      name: payload.recipeName,
      recipeId: payload.recipeId,
    };

    try {
      await this.create(item);
      console.log('Item creado con éxito en background');
    } catch (error) {
      console.error(
        `Error al autocompletar el Item para la receta ${payload.recipeName}`,
        error.message,
      );
    }
  }

  @OnEvent(SupplyEvents.PRODUCT_CREATED)
  async handleProductCreatedEvent(payload: SupplyCreatedEvent) {
    console.log('Creando item en base a insumo');
    const item: ItemDto = {
      name: payload.supplyName,
      supplyId: payload.supplyId,
    };

    try {
      await this.create(item);
      console.log('Item creado con éxito en background');
    } catch (error) {
      console.error(
        `Error al autocompletar el Item para el producto ${payload.supplyName}`,
        error.message,
      );
    }
  }
}
