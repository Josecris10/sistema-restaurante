import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

// Modules
import { TablesModule } from './modules/tables/tables.module';
import { OrdersModule } from './modules/orders/orders.module';
import { RecipesModule } from './modules/recipes/recipes.module';
import { SuppliesModule } from './modules/supplies/supplies.module';
import { UsersModule } from './modules/users/users.module';

//Entities
import { DailyProduction } from './modules/menus/entities/daily-production.entity';
import { MenusModule } from './modules/menus/menus.module';
import { Menu } from './modules/menus/entities/menu.entity';
import { Table } from './modules/tables/entities/table.entity';
import { RecipeMenu } from './modules/menus/entities/recipe-menu.entity';
import { Order } from './modules/orders/entities/order.entity';
import { Item } from './modules/orders/entities/item.entity';
import { ItemDetail } from './modules/orders/entities/item-detail.entity';
import { Recipe } from './modules/recipes/entities/recipe.entity';
import { RecipeSupply } from './modules/recipes/entities/recipe-supply.entity';
import { Supply } from './modules/supplies/entities/supply.entity';
import { SupplyBatch } from './modules/supplies/entities/supply-batch.entity';
import { User } from './modules/users/entities/user.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      synchronize: process.env.DB_SYNCHRONIZE === 'true',
      logging: process.env.DB_LOGGING === 'true',

      ssl: true,
      extra: {
        ssl: {
          rejectUnauthorized: false,
        },
      },
      entities: [
        Menu,
        DailyProduction,
        RecipeMenu,
        Order,
        Item,
        ItemDetail,
        Recipe,
        RecipeSupply,
        Supply,
        SupplyBatch,
        Table,
        User,
      ],
    }),
    MenusModule,
    OrdersModule,
    TablesModule,
    RecipesModule,
    SuppliesModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
