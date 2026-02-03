import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateSupplyBatchDto } from './create-supply-batch.dto';

export class UpdateSupplyBatchDto extends PartialType(
  OmitType(CreateSupplyBatchDto, ['supplyId'] as const),
) {}
