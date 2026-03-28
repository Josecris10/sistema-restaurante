import {
  BadRequestException,
  ConflictException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';

import { Order } from './entities/order.entity';
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
    private readonly ordersRepository: Repository<Order>,
    private readonly usersService: UsersService,
    private readonly tablesService: TablesService,
    private readonly itemsService: ItemsService,
    private readonly dataSource: DataSource,

    @InjectRepository(ItemDetail)
    private readonly itemDetailRepository: Repository<ItemDetail>,
  ) {}

  private async buildItemDetails(
    itemsDetails: ItemDetailDto[],
    orderId: number,
  ) {
    const existingItemsIds = itemsDetails.flatMap((i) => i.itemId ?? []);

    const dBItems =
      existingItemsIds.length > 0
        ? await this.itemsService.validateItemsExist(existingItemsIds)
        : [];

    return itemsDetails.map((i) => {
      const dbItem = dBItems.find((dbi) => dbi.id === i.itemId);

      const price = i.actualPrice ?? dbItem?.unitPrice;
      const itemName = i.name ?? dbItem?.name;

      if (typeof price !== 'number') {
        throw new BadRequestException(
          `No se encontró el precio para el ítem a añadir`,
        );
      }
      if (!itemName) {
        throw new BadRequestException(
          `Debe especificar un nombre para el cargo abierto`,
        );
      }

      return {
        order: { id: orderId },
        quantity: i.quantity,
        actualPrice: price,
        detail: i.detail,
        name: itemName,
        item: i.itemId ? { id: i.itemId } : undefined,
      };
    });
  }

  async create(orderData: CreateOrderDto): Promise<OrderResponseDto> {
    const { waiterId, tableId, itemDetails } = orderData;

    const waiter = await this.usersService.findWaiterById(waiterId);
    const table = await this.tablesService.findOne(tableId);

    if (table.state === TableStatus.OCCUPIED)
      throw new ConflictException(`La mesa #${table.number} está ocupada`);

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

      const detailsToSaveObjects = await this.buildItemDetails(
        itemDetails,
        savedOrder.id,
      );

      await queryRunner.manager.update(Table, tableId, {
        state: TableStatus.OCCUPIED,
      });

      const detailsToSave = queryRunner.manager.create(
        ItemDetail,
        detailsToSaveObjects,
      );

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
            name: detail.name,
            quantity: detail.quantity,
            actualPrice: detail.actualPrice,
            detail: detail.detail,
          };
        }),
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      if (error instanceof HttpException) throw error;
      else
        throw new InternalServerErrorException(
          'Ocurrió un error al intentar registrar la orden',
        );
    } finally {
      await queryRunner.release();
    }
  }

  async findOne(id: number): Promise<OrderResponseDto> {
    const order = await this.ordersRepository.findOne({
      where: { id },
      relations: { itemDetails: { item: true }, table: true, waiter: true },
      select: {
        id: true,
        clientName: true,
        kitchenState: true,
        orderState: true,
        closedAt: true,
        table: { id: true },
        waiter: { id: true },
        itemDetails: {
          name: true,
          id: true,
          quantity: true,
          actualPrice: true,
          detail: true,
          item: { id: true, name: true },
        },
      },
    });
    if (!order)
      throw new NotFoundException(
        `No se ha encontrado una orden con el ID #${id}`,
      );
    return {
      id: order.id,
      clientName: order.clientName,
      kitchenState: order.kitchenState,
      orderState: order.orderState,
      closedAt: order.closedAt,

      detail: order.itemDetails.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        actualPrice: item.actualPrice,
        detail: item.detail,
      })),
      tableId: order.table.id,
      waiterId: order.waiter.id,
    };
  }

  async validateOrderExists(id: number): Promise<Order> {
    try {
      return await this.ordersRepository.findOneOrFail({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException(
        `No se ha encontrado una orden con el ID #${id}`,
      );
    }
  }

  async addItemDetails(
    id: number,
    itemDetails: AddItemDetailsDto,
  ): Promise<ItemDetailDto[]> {
    const order = await this.validateOrderExists(id);

    const itemDetailsToSave = await this.buildItemDetails(
      itemDetails.items,
      order.id,
    );

    const newItemDetails = this.itemDetailRepository.create(itemDetailsToSave);
    const savedItemDetail =
      await this.itemDetailRepository.save(newItemDetails);

    return savedItemDetail.map((it) => ({
      name: it.name,
      quantity: it.quantity,
      actualPrice: it.actualPrice,
      detail: it.detail,
      itemId: it.item?.id,
    }));
  }
}
