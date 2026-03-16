import { ApiProperty } from '@nestjs/swagger';
import { RecipeSupplyDto } from './recipe-supply.dto';

class IngredientResponse extends RecipeSupplyDto {
  @ApiProperty({ example: 'Carne de vacuno' })
  supplyName?: string;
}

export class RecipeResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Carne a la cacerola' })
  name: string;

  @ApiProperty({ example: 'Lleva verduras y se hace a la cacerola' })
  additionalInfo?: string;

  @ApiProperty({
    description: 'Lista de ingredientes necesarios para la preparación',
    type: [IngredientResponse],
  })
  ingredients: IngredientResponse[];
}
