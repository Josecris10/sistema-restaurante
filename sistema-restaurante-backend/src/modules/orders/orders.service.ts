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
import { Item } from './entities/item.entity';
import { ItemDetail } from './entities/item-detail.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UsersService } from '../users/users.service';
import { TablesService } from '../tables/tables.service';
import { TableStatus } from '../tables/enums/table-status.enum';
import { Table } from '../tables/entities/table.entity';
import { OrderResponseDto } from './dto/order-response.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly usersService: UsersService,
    private readonly tablesService: TablesService,
    private readonly dataSource: DataSource,

    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,

    @InjectRepository(ItemDetail)
    private readonly itemDetailRepository: Repository<ItemDetail>,
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

  async create(orderData: CreateOrderDto): Promise<OrderResponseDto> {
    const { waiterId, tableId, itemDetails } = orderData;

    const waiter = await this.usersService.findWaiterById(waiterId);
    const table = await this.tablesService.findOne(tableId);

    if (table.state === TableStatus.OCCUPIED)
      throw new ConflictException(`La mesa #${table.number} está ocupada`);

    const itemIds = [...new Set(itemDetails.map((item) => item.itemId))];

    const validatedItems = await this.validateItemsExist(itemIds);

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
}
