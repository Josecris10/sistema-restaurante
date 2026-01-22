import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { RecipeMenu } from './recipe-menu.entity';

@Entity('menus')
export class Menu extends BaseEntity {
  @Column({ type: 'varchar', length: 100, unique: true, nullable: false })
  name: string;

  @Column({ name: 'scheduled_date', type: 'date', nullable: false })
  scheduledDate: string;

  @OneToMany(() => RecipeMenu, (recipeMenu) => recipeMenu.menu)
  recipeMenus: RecipeMenu[];
}
