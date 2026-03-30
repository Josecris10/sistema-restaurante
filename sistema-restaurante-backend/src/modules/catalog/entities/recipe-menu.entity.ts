import { Entity, Column, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Menu } from './menu.entity';
import { Recipe } from 'src/modules/recipes/entities/recipe.entity';
import { CourseTypeEnum } from '../enums/course-type.dto';

@Entity('recipe_menus')
export class RecipeMenu extends BaseEntity {
  @Column({ type: 'varchar', length: 100, unique: true, nullable: false })
  name: string;

  @Column({
    name: 'course_type',
    type: 'enum',
    enum: CourseTypeEnum,
    nullable: false,
  })
  courseType: CourseTypeEnum;

  @ManyToOne(() => Menu, (menu) => menu.recipeMenus)
  @JoinColumn({ name: 'menu_id' })
  menu: Menu;

  @ManyToOne(() => Recipe, (recipe) => recipe.recipeMenus)
  @JoinColumn({ name: 'recipe_id' })
  recipe: Recipe;
}
