import { Controller, Post, UseGuards } from '@nestjs/common';
import { CatalogService } from './catalog.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Catalog')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('catalog')
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  @Post()
  create() {
    return 'Este menú solo lo crea un usuario logueado';
  }
}
