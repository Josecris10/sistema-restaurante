import { BaseEntity } from 'src/common/entities/base.entity';
import { Column, Entity, OneToMany, OneToOne } from 'typeorm';

import { SupplyType } from '../enums/supply-type.enum';

import { Item } from 'src/modules/orders/entities/item.entity';
import { SupplyBatch } from './supply-batch.entity';
import { RecipeSupply } from 'src/modules/recipes/entities/recipe-supply.entity';

@Entity('supplies')
export class Supply extends BaseEntity {
  @Column({
    name: 'name',
    type: 'varchar',
    length: 100,
    nullable: false,
    unique: true,
  })
  name: string;

  @Column({ name: 'minimum_stock', type: 'int' })
  minimumStock: number;

  @Column({ name: 'unit_measurement', type: 'varchar', length: 20 })
  unitMeasurement: string;

  @Column({
    name: 'type',
    type: 'enum',
    enum: SupplyType,
    default: SupplyType.INGREDIENT,
  })
  type: SupplyType;

  @OneToOne(() => Item, (item) => item.supply)
  item: Item;

  @OneToMany(() => SupplyBatch, (supplyBatch) => supplyBatch.supply)
  supplyBatches: SupplyBatch[];

  @OneToMany(() => RecipeSupply, (recipeSupply) => recipeSupply.supply)
  recipeSupplies: RecipeSupply[];
}
