import { BaseEntity } from 'src/common/entities/base.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Supply } from '../../supplies/entities/supply.entity';
import { Recipe } from './recipe.entity';

@Entity('recipe_supplies')
export class RecipeSupply extends BaseEntity {
  @Column({ name: 'quantity', type: 'float', nullable: false })
  quantity: number;

  @ManyToOne(() => Supply, (supply) => supply.recipeSupplies)
  @JoinColumn({ name: 'supply_id' })
  supply: Supply;

  @ManyToOne(() => Recipe, (recipe) => recipe.recipeSupplies)
  @JoinColumn({ name: 'recipe_id' })
  recipe: Recipe;
}
