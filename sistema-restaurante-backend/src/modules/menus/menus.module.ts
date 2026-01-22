import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MenusService } from './menus.service';
import { MenusController } from './menus.controller';
import { Menu } from './entities/menu.entity';
import { RecipeMenu } from './entities/recipe-menu.entity';
import { DailyProduction } from './entities/daily-production.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Menu, RecipeMenu, DailyProduction])],
  controllers: [MenusController],
  providers: [MenusService],
  exports: [MenusService],
})
export class MenusModule {}
