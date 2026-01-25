import {
  Body,
  ConsoleLogger,
  Controller,
  Get,
  Post,
  UseGuards,
} from '@nestjs/common';
import { TablesService } from './tables.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateTableDto } from './dto/create-table.dto';

@ApiTags('Tables')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('tables')
export class TablesController {
  constructor(private readonly tablesService: TablesService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva mesa' })
  @ApiResponse({ status: 201, description: 'La mesa ha sido creada.' })
  create(@Body() createTableDto: CreateTableDto) {
    return this.tablesService.create(createTableDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las mesas' })
  findAll() {
    return this.tablesService.findAll();
  }
}
