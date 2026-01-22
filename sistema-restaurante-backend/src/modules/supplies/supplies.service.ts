import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Supply } from './entities/supply.entity';
import { SupplyBatch } from './entities/supply-batch.entity';

@Injectable()
export class SuppliesService {
  constructor(
    @InjectRepository(Supply)
    private readonly supplyRepository: Repository<Supply>,

    @InjectRepository(SupplyBatch)
    private readonly supplyBatchRepository: Repository<SupplyBatch>,
  ) {}
}
