import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CatalogService } from './catalog.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateMenuDto } from './dto/create-menu.dto';

@ApiTags('Catalog')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('catalog')
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  @Post('/menu')
  @ApiOperation({ summary: 'Ingresar un menú al sistema' })
  async createMenu(@Body() menuInfo: CreateMenuDto) {
    return { data: this.catalogService.createMenu(menuInfo) };
  }
}
