import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { RecipeMenuDto } from './recipe-menu.dto';

export class CreateMenuDto {
  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'Menú del día martes' })
  name?: string;

  @IsBoolean()
  @IsNotEmpty()
  isTemplate: boolean;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ example: 6000 })
  basePrice?: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ example: 6500 })
  comboPrice?: number;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  @ApiProperty({ example: '2026-04-15' })
  targetDay?: Date;

  @IsNumber()
  @IsOptional()
  parentMenuId?: number;

  @IsArray()
  @IsNotEmpty()
  recipes: RecipeMenuDto[];
}
