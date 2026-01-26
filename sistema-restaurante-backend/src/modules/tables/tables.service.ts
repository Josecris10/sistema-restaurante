import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Table } from './entities/table.entity';
import { CreateTableDto } from './dto/create-table.dto';
import { TableResponseDto } from './dto/table-response.dto';
import { table } from 'console';
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
      };
    });
  }
  async findOne(id: number): Promise<TableResponseDto> {
    const table = await this.tableRepository.findOneBy({ id });

    if (!table) {
      throw new NotFoundException(`La mesa con ID ${id} no existe`);
    }

    return {
      id: table.id,
      number: table.number,
      ubication: table.ubication,
    };
  }
}
