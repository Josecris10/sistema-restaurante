import { BaseEntity } from 'src/common/entities/base.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { Order } from './order.entity';
import { Item } from './item.entity';

@Entity('item_details')
export class ItemDetail extends BaseEntity {
  @Column({
    type: 'int',
    nullable: false,
  })
  quantity: number;

  @Column({
    name: 'actual_price',
    type: 'int',
    nullable: false,
  })
  actualPrice: number;

  @Column({ type: 'varchar', length: 100 })
  detail: string;

  @ManyToOne(() => Order, (order) => order.itemDetails)
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @ManyToOne(() => Item, (item) => item.itemDetails)
  @JoinColumn({ name: 'item_id ' })
  item: Item;
}
