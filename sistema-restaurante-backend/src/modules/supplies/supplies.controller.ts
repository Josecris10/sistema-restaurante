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
import { ApiOkResponsePaginated } from 'src/common/decorators/api-response.decorator';
import { SupplyResponseDto } from './dto/supply-response.dto';
import { GetSuppliesFilterDto } from './dto/get-supplies-filter.dto';
import { CreateSupplyBatchDto } from './dto/create-supply-batch.dto';
import { CreateSupplyDto } from './dto/create-supply.dto';
import { UpdateSupplyDto } from './dto/update-supply.dto';
import { UpdateSupplyBatchDto } from './dto/update-supply-batch.dto';

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

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un insumo por su ID' })
  @ApiOkResponse({ type: SupplyResponseDto })
  @ApiNotFoundResponse({ description: 'El insumo con ese ID no existe' })
  async findOne(@Param('id') id: string) {
    return await this.suppliesService.findOne(+id);
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

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar datos de un insumo' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateData: UpdateSupplyDto,
  ) {
    return await this.suppliesService.update(id, updateData);
  }

  @Patch('batches/:id')
  @ApiOperation({
    summary: 'Corregir datos de un lote',
  })
  async updateBatch(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBatchDto: UpdateSupplyBatchDto,
  ) {
    return await this.suppliesService.updateBatch(id, updateBatchDto);
  }
}
