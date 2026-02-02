import {
  IsNumber,
  IsPositive,
  IsOptional,
  IsDateString,
  IsNotEmpty,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSupplyBatchDto {
  @ApiProperty({ example: 'Selecta', required: false })
  @IsOptional()
  @IsString()
  brand?: string;

  @ApiProperty({
    example: 1,
    description: 'ID del insumo al que pertenece este lote',
  })
  @IsNotEmpty()
  @IsNumber()
  supplyId: number;

  @ApiProperty({
    example: 100,
    description: 'Cantidad inicial que entra al almacén',
  })
  @IsNumber()
  @IsPositive()
  initialQuantity: number;

  @ApiProperty({ example: 2500.5, description: 'Costo de compra por unidad' })
  @IsNumber()
  @IsPositive()
  costPrice: number;

  @ApiProperty({ example: '2026-12-31', required: false })
  @IsOptional()
  @IsDateString()
  expirationDate?: string;

  @ApiProperty({ example: '2026-12-31', required: false })
  @IsOptional()
  @IsDateString()
  receivedDate?: string;
}
