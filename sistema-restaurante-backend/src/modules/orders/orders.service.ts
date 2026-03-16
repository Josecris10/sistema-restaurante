import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Order } from './entities/order.entity';
import { Item } from './entities/item.entity';
import { ItemDetail } from './entities/item-detail.entity';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,

    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,

    @InjectRepository(ItemDetail)
    private readonly itemDetailRepository: Repository<ItemDetail>,
  ) {}

  async create(orderData: CreateOrderDto) {}
}
