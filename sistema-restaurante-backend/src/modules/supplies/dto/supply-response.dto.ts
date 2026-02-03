import { ApiProperty } from '@nestjs/swagger';

export class SupplyResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Posta negra' })
  name: string;

  @ApiProperty({ example: 'INGREDIENT' })
  type: string;

  @ApiProperty({ example: 15.5 })
  minimumStock: number;

  @ApiProperty({ example: 'KG' })
  unitMeasurement: string;

  @ApiProperty({
    example: 150.5,
    description: 'Suma total de cantidad disponible en todos los lotes',
  })
  totalStock: number;

  @ApiProperty({
    example: true,
    description: 'Indica si el insumo está con stock crítico',
  })
  isCritical: boolean;
}
