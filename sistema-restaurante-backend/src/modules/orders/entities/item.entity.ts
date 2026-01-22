import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { BaseEntity } from 'src/common/entities/base.entity';

import { ItemDetail } from './item-detail.entity';
import { Supply } from '../../supplies/entities/supply.entity';
import { Recipe } from 'src/modules/recipes/entities/recipe.entity';

@Entity('items')
export class Item extends BaseEntity {
  @Column({ type: 'varchar', length: 100, nullable: false })
  name: string;

  @Column({ name: 'unit_price', type: 'int', nullable: false })
  unitPrice: number;

  @OneToMany(() => ItemDetail, (itemDetail) => itemDetail.item)
  itemDetails: ItemDetail[];

  @OneToOne(() => Supply, (supply) => supply.item)
  @JoinColumn({ name: 'supply_id' })
  supply: Supply;

  @OneToOne(() => Recipe, (recipe) => recipe.item)
  @JoinColumn({ name: 'recipe_id' })
  recipe: Recipe;
}
