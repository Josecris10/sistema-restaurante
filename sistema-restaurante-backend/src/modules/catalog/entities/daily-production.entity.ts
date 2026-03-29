import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Recipe } from '../../recipes/entities/recipe.entity';
import { DailyProductionStatusEnum } from '../enums/daily-production-status.enum';

@Entity('daily_productions')
export class DailyProduction extends BaseEntity {
  @Index()
  @Column({ type: 'date', name: 'scheduled_date ' })
  scheduledDate: string;

  @Column({ name: 'total', type: 'int' })
  total: number;

  @Column({ name: 'remaining', type: 'int' })
  remaining: number;

  @Column({
    type: 'enum',
    enum: DailyProductionStatusEnum,
    default: DailyProductionStatusEnum.PLANNED,
  })
  status: DailyProductionStatusEnum;

  @ManyToOne(() => Recipe, (recipe) => recipe.dailyProductions)
  @JoinColumn({ name: 'recipe_id' })
  recipe: Recipe;
}
