import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { PaginationDto } from '../../../common/dto/pagination.dto';
export class GetSuppliesFilterDto extends PaginationDto {
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
}
