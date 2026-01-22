import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Recipe } from './entities/recipe.entity';
import { RecipeSupply } from './entities/recipe-supply.entity';

@Injectable()
export class RecipesService {
  constructor(
    @InjectRepository(Recipe)
    private readonly recipeRepository: Repository<Recipe>,

    @InjectRepository(RecipeSupply)
    private readonly recipeSupplyRepository: Repository<RecipeSupply>,
  ) {}
}
