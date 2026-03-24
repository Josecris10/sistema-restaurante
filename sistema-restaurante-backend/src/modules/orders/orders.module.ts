import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';

import { Order } from './entities/order.entity';
import { ItemDetail } from './entities/item-detail.entity';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { TablesModule } from '../tables/tables.module';
import { MenusModule } from '../menus/menus.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, ItemDetail]),
    AuthModule,
    MenusModule,
    UsersModule,
    TablesModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
