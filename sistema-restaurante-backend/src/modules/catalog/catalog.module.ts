import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CatalogService } from './catalog.service';
import { CatalogController } from './catalog.controller';
import { Menu } from './entities/menu.entity';
import { RecipeMenu } from './entities/recipe-menu.entity';
import { DailyProduction } from './entities/daily-production.entity';
import { AuthModule } from '../auth/auth.module';
import { Item } from './entities/item.entity';
import { ItemsService } from './items.service';
import { RecipesModule } from '../recipes/recipes.module';
import { SuppliesModule } from '../supplies/supplies.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Item, Menu, RecipeMenu, DailyProduction]),
    AuthModule,
    RecipesModule,
    SuppliesModule,
  ],
  controllers: [CatalogController],
  providers: [CatalogService, ItemsService],
  exports: [CatalogService, ItemsService, TypeOrmModule],
})
export class CatalogModule {}
