import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

import { Table } from './entities/table.entity';
import { CreateTableDto } from './dto/create-table.dto';
import { TableResponseDto } from './dto/table-response.dto';
import { TableStatus } from './enums/table-status.enum';
@Injectable()
export class TablesService {
  constructor(
    @InjectRepository(Table)
    private readonly tableRepository: Repository<Table>,
  ) {}

  async create(tableData: CreateTableDto) {
    const table = this.tableRepository.create(tableData);
    return await this.tableRepository.save(table);
  }

  async findAll(): Promise<TableResponseDto[]> {
    const tables = await this.tableRepository.find();

    return tables.map((table) => {
      return {
        id: table.id,
        number: table.number,
        ubication: table.ubication,
        state: table.state,
      };
    });
  }
  async findOne(id: number): Promise<TableResponseDto> {
    const table = await this.tableRepository.findOneBy({ id });

    if (!table) {
      throw new NotFoundException(`La mesa con ID ${id} no existe`);
    }

    return table;
  }

  async delete(id: number) {
    const table = await this.findOne(id);

    if (!table) {
      throw new NotFoundException(`La mesa con ID ${id} no existe`);
    }

    this.tableRepository.delete(id);

    return {
      message: `La mesa #${table.number} se ha eliminado correctamente.`,
    };
  }

  async releaseTable(id: number, manager?: EntityManager) {
    const repo = manager ? manager.getRepository(Table) : this.tableRepository;
    const table = await repo.findOne({ where: { id } });
    if (!table) throw new NotFoundException('Mesa no encontrada');

    table.state = TableStatus.AVAILABLE;

    return await repo.save(table);
  }
}
