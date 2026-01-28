import { ApiProperty } from '@nestjs/swagger';

export class SupplyResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Posta negra' })
  name: string;

  @ApiProperty({ example: 'INGREDIENT' })
  type: string;

  @ApiProperty({
    example: 150.5,
    description: 'Suma total de cantidad disponible en todos los lotes',
  })
  totalStock: number;
}
