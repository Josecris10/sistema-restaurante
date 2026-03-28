import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateOrderDto } from './dto/create-order.dto';
import { BaseResponseDto } from 'src/common/dto/base-response.dto';
import { OrderResponseDto } from './dto/order-response.dto';
import { AddItemDetailsDto } from './dto/add-item-details.dto.ts';
import { UpdateKitchenStateDto } from './dto/update-kitchen-state.dto';
import { UpdateOrderStateDto } from './dto/update-order-state.dto';
import { Order } from './entities/order.entity';

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
  @ApiCreatedResponse({ description: 'Orden creada con éxito', type: Order })
  async create(
    @Body() orderData: CreateOrderDto,
  ): Promise<BaseResponseDto<OrderResponseDto>> {
    const order = await this.ordersService.create(orderData);
    return { data: order };
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener una orden',
  })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const order = await this.ordersService.findOne(id);
    return { data: order };
  }

  @Post(':id/item-details')
  @ApiOperation({
    summary: 'Añadir más items a la orden',
  })
  @ApiCreatedResponse({ description: 'Items añadidos con éxito' })
  async addItemDetails(
    @Param('id', ParseIntPipe) id: number,
    @Body() itemDetails: AddItemDetailsDto,
  ) {
    const items = await this.ordersService.addItemDetails(id, itemDetails);
    return {
      data: items,
    };
  }

  @Patch(':id/kitchen-state')
  @ApiOperation({
    summary: 'Actualizar el estado de cocina de una orden',
  })
  async updateKitchenState(
    @Param('id', ParseIntPipe) id: number,
    @Body() newKitchenState: UpdateKitchenStateDto,
  ) {}

  @Patch(':id/order-state')
  @ApiOperation({
    summary: 'Actualizar el estado de la orden',
  })
  async updateOrderState(
    @Param('id', ParseIntPipe) id: number,
    @Body() newOrderState: UpdateOrderStateDto,
  ) {}

  @Post(':id/cancel')
  @ApiOperation({
    summary: 'Cancelar la orden',
  })
  async cancelOrder(@Param('id', ParseIntPipe) id: number) {}

  @Post(':id/close')
  @ApiOperation({
    summary: 'Cerrar la orden',
  })
  async closeOrder(@Param('id', ParseIntPipe) id: number) {}
}
