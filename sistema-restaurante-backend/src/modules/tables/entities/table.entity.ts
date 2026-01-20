import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { TableStatus } from '../enums/table-status.enum';

@Entity('tables')
export class Table extends BaseEntity {
  @Column({ type: 'int', unique: true })
  number: number;

  @Column({ type: 'varchar', default: 'LIBRE' })
  state: TableStatus;
}
