import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Supply } from './entities/supply.entity';
import { SupplyBatch } from './entities/supply-batch.entity';
import { GetSuppliesFilterDto } from './dto/get-supplies-filter.dto';
import { SupplyResponseDto } from './dto/supply-response.dto';
import { CreateSupplyBatchDto } from './dto/create-supply-batch.dto';
import { CreateSupplyDto } from './dto/create-supply.dto';
import { SupplyDetailDto } from './dto/supply-detail.dto';
import { UpdateSupplyDto } from './dto/update-supply.dto';
import { UpdateSupplyBatchDto } from './dto/update-supply-batch.dto';

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
    const { name, type, stockThreshold, page = 1, limit = 10 } = filterDto;
    const skip = (page - 1) * limit;

    const query = this.supplyRepository
      .createQueryBuilder('supply')

      .leftJoin('supply.supplyBatches', 'batch')
      .select('supply.id', 'id')
      .addSelect('supply.name', 'name')
      .addSelect('supply.type', 'type')
      .addSelect('supply.unitMeasurement', 'unitMeasurement')
      .addSelect('supply.minimumStock', 'minimumStock')
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

    if (stockThreshold !== undefined) {
      query.having(
        'SUM(COALESCE(batch.remainingQuantity, 0)) <= :stockThreshold',
        { stockThreshold },
      );
    }

    const total = await query.getCount();

    const rawResults = await query.limit(limit).offset(skip).getRawMany();

    const data = rawResults.map((res) => ({
      id: Number(res.id),
      name: res.name,
      type: res.type,
      unitMeasurement: res.unitMeasurement,
      minimumStock: Number(res.minimumStock),
      totalStock: Number(res.totalStock),
      isCritical: Number(res.totalStock) <= Number(res.minimumStock),
    }));

    return { data, total };
  }

  async findOne(id: number): Promise<SupplyDetailDto> {
    const supply = await this.supplyRepository.findOne({
      where: { id },
      relations: ['supplyBatches'],
    });

    if (!supply) {
      throw new NotFoundException(`El insumo con ID ${id} no existe`);
    }

    const totalStock = supply.supplyBatches.reduce(
      (acc, batch) => acc + Number(batch.remainingQuantity),
      0,
    );

    return {
      id: supply.id,
      name: supply.name,
      type: supply.type,
      unitMeasurement: supply.unitMeasurement,
      minimumStock: supply.minimumStock,
      totalStock,
      isCritical: totalStock <= Number(supply.minimumStock),
      batches: supply.supplyBatches
        .sort((a, b) => {
          if (!a.expirationDate) return 1;
          if (!b.expirationDate) return -1;
          return (
            new Date(a.expirationDate).getTime() -
            new Date(b.expirationDate).getTime()
          );
        })
        .map((batch) => ({
          id: batch.id,
          initialQuantity: Number(batch.initialQuantity),
          brand: batch.brand || 'Sin marca',
          costPrice: batch.costPrice,
          expirationDate: batch.expirationDate,
          receivedDate: batch.receivedDate,
        })),
    };
  }

  async createBatch(createBatchDto: CreateSupplyBatchDto) {
    const { supplyId, ...batchData } = createBatchDto;

    const supply = await this.supplyRepository.findOneBy({ id: supplyId });

    if (!supply) {
      throw new NotFoundException(
        `Insumo con ID ${supplyId} no encontrado. No se puede crear el lote.`,
      );
    }

    const newBatch = this.supplyBatchRepository.create({
      ...batchData,
      supply,
    });

    const savedBatch = await this.supplyBatchRepository.save(newBatch);

    return {
      id: savedBatch.id,
      initialQuantity: Number(savedBatch.initialQuantity),
      costPrice: Number(savedBatch.costPrice),
      expirationDate: savedBatch.expirationDate,
      receivedDate: savedBatch.receivedDate,
      supplyName: supply.name,
    };
  }

  async create(createSupplyDto: CreateSupplyDto) {
    const { name } = createSupplyDto;

    const existingSupply = await this.supplyRepository.findOne({
      where: { name: name.trim() },
    });

    if (existingSupply) {
      throw new ConflictException(
        `El insumo "${name}" ya existe en el sistema.`,
      );
    }

    const newSupply = this.supplyRepository.create(createSupplyDto);

    return await this.supplyRepository.save(newSupply);
  }

  async update(id: number, updateData: UpdateSupplyDto) {
    const supply = await this.supplyRepository.findOne({
      where: { id },
      relations: ['supplyBatches'],
    });

    if (!supply) throw new NotFoundException(`Insumo #${id} no encontrado`);

    if (
      updateData.unitMeasurement &&
      updateData.unitMeasurement !== supply.unitMeasurement
    ) {
      if (supply.supplyBatches.length > 0)
        throw new BadRequestException(
          'No se puede cambiar la unidad de medida, porque este insumo ya tiene stock histórico asociado.',
        );
    }

    if (updateData.name) {
      const duplicate = await this.supplyRepository.findOne({
        where: { name: updateData.name.trim() },
      });

      if (duplicate && duplicate.id !== id)
        throw new ConflictException(
          `Ya existe otro insumo con el nombre "${updateData.name}"`,
        );
    }

    const updatedSupply = Object.assign(supply, updateData);
    return await this.supplyRepository.save(updatedSupply);
  }

  async updateBatch(id: number, updateBatchData: UpdateSupplyBatchDto) {
    const batch = await this.supplyBatchRepository.findOne({
      where: { id },
      relations: ['supply'],
    });

    if (!batch) throw new NotFoundException(`Lote #${id} no encontrado`);
    Object.assign(batch, updateBatchData);

    const updatedBatch = await this.supplyBatchRepository.save(batch);

    return {
      supplyName: batch.supply.name,
      id: updatedBatch.id,
      initialQuantity: updatedBatch.initialQuantity,
      remainingQuantity: updatedBatch.remainingQuantity,
      expirationDate: updatedBatch.expirationDate,
      receivedDate: updatedBatch.receivedDate,
      brand: updatedBatch.brand,
      costPrice: updatedBatch.costPrice,
    };
  }
}
