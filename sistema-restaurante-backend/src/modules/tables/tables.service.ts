import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Table } from './entities/table.entity';
import { CreateTableDto } from './dto/create-table.dto';

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

  async findAll() {
    return await this.tableRepository.find();
  }
}
