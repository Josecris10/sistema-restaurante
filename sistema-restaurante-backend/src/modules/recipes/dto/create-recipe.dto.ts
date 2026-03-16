import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { RecipeSupplyDto } from './recipe-supply.dto';
import { Type } from 'class-transformer';

export class CreateRecipeDto {
  @ApiProperty({ example: 'Carne a la cacerola' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'Carne jugosa con verduras hecha en la olla a presión',
  })
  @IsString()
  @IsOptional()
  additionalInfo: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RecipeSupplyDto)
  ingredients: RecipeSupplyDto[];
}
