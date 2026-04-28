import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Menu } from './entities/menu.entity';
import { RecipeMenu } from './entities/recipe-menu.entity';
import { DailyProduction } from './entities/daily-production.entity';
import { CreateMenuDto } from './dto/create-menu.dto';
import { RecipesService } from '../recipes/recipes.service';

@Injectable()
export class CatalogService {
  constructor(
    @InjectRepository(Menu)
    private readonly menuRepository: Repository<Menu>,

    @InjectRepository(RecipeMenu)
    private readonly recipeMenuRepository: Repository<RecipeMenu>,

    @InjectRepository(DailyProduction)
    private readonly dailyProductionRepository: Repository<DailyProduction>,
    private readonly dataSource: DataSource,
    private readonly recipesService: RecipesService,
  ) {}

  async validateMenuExists(id: number) {
    return await this.menuRepository.findOneByOrFail({ id });
  }

  async findOne(id: number, relations?: string[]) {
    try {
      await this.validateMenuExists(id);
    } catch {
      throw new NotFoundException(`No se encontró el menú con ID #${id}`);
    }

    const menu = await this.menuRepository.findOne({
      where: { id },
      relations: relations,
    });
    return menu;
  }

  async createMenu(menuInfo: CreateMenuDto) {
    const { isTemplate, parentMenuId } = menuInfo;

    const newMenu = this.menuRepository.create({ isTemplate: isTemplate });
    if (!menuInfo.recipes)
      throw new BadRequestException('El campo "recipes" debe estar definido');
    if (menuInfo.recipes.length > 0) {
      const recipeIds = menuInfo.recipes.flatMap((r) => r.recipeId ?? []);
      await this.recipesService.validateRecipesExist(recipeIds);
    }
    const recipesMenuToSave = this.recipeMenuRepository.create(
      menuInfo.recipes,
    );
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    if (parentMenuId) {
      const menuTemplate = await this.findOne(parentMenuId, ['recipeMenus']);
      if (!menuTemplate)
        throw new BadRequestException('El menú padre no existe');
      newMenu.name = menuInfo.name ?? menuTemplate.name;
      newMenu.basePrice = menuInfo.basePrice ?? menuTemplate.basePrice;
      newMenu.comboPrice = menuInfo.comboPrice ?? menuTemplate.comboPrice;
      if (!menuInfo.targetDay)
        throw new BadRequestException(
          'Debe especificar el "target_day" para el menú',
        );
      newMenu.targetDay = menuInfo.targetDay;
      newMenu.parentMenu.id = parentMenuId;
    } else {
      if (
        !menuInfo.name ||
        !menuInfo.basePrice ||
        !menuInfo.comboPrice ||
        !menuInfo.targetDay
      )
        throw new BadRequestException(
          `No puede crear un menú sin la información básica`,
        );
      newMenu.name = menuInfo.name;
      newMenu.basePrice = menuInfo.basePrice;
      newMenu.comboPrice = menuInfo.comboPrice;
      newMenu.targetDay = menuInfo.targetDay;
    }
    recipesMenuToSave.push(
      ...(menuInfo.recipes?.map((recipe) => {
        return this.recipeMenuRepository.create({
          ...recipe,
          menu: { id: newMenu.id },
        });
      }) || []),
    );
  }
}
