import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class GetSuppliesFilterDto {
  @ApiProperty({
    description: 'Buscar por nombre del insumo (coincidencia parcial)',
    required: false,
    example: 'Harina',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: 'Filtrar por categoría exacta',
    required: false,
    example: 'INGREDIENT',
  })
  @IsOptional()
  @IsString()
  type?: string;

  @ApiProperty({
    description: 'Mostrar insumos con stock total menor o igual a este número',
    required: false,
    example: 10,
    type: Number,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  stockThreshold?: number;

  @ApiProperty({ required: false, example: 1, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiProperty({ required: false, example: 10, default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number = 10;
}
