import { BaseEntity } from 'src/common/entities/base.entity';
import { BeforeInsert, Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { Supply } from './supply.entity';

@Entity('supply_batches')
export class SupplyBatch extends BaseEntity {
  @Column({ name: 'initial_quantity', type: 'float', nullable: false })
  initialQuantity: number;

  @Column({ name: 'remaining_quantity', type: 'float', nullable: true })
  remainingQuantity: number;

  @Column({ name: 'expiration_date', type: 'date' })
  expirationDate: Date;

  @Column({
    name: 'received_date',
    type: 'date',
    default: () => 'CURRENT_DATE',
  })
  received_date: Date;

  @Column({ name: 'cost_price', type: 'int', nullable: false })
  costPrice: number;

  @BeforeInsert()
  setInitialRemaining() {
    if (this.remainingQuantity === undefined) {
      this.remainingQuantity = this.initialQuantity;
    }
  }

  @ManyToOne(() => Supply, (supply) => supply.supplyBatches)
  @JoinColumn({ name: 'supply_id' })
  supply: Supply;
}
