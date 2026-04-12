import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { SuppliesService } from './supplies.service';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiOkResponsePaginated } from '../../common/decorators/api-response.decorator';
import { SupplyResponseDto } from './dto/supply-response.dto';
import { GetSuppliesFilterDto } from './dto/get-supplies-filter.dto';
import { CreateSupplyBatchDto } from './dto/create-supply-batch.dto';
import { CreateSupplyDto } from './dto/create-supply.dto';
import { UpdateSupplyDto } from './dto/update-supply.dto';
import { UpdateSupplyBatchDto } from './dto/update-supply-batch.dto';
import { BaseResponseDto } from '../../common/dto/base-response.dto';
import { SupplyDetailDto } from './dto/supply-detail.dto';

@ApiTags('Supplies')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('supplies')
export class SuppliesController {
  constructor(private readonly suppliesService: SuppliesService) {}

  @Get()
  @ApiOperation({ summary: 'Listar insumos con stock calculado y filtros' })
  @ApiOkResponsePaginated(SupplyResponseDto)
  async findAll(
    @Query() filters: GetSuppliesFilterDto,
  ): Promise<BaseResponseDto<SupplyResponseDto>> {
    const supplies = await this.suppliesService.findAll(filters);
    return {
      data: supplies.data,
      total: supplies.total,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un insumo por su ID' })
  @ApiOkResponse({ type: SupplyResponseDto })
  @ApiNotFoundResponse({ description: 'El insumo con ese ID no existe' })
  async findOne(
    @Param('id') id: string,
  ): Promise<BaseResponseDto<SupplyDetailDto>> {
    const supply = await this.suppliesService.findOne(+id);
    return {
      data: supply,
    };
  }

  @Post('batches')
  @ApiOperation({ summary: 'Registrar la entrada de un nuevo lote de insumos' })
  @ApiCreatedResponse({ description: 'Lote registrado exitosamente' })
  async createBatch(@Body() batchData: CreateSupplyBatchDto) {
    const data = await this.suppliesService.createBatch(batchData);
    return { data: data };
  }

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo insumo base' })
  async create(@Body() supplyData: CreateSupplyDto) {
    const supply = await this.suppliesService.create(supplyData);
    return { data: supply };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar datos de un insumo' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() supplyData: UpdateSupplyDto,
  ) {
    const supply = await this.suppliesService.update(id, supplyData);
    return { data: supply };
  }

  @Patch('batches/:id')
  @ApiOperation({
    summary: 'Corregir datos de un lote',
  })
  async updateBatch(
    @Param('id', ParseIntPipe) id: number,
    @Body() batchData: UpdateSupplyBatchDto,
  ) {
    const batch = await this.suppliesService.updateBatch(id, batchData);
    return { data: batch };
  }
}
