import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';

import { Order } from './entities/order.entity';
import { Item } from '../menus/entities/item.entity';
import { ItemDetail } from './entities/item-detail.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UsersService } from '../users/users.service';
import { TablesService } from '../tables/tables.service';
import { TableStatus } from '../tables/enums/table-status.enum';
import { Table } from '../tables/entities/table.entity';
import { OrderResponseDto } from './dto/order-response.dto';
import { ItemsService } from '../menus/items.service';
import { AddItemDetailsDto } from './dto/add-item-details.dto.ts';
import { ItemDetailDto } from './dto/item-detail.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly usersService: UsersService,
    private readonly tablesService: TablesService,
    private readonly itemsService: ItemsService,
    private readonly dataSource: DataSource,

    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,

    @InjectRepository(ItemDetail)
    private readonly itemDetailRepository: Repository<ItemDetail>,
  ) {}

  async create(orderData: CreateOrderDto): Promise<OrderResponseDto> {
    const { waiterId, tableId, itemDetails } = orderData;

    const waiter = await this.usersService.findWaiterById(waiterId);
    const table = await this.tablesService.findOne(tableId);

    if (table.state === TableStatus.OCCUPIED)
      throw new ConflictException(`La mesa #${table.number} está ocupada`);

    const itemIds = [...new Set(itemDetails.map((item) => item.itemId))];

    const validatedItems = await this.itemsService.validateItemsExist(itemIds);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const newOrder = queryRunner.manager.create(Order, {
        clientName: orderData.clientName,
        table: { id: table.id },
        waiter: { id: waiter.id },
      });
      const savedOrder = await queryRunner.manager.save(newOrder);

      await queryRunner.manager.update(Table, tableId, {
        state: TableStatus.OCCUPIED,
      });

      const itemsMap = new Map(validatedItems.map((item) => [item.id, item]));

      const detailsToSave = itemDetails.map((detail) => {
        const item = itemsMap.get(detail.itemId);
        return queryRunner.manager.create(ItemDetail, {
          quantity: detail.quantity,
          actualPrice: detail.actualPrice ?? item?.unitPrice,
          detail: detail.detail,
          order: savedOrder,
          item: {
            id: item?.id,
            name: item?.name,
          },
        });
      });

      await queryRunner.manager.save(detailsToSave);
      await queryRunner.commitTransaction();

      return {
        id: savedOrder.id,
        clientName: savedOrder.clientName,
        kitchenState: savedOrder.kitchenState,
        orderState: savedOrder.orderState,
        tableId: table.id,
        waiterId: waiter.id,
        detail: detailsToSave.map((detail) => {
          return {
            itemName: detail.item.name,
            quantity: detail.quantity,
            actualPrice: detail.actualPrice,
            detail: detail.detail,
          };
        }),
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();

      throw new InternalServerErrorException(
        'Ocurrió un error al intentar registrar la orden',
      );
    } finally {
      await queryRunner.release();
    }
  }

  async validateOrderExists(id: number) {
    try {
      await this.orderRepository.findOneOrFail({
        where: { id },
      });
      return;
    } catch (error) {
      throw new NotFoundException(
        `No se ha encontrado una orden con el ID#${id}`,
      );
    }
  }

  async addItemDetails(
    id: number,
    itemDetails: AddItemDetailsDto,
  ): Promise<ItemDetailDto[]> {
    const order = await this.validateOrderExists(id);

    return [];
  }
}
