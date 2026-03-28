import { IsEnum, IsNotEmpty } from 'class-validator';
import {} from '../enums/kitchen-state.enum';
import { OrderState } from '../enums/order-state.enum';

export class UpdateOrderStateDto {
  @IsEnum(OrderState)
  @IsNotEmpty()
  newState: OrderState;
}
