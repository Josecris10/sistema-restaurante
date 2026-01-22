import { Controller, Post, UseGuards } from '@nestjs/common';
import { MenusService } from './menus.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Menus')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('menus')
export class MenusController {
  constructor(private readonly menusService: MenusService) {}

  @Post()
  create() {
    return 'Este menú solo lo crea un usuario logueado';
  }
}
