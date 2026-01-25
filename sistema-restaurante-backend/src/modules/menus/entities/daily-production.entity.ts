import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Recipe } from '../../recipes/entities/recipe.entity';

@Entity('daily_productions')
export class DailyProduction extends BaseEntity {
  @Index()
  @Column({ type: 'date', name: 'scheduled_date ' })
  scheduledDate: string;

  @Column({ name: 'total', type: 'int' })
  total: number;

  @Column({ name: 'remaining', type: 'int' })
  remaining: number;

  @ManyToOne(() => Recipe, (recipe) => recipe.dailyProductions)
  @JoinColumn({ name: 'recipe_id' })
  recipe: Recipe;
}
