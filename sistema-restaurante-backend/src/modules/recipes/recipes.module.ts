import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecipesService } from './recipes.service';
import { RecipesController } from './recipes.controller';
import { Recipe } from './entities/recipe.entity';
import { RecipeSupply } from './entities/recipe-supply.entity';
import { AuthModule } from '../auth/auth.module';
import { SuppliesModule } from '../supplies/supplies.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Recipe, RecipeSupply]),
    AuthModule,
    SuppliesModule,
  ],
  controllers: [RecipesController],
  providers: [RecipesService],
  exports: [RecipesService],
})
export class RecipesModule {}
