import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Menu } from './entities/menu.entity';
import { RecipeMenu } from './entities/recipe-menu.entity';
import { DailyProduction } from './entities/daily-production.entity';

@Injectable()
export class MenusService {
  constructor(
    @InjectRepository(Menu)
    private readonly menuRepository: Repository<Menu>,

    @InjectRepository(RecipeMenu)
    private readonly recipeMenuRepository: Repository<RecipeMenu>,

    @InjectRepository(DailyProduction)
    private readonly dailyProductionRepository: Repository<DailyProduction>,
  ) {}
}
