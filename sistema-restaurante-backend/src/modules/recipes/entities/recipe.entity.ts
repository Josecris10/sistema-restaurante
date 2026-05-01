import { Entity, Column, OneToMany, OneToOne } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';

import { DailyProduction } from '../../catalog/entities/daily-production.entity';
import { MenuItem } from '../../catalog/entities/menu-item.entity';
import { Item } from '../../catalog/entities/item.entity';
import { RecipeSupply } from './recipe-supply.entity';

@Entity('recipes')
export class Recipe extends BaseEntity {
  @Column({ type: 'varchar', length: 100, unique: true, nullable: false })
  name: string;

  @Column({ name: 'additional_info', type: 'text', nullable: true })
  additionalInfo: string;

  @OneToMany(() => DailyProduction, (dailyProduction) => dailyProduction.recipe)
  dailyProductions: DailyProduction[];

  @OneToMany(() => MenuItem, (menuItem) => menuItem.item)
  menuItems: MenuItem[];

  @OneToMany(() => RecipeSupply, (recipeSupply) => recipeSupply.recipe)
  recipeSupplies: RecipeSupply[];

  @OneToOne(() => Item, (item) => item.recipe)
  item: Item;
}
