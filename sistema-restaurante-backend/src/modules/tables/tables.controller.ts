import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { TablesService } from './tables.service';
import {
  getSchemaPath,
  ApiExtraModels,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateTableDto } from './dto/create-table.dto';
import { Entity } from 'typeorm';
import { BaseResponseDto } from 'src/common/dto/base-response.dto';
import { Table } from './entities/table.entity';
import { ApiOkResponsePaginated } from 'src/common/decorators/api-response.decorator';
import { TableResponseDto } from './dto/table-response.dto';

@ApiTags('Tables')
@ApiExtraModels(BaseResponseDto, Table)
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('tables')
export class TablesController {
  constructor(private readonly tablesService: TablesService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva mesa' })
  @ApiCreatedResponse({ description: 'La mesa ha sido creada.' })
  create(@Body() tableData: CreateTableDto) {
    return this.tablesService.create(tableData);
  }

  @Get()
  @ApiOkResponsePaginated(TableResponseDto)
  @ApiOperation({ summary: 'Obtener todas las mesas' })
  findAll() {
    return this.tablesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una mesa por su ID' })
  @ApiOkResponse({ type: TableResponseDto })
  @ApiNotFoundResponse({ description: 'La mesa con ese ID no existe' })
  async findOne(@Param('id') id: string) {
    return await this.tablesService.findOne(+id);
  }
}
