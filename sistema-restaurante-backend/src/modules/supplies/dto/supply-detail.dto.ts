import { ApiProperty } from '@nestjs/swagger';
import { SupplyResponseDto } from './supply-response.dto';
import { SupplyBatchResponseDto } from './supply-batch-response.dto';

export class SupplyDetailDto extends SupplyResponseDto {
  @ApiProperty({
    description: 'Lista de lotes activos ordenados por vencimiento (FIFO)',
    type: [SupplyBatchResponseDto],
  })
  batches: SupplyBatchResponseDto[];
}
