import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Menu } from './entities/menu.entity';
import { MenuItem } from './entities/menu-item.entity';
import { DailyProduction } from './entities/daily-production.entity';
import { CreateMenuDto } from './dto/create-menu.dto';
import { RecipesService } from '../recipes/recipes.service';
import { ItemsService } from './items.service';

@Injectable()
export class CatalogService {
  constructor(
    @InjectRepository(Menu)
    private readonly menuRepository: Repository<Menu>,

    @InjectRepository(MenuItem)
    private readonly menuItemRespository: Repository<MenuItem>,

    @InjectRepository(DailyProduction)
    private readonly dailyProductionRepository: Repository<DailyProduction>,
    private readonly dataSource: DataSource,
    private readonly recipesService: RecipesService,
    private readonly itemsService: ItemsService,
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

    if (!menuInfo.items)
      throw new BadRequestException('El campo "items" debe estar definido');
    if (menuInfo.items.length > 0) {
      const itemIds = menuInfo.items.flatMap((r) => r.itemId ?? []);
      await this.itemsService.validateItemsExist(itemIds);
    }
    if (!menuInfo.targetDay && !isTemplate) {
      throw new BadRequestException('Debe especificar la fecha del menú');
    }

    if (isTemplate) {
      const missing = (['menuName', 'basePrice', 'comboPrice'] as const).find(
        (prop) => !menuInfo[prop],
      );
      if (missing) throw new BadRequestException(`Debe especificar ${missing}`);
    }

    if (parentMenuId) {
      const parentMenu = await this.findOne(parentMenuId);
      menuInfo.menuName = menuInfo.menuName ?? parentMenu?.name;
      menuInfo.basePrice = menuInfo.basePrice ?? parentMenu?.basePrice;
      menuInfo.comboPrice = menuInfo.comboPrice ?? parentMenu?.comboPrice;
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    const newMenu = this.menuRepository.create({
      name: menuInfo.menuName,
      isTemplate: isTemplate,
      basePrice: menuInfo.basePrice,
      comboPrice: menuInfo.comboPrice,
      targetDay: menuInfo.targetDay ?? undefined,
      parentMenu: parentMenuId ? { id: parentMenuId } : undefined,
    });

    try {
      await queryRunner.manager.save(newMenu);
      const menuItems = menuInfo.items.map((itemMenuDto) => {
        return this.menuItemRespository.create({
          name: itemMenuDto.itemName,
          courseType: itemMenuDto.courseType,
          menu: { id: newMenu.id },
          item: { id: itemMenuDto.itemId },
        });
      });
      await queryRunner.manager.save(menuItems);
      await queryRunner.commitTransaction();
      return {
        menuId: newMenu.id,
        menuName: newMenu.name,
        items: menuItems.map((rm) => {
          return {
            courseType: rm.courseType,
            itemId: rm.item.id,
          };
        }),
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      if (error instanceof HttpException) throw error;
      else
        throw new InternalServerErrorException(
          'Ocurrió un error al intentar registrar el menú ',
        );
    } finally {
      await queryRunner.release();
    }
  }
}
