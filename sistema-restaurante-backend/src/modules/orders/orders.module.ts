import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';

import { Order } from './entities/order.entity';
import { Item } from './entities/item.entity';
import { ItemDetail } from './entities/item-detail.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order, Item, ItemDetail])],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
