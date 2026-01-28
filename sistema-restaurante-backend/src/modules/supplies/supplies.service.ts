import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Supply } from './entities/supply.entity';
import { SupplyBatch } from './entities/supply-batch.entity';
import { GetSuppliesFilterDto } from './dto/get-supplies-filter.dto';
import { SupplyResponseDto } from './dto/supply-response.dto';

@Injectable()
export class SuppliesService {
  constructor(
    @InjectRepository(Supply)
    private readonly supplyRepository: Repository<Supply>,

    @InjectRepository(SupplyBatch)
    private readonly supplyBatchRepository: Repository<SupplyBatch>,
  ) {}

  async findAll(
    filterDto: GetSuppliesFilterDto,
  ): Promise<{ data: SupplyResponseDto[]; total: number }> {
    const { name, type, minimumStock, page = 1, limit = 10 } = filterDto;
    const skip = (page - 1) * limit;

    const query = this.supplyRepository
      .createQueryBuilder('supply')

      .leftJoin('supply.supplyBatches', 'batch')
      .select('supply.id', 'id')
      .addSelect('supply.name', 'name')
      .addSelect('supply.type', 'type')
      .addSelect('supply.unit_measurement', 'unit')
      .addSelect('SUM(COALESCE(batch.remainingQuantity, 0))', 'totalStock')
      .groupBy('supply.id');

    if (name) {
      query.andWhere('LOWER(supply.name) LIKE LOWER(:name)', {
        name: `%${name}%`,
      });
    }

    if (type) {
      query.andWhere('supply.type = :type', { type });
    }

    if (minimumStock !== undefined) {
      query.having(
        'SUM(COALESCE(batch.remainingQuantity, 0)) <= :minimumStock',
        { minimumStock },
      );
    }

    const total = await query.getCount();

    const rawResults = await query.limit(limit).offset(skip).getRawMany();

    const data = rawResults.map((res) => ({
      id: Number(res.id),
      name: res.name,
      type: res.type,
      unit_measurement: res.unit,
      totalStock: Number(res.totalStock),
    }));

    return { data, total };
  }
}
