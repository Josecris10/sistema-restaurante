import { BaseEntity } from 'src/common/entities/base.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { UserRole } from '../enums/user-role.enum';

import { Order } from 'src/modules/orders/entities/order.entity';

@Entity('users')
export class User extends BaseEntity {
  @Column({ name: 'name', type: 'varchar', length: 50, nullable: false })
  name: string;

  @Column({ name: 'lastName', type: 'varchar', length: 50, nullable: false })
  lastName: string;

  @Column({ name: 'email', type: 'varchar', length: 100, unique: true })
  email: string;

  @Column({ name: 'password', type: 'varchar', length: 255, select: false })
  password: string;

  @Column({
    name: 'rut',
    type: 'varchar',
    length: 20,
    unique: true,
    nullable: true,
  })
  rut?: string;

  @Column({
    name: 'role',
    type: 'enum',
    enum: UserRole,
    default: UserRole.WAITER,
  })
  role: UserRole;

  @Column({ type: 'boolean', name: 'is_active', default: true })
  isActive: boolean;

  @OneToMany(() => Order, (order) => order.waiter)
  orders: Order[];
}
