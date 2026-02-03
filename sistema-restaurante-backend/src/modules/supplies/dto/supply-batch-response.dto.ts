import { ApiProperty } from '@nestjs/swagger';

export class SupplyBatchResponseDto {
  @ApiProperty({ example: 1, description: 'ID único del lote' })
  id: number;

  @ApiProperty({
    example: 50,
    description: 'Cantidad inicial ingresada en este lote',
  })
  initialQuantity: number;

  @ApiProperty({
    example: 'Selecta',
    description: 'Marca o detalle específico del lote',
    nullable: true,
  })
  brand: string;

  @ApiProperty({
    example: 1500,
    description: 'Costo por unidad al momento de la compra',
  })
  costPrice: number;

  @ApiProperty({
    example: '2026-05-20',
    description: 'Fecha de vencimiento',
    nullable: true,
  })
  expirationDate?: Date;

  @ApiProperty({
    example: '2026-02-02',
    description: 'Fecha en que se recibió el lote',
  })
  receivedDate: Date;
}
