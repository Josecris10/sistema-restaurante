import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class RecipeSupplyDto {
  @ApiProperty({ example: 3 })
  @IsNumber()
  @IsNotEmpty()
  supplyId: number;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  quantity: number;
}
