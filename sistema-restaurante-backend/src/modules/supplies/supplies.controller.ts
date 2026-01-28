import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { SuppliesService } from './supplies.service';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiOkResponsePaginated } from 'src/common/decorators/api-response.decorator';
import { SupplyResponseDto } from './dto/supply-response.dto';
import { GetSuppliesFilterDto } from './dto/get-supplies-filter.dto';

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
}
