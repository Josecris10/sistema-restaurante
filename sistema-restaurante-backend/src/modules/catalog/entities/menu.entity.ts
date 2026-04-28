import {
  Entity,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
  DeleteDateColumn,
} from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { RecipeMenu } from './recipe-menu.entity';

@Entity('menus')
export class Menu extends BaseEntity {
  @Column({ type: 'varchar', length: 100, nullable: false })
  name: string;

  @Column({
    name: 'is_template',
    type: 'bool',
    default: false,
    nullable: false,
  })
  isTemplate: boolean;

  @Column({ name: 'base_price', type: 'int', nullable: true })
  basePrice: number;

  @Column({ name: 'combo_price', type: 'int', nullable: true })
  comboPrice: number;

  @Column({ name: 'target_day', type: 'date', nullable: true })
  targetDay: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt: Date;

  @ManyToOne(() => Menu, (menu) => menu.childrenMenus, { nullable: true })
  @JoinColumn({ name: 'parent_menu_id' })
  parentMenu: Menu;

  @OneToMany(() => Menu, (menu) => menu.parentMenu)
  childrenMenus: Menu[];

  @OneToMany(() => RecipeMenu, (recipeMenu) => recipeMenu.menu)
  recipeMenus: RecipeMenu[];
}
