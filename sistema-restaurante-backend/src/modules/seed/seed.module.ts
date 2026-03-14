// seed.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';

import { Supply } from '../supplies/entities/supply.entity';
import { SupplyBatch } from '../supplies/entities/supply-batch.entity';
import { Recipe } from '../recipes/entities/recipe.entity';
import { RecipeSupply } from '../recipes/entities/recipe-supply.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Supply, SupplyBatch, Recipe, RecipeSupply]),
  ],
  controllers: [SeedController],
  providers: [SeedService],
})
export class SeedModule {}
