import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { TableStatus } from '../enums/table-status.enum';
import { TableUbication } from '../enums/table-ubication.enum';

import { Order } from 'src/modules/orders/entities/order.entity';

@Entity('tables')
export class Table extends BaseEntity {
  @Column({ type: 'int', unique: true })
  number: number;

  @Column({ type: 'varchar', default: TableStatus.AVAILABLE })
  state: TableStatus;

  @Column({ name: 'ubication', type: 'enum', enum: TableUbication })
  ubication: TableUbication;

  @OneToMany(() => Order, (order) => order.table)
  orders: Order[];
}
