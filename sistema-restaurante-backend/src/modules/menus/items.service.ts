import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Item } from './entities/item.entity';
import { In, Repository } from 'typeorm';
import { OnEvent } from '@nestjs/event-emitter';
import { RecipeCreatedEvent } from '../recipes/events/recipe-created.event';
import { ItemDto } from './dto/item.dto';
import { BaseResponseDto } from 'src/common/dto/base-response.dto';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,
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

  async create(itemData: ItemDto): Promise<BaseResponseDto<ItemDto>> {}

  @OnEvent('recipe.created')
  handleRecipeCreatedEvent(payload: RecipeCreatedEvent) {
    console.log('Creando item en base a receta');
    this.create(new ItemDto());
  }
}
