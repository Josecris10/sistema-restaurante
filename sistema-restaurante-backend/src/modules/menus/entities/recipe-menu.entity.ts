import { Entity, Column, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Menu } from './menu.entity';
import { Recipe } from 'src/modules/recipes/entities/recipe.entity';

@Entity('recipe_menus')
export class RecipeMenu extends BaseEntity {
  @Column({ type: 'varchar', length: 100, unique: true, nullable: false })
  name: string;

  @Column({ type: 'date', nullable: false })
  scheduled_date: string;

  @ManyToOne(() => Menu, (menu) => menu.recipeMenus)
  @JoinColumn({ name: 'menu_id' })
  menu: Menu;

  @ManyToOne(() => Recipe, (recipe) => recipe.recipeMenus)
  @JoinColumn({ name: 'recipe_id' })
  recipe: Recipe;
}
