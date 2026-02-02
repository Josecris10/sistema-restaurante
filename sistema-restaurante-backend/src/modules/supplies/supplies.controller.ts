import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { SuppliesService } from './supplies.service';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiOkResponsePaginated } from 'src/common/decorators/api-response.decorator';
import { SupplyResponseDto } from './dto/supply-response.dto';
import { GetSuppliesFilterDto } from './dto/get-supplies-filter.dto';
import { CreateSupplyBatchDto } from './dto/create-supply-batch.dto';
import { CreateSupplyDto } from './dto/create-supply.dto';

@ApiTags('Supplies')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('supplies')
export class SuppliesController {
  constructor(private readonly suppliesService: SuppliesService) {}

  @Get()
  @ApiOperation({ summary: 'Listar insumos con stock calculado y filtros' })
  @ApiOkResponsePaginated(SupplyResponseDto)
  async findAll(@Query() filterDto: GetSuppliesFilterDto) {
    return await this.suppliesService.findAll(filterDto);
  }

  @Post('batches')
  @ApiOperation({ summary: 'Registrar la entrada de un nuevo lote de insumos' })
  @ApiCreatedResponse({ description: 'Lote registrado exitosamente' })
  async createBatch(@Body() createBatchDto: CreateSupplyBatchDto) {
    return await this.suppliesService.createBatch(createBatchDto);
  }

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo insumo base' })
  async create(@Body() createSupplyDto: CreateSupplyDto) {
    return await this.suppliesService.create(createSupplyDto);
  }
}
