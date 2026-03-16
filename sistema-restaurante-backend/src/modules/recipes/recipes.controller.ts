import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { RecipesService } from './recipes.service';
import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

import { CreateRecipeDto } from './dto/create-recipe.dto';
import { RecipeResponseDto } from './dto/recipe-response.dto';
import { BaseResponseDto } from 'src/common/dto/base-response.dto';
import { GetRecipesFilterDto } from './dto/get-recipes-filter-dto';

@ApiTags('Recipes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('recipes')
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva receta' })
  async create(
    @Body() recipeData: CreateRecipeDto,
  ): Promise<BaseResponseDto<RecipeResponseDto>> {
    const recipe = await this.recipesService.create(recipeData);
    return { data: recipe };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una receta por su ID' })
  @ApiOkResponse({ type: RecipeResponseDto })
  @ApiNotFoundResponse({ description: 'Receta no encontrada' })
  async findOne(
    @Param('id') id: string,
  ): Promise<BaseResponseDto<RecipeResponseDto>> {
    const recipe = await this.recipesService.findOne(+id);
    return { data: recipe };
  }

  @Get()
  @ApiOperation({
    summary: 'Obtener todas las recetas con paginación y filtros',
  })
  @ApiOkResponse({ type: RecipeResponseDto, isArray: true })
  async findAll(
    @Query() filters: GetRecipesFilterDto,
  ): Promise<BaseResponseDto<RecipeResponseDto>> {
    const recipes = await this.recipesService.findAll(filters);
    return {
      data: recipes.data,
      total: recipes.total,
    };
  }
}
