import { ApiProperty } from '@nestjs/swagger';
import { OrderState } from '../enums/order-state.enum';
import { IsEnum } from 'class-validator';

export class OrderDetailResponseDto {
  @ApiProperty({ example: 'Lomo a lo Pobre' })
  itemName: string;

  @ApiProperty({ example: 2 })
  quantity: number;

  @ApiProperty({ example: 8500 })
  actualPrice: number;

  @ApiProperty({ example: 'La carne bien cocida', required: false })
  detail?: string;
}

export class OrderResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Juan Pérez', required: false })
  clientName?: string;

  @ApiProperty({ example: 5 })
  tableId: number;

  @ApiProperty({ example: 2 })
  waiterId: number;

  @ApiProperty({ example: 'PENDING' })
  kitchenState: string;

  @ApiProperty({ example: 'OPEN' })
  orderState: string;

  @ApiProperty({ type: [OrderDetailResponseDto] })
  detail: OrderDetailResponseDto[];
}
