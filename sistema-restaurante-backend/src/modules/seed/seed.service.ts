import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Supply } from '../supplies/entities/supply.entity';
import { SupplyBatch } from '../supplies/entities/supply-batch.entity';
import { Recipe } from '../recipes/entities/recipe.entity';
import { RecipeSupply } from '../recipes/entities/recipe-supply.entity';

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(Supply)
    private readonly supplyRepository: Repository<Supply>,
    @InjectRepository(SupplyBatch)
    private readonly supplyBatchRepository: Repository<SupplyBatch>,
    @InjectRepository(Recipe)
    private readonly recipeRepository: Repository<Recipe>,
    @InjectRepository(RecipeSupply)
    private readonly recipeSupplyRepository: Repository<RecipeSupply>,
  ) {}

  async runSeed() {
    // 1. Verificamos si ya hay datos en la tabla principal (Supplies)
    const existingSuppliesCount = await this.supplyRepository.count();

    // 2. Si hay al menos 1 insumo, abortamos para no duplicar datos
    if (existingSuppliesCount > 0) {
      return {
        message:
          'La base de datos ya contiene información. El Seed fue omitido por seguridad.',
      };
    }

    // 3. Si está vacía, procedemos a insertar
    await this.insertNewData();
    return {
      message: 'Base de datos poblada exitosamente con datos de prueba.',
    };
  }

  private async insertNewData() {
    // 1. Crear Insumos (Supplies)
    const harina = this.supplyRepository.create({
      name: 'Harina de Trigo 000',
      minimumStock: 10,
      unitMeasurement: 'KG',
      // type usa el default INGREDIENT
    });

    const queso = this.supplyRepository.create({
      name: 'Queso Mozzarella',
      minimumStock: 5,
      unitMeasurement: 'KG',
    });

    const tomate = this.supplyRepository.create({
      name: 'Tomate Triturado',
      minimumStock: 15,
      unitMeasurement: 'LT',
    });

    await this.supplyRepository.save([harina, queso, tomate]);

    // 2. Crear Lotes de Insumos (SupplyBatches)
    const batches = this.supplyBatchRepository.create([
      {
        brand: 'Selecta',
        initialQuantity: 25,
        expirationDate: new Date('2026-12-31'),
        costPrice: 25000,
        supply: harina,
      },
      {
        brand: 'Soprole',
        initialQuantity: 10,
        expirationDate: new Date('2026-05-15'),
        costPrice: 65000,
        supply: queso,
      },
      {
        brand: 'Pomarola',
        initialQuantity: 20,
        expirationDate: new Date('2027-01-01'),
        costPrice: 18000,
        supply: tomate,
      },
    ]);

    await this.supplyBatchRepository.save(batches);

    // 3. Crear Receta
    const pizzaRecipe = this.recipeRepository.create({
      name: 'Pizza Margarita',
      additionalInfo: 'Masa de fermentación lenta (24h) con salsa base.',
    });

    await this.recipeRepository.save(pizzaRecipe);

    // 4. Vincular Insumos a la Receta (RecipeSupplies)
    const recipeSupplies = this.recipeSupplyRepository.create([
      {
        quantity: 0.3, // 300 gramos de harina
        supply: harina,
        recipe: pizzaRecipe,
      },
      {
        quantity: 0.2, // 200 gramos de queso
        supply: queso,
        recipe: pizzaRecipe,
      },
      {
        quantity: 0.1, // 100 ml de tomate
        supply: tomate,
        recipe: pizzaRecipe,
      },
    ]);

    await this.recipeSupplyRepository.save(recipeSupplies);
  }
}
