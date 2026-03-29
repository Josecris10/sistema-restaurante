import {
  BadRequestException,
  ConflictException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { Order } from './entities/order.entity';
import { ItemDetail } from './entities/item-detail.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UsersService } from '../users/users.service';
import { TablesService } from '../tables/tables.service';
import { TableStatus } from '../tables/enums/table-status.enum';
import { Table } from '../tables/entities/table.entity';
import { OrderResponseDto } from './dto/order-response.dto';
import { ItemsService } from '../catalog/items.service';
import { AddItemDetailsDto } from './dto/add-item-details.dto.ts';
import { ItemDetailDto } from './dto/item-detail.dto';
import { UpdateKitchenStateDto } from './dto/update-kitchen-state.dto';
import { KitchenState, KITCHEN_WORKFLOW } from './enums/kitchen-state.enum';
import { UpdateOrderStateDto } from './dto/update-order-state.dto';
import { ORDER_WORKFLOW, OrderState } from './enums/order-state.enum';
import { UpdateItemDetailDto } from './dto/update-item-detail.dto';

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
        relations: ['table', 'waiter'],
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

  async updateItemDetail(
    id: number,
    detailId: number,
    itemDetail: UpdateItemDetailDto,
  ): Promise<Partial<ItemDetailDto>> {
    await this.validateOrderExists(id);

    const detail = await this.itemDetailRepository.findOne({
      where: {
        id: detailId,
        order: { id: id },
      },
    });

    if (!detail) {
      throw new NotFoundException(
        'No se encontró el detalle especificado para esta orden',
      );
    }

    if (itemDetail.newQuantity === 0) {
      await this.itemDetailRepository.delete(detail.id);
      return {
        name: detail.name,
        quantity: 0,
      };
    }

    detail.quantity = itemDetail.newQuantity;
    const savedDetail = await this.itemDetailRepository.save(detail);

    return {
      name: savedDetail.name,
      quantity: savedDetail.quantity,
      actualPrice: savedDetail.actualPrice,
      detail: savedDetail.detail,
    };
  }

  async updateKitchenState(id: number, newKitchenState: UpdateKitchenStateDto) {
    const order = await this.validateOrderExists(id);

    if (order.kitchenState === newKitchenState.newState) return;

    // Máquina de estados
    const allowedTransitions = KITCHEN_WORKFLOW[order.kitchenState];
    if (!allowedTransitions.includes(newKitchenState.newState)) {
      throw new BadRequestException(
        `Transición no permitida, no se puede pasar de ${order.kitchenState} a ${newKitchenState.newState}`,
      );
    }
    order.kitchenState = newKitchenState.newState;

    const savedOrder = await this.ordersRepository.save(order);
    return {
      id: savedOrder.id,
      kitchenState: savedOrder.kitchenState,
      orderState: savedOrder.orderState,
      clientName: savedOrder.clientName,
      table: {
        id: savedOrder.table.number,
        number: savedOrder.table.number,
      },
      waiter: {
        id: savedOrder.waiter.id,
        name: `${savedOrder.waiter.firstName} ${savedOrder.waiter.lastName}`,
      },
    };
  }

  async updateOrderState(id: number, newOrderState: UpdateOrderStateDto) {
    const order = await this.validateOrderExists(id);

    if (order.orderState === newOrderState.newState) return;

    // Máquina de estados
    const allowedTransitions = ORDER_WORKFLOW[order.orderState];
    if (!allowedTransitions.includes(newOrderState.newState)) {
      throw new BadRequestException(
        `Transición no permitida, no se puede pasar de ${order.orderState} a ${newOrderState.newState}`,
      );
    }

    if (newOrderState.newState === OrderState.PAID) {
      console.log('Emitiendo boleta (...)');
      // emitRecipe()
    }
    order.orderState = newOrderState.newState;

    const savedOrder = await this.ordersRepository.save(order);
    return {
      id: savedOrder.id,
      kitchenState: savedOrder.kitchenState,
      orderState: savedOrder.orderState,
      clientName: savedOrder.clientName,
      table: {
        id: savedOrder.table.number,
        number: savedOrder.table.number,
      },
      waiter: {
        id: savedOrder.waiter.id,
        name: `${savedOrder.waiter.firstName} ${savedOrder.waiter.lastName}`,
      },
    };
  }

  async cancelOrder(id: number) {
    const order = await this.validateOrderExists(id);

    const allowedOrderTransitions = ORDER_WORKFLOW[order.orderState];
    const allowedKitchenTransitions = KITCHEN_WORKFLOW[order.kitchenState];
    if (!allowedOrderTransitions.includes(OrderState.CANCELLED)) {
      throw new BadRequestException(
        `Transición no permitida, no se puede pasar de ${order.orderState} a ${OrderState.CANCELLED}`,
      );
    }
    if (!allowedKitchenTransitions.includes(KitchenState.CANCELLED)) {
      throw new BadRequestException(
        `Transición no permitida, no se puede pasar de ${order.kitchenState} a ${KitchenState.CANCELLED}`,
      );
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await this.tablesService.releaseTable(
        order.table.id,
        queryRunner.manager,
      );

      order.orderState = OrderState.CANCELLED;
      order.kitchenState = KitchenState.CANCELLED;

      const savedOrder = await queryRunner.manager.save(order);
      await queryRunner.commitTransaction();
      return {
        id: savedOrder.id,
        kitchenState: savedOrder.kitchenState,
        orderState: savedOrder.orderState,
        clientName: savedOrder.clientName,
        table: {
          id: savedOrder.table.number,
          number: savedOrder.table.number,
        },
        waiter: {
          id: savedOrder.waiter.id,
          name: `${savedOrder.waiter.firstName} ${savedOrder.waiter.lastName}`,
        },
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

  async closeOrder(id: number) {
    const order = await this.validateOrderExists(id);

    const allowedOrderTransitions = ORDER_WORKFLOW[order.orderState];
    if (!allowedOrderTransitions.includes(OrderState.CLOSED)) {
      throw new BadRequestException(
        `Transición no permitida, no se puede pasar de ${order.orderState} a ${OrderState.CLOSED}`,
      );
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Liberar mesa
      await this.tablesService.releaseTable(
        order.table.id,
        queryRunner.manager,
      );

      // Cerramos la orden
      order.orderState = OrderState.CLOSED;

      const savedOrder = await queryRunner.manager.save(order);
      await queryRunner.commitTransaction();
      return {
        id: savedOrder.id,
        kitchenState: savedOrder.kitchenState,
        orderState: savedOrder.orderState,
        clientName: savedOrder.clientName,
        table: {
          id: savedOrder.table.number,
          number: savedOrder.table.number,
        },
        waiter: {
          id: savedOrder.waiter.id,
          name: `${savedOrder.waiter.firstName} ${savedOrder.waiter.lastName}`,
        },
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      if (error instanceof HttpException) throw error;
      else
        throw new InternalServerErrorException(
          'Ocurrió un error al intentar cerrar la orden',
        );
    } finally {
      await queryRunner.release();
    }
  }
}
