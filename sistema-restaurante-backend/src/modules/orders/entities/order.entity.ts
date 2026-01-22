import { Entity, Column, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { ItemDetail } from './item-detail.entity';
import { User } from '../../users/entities/user.entity';
import { Table } from 'src/modules/tables/entities/table.entity';

import { KitchenState } from '../enums/kitchen-state.enum';
import { OrderState } from '../enums/order-state.enum';
@Entity('orders')
export class Order extends BaseEntity {
  @Column({
    name: 'kitchen_state',
    type: 'enum',
    enum: KitchenState,
    default: KitchenState.RECEIVED,
  })
  kitchenState: KitchenState;

  @Column({
    name: 'order_state',
    type: 'enum',
    enum: OrderState,
    default: OrderState.RECEIVED,
  })
  orderState: KitchenState;

  @Column({ name: 'client_name', type: 'varchar', length: 100 })
  clientName: string;

  @Column({ name: 'closed_at', type: 'timestamptz' })
  closedAt: Date;

  @ManyToOne(() => Table, (table) => table.orders)
  @JoinColumn({ name: 'table_id' })
  table: Table;

  @ManyToOne(() => User, (user) => user.orders)
  @JoinColumn({ name: 'waiter_id' })
  waiter: User;

  @OneToMany(() => ItemDetail, (itemDetail) => itemDetail.order)
  itemDetails: ItemDetail[];
}
