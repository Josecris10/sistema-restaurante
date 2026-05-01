import { Entity, Column, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Menu } from './menu.entity';
import { Recipe } from '../../recipes/entities/recipe.entity';
import { CourseTypeEnum } from '../enums/course-type.dto';
import { Item } from './item.entity';

@Entity('menu_items')
export class MenuItem extends BaseEntity {
  @Column({ type: 'varchar', length: 100, nullable: false })
  name: string;

  @Column({
    name: 'course_type',
    type: 'enum',
    enum: CourseTypeEnum,
    nullable: false,
  })
  courseType: CourseTypeEnum;

  @ManyToOne(() => Menu, (menu) => menu.menuItems)
  @JoinColumn({ name: 'menu_id' })
  menu: Menu;

  @ManyToOne(() => Item)
  @JoinColumn({ name: 'item_id' })
  item: Item;
}
