import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { RecipeMenu } from './recipe-menu.entity';

@Entity('menus')
export class Menu extends BaseEntity {
  @Column({ type: 'varchar', length: 100, unique: true, nullable: false })
  name: string;

  @OneToMany(() => RecipeMenu, (recipeMenu) => recipeMenu.menu)
  recipeMenus: RecipeMenu[];
}
