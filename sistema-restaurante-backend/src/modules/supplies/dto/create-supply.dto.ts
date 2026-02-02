import {
  IsString,
  IsNumber,
  IsEnum,
  IsPositive,
  Min,
  IsNotEmpty,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { SupplyType } from '../enums/supply-type.enum';

export class CreateSupplyDto {
  @ApiProperty({ example: 'Harina Selecta' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ enum: SupplyType, example: SupplyType.INGREDIENT })
  @IsEnum(SupplyType)
  type: SupplyType;

  @ApiProperty({ example: 10, description: 'Stock de alerta' })
  @IsNumber()
  @Min(0)
  minimumStock: number;

  @ApiProperty({ example: 'KG' })
  @IsString()
  @IsNotEmpty()
  unitMeasurement: string;
}
