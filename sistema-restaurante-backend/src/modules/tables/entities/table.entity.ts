import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { TableStatus } from '../enums/table-status.enum';

import { Order } from 'src/modules/orders/entities/order.entity';

@Entity('tables')
export class Table extends BaseEntity {
  @Column({ type: 'int', unique: true })
  number: number;

  @Column({ type: 'varchar', default: 'LIBRE' })
  state: TableStatus;

  @OneToMany(() => Order, (order) => order.table)
  orders: Order[];
}
