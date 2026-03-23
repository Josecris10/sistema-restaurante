import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateOrderDto } from './dto/create-order.dto';
import { BaseResponseDto } from 'src/common/dto/base-response.dto';
import { OrderResponseDto } from './dto/order-response.dto';

@ApiTags('Supplies')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiOperation({
    summary: 'Crear una nueva orden',
  })
  async create(
    @Body() orderData: CreateOrderDto,
  ): Promise<BaseResponseDto<OrderResponseDto>> {
    const order = await this.ordersService.create(orderData);
    return {
      data: order,
    };
  }
}
