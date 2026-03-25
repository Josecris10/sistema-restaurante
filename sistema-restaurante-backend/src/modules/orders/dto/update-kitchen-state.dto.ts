import { IsEnum, IsNotEmpty } from 'class-validator';
import { KitchenState } from '../enums/kitchen-state.enum';

export class UpdateKitchenStateDto {
  @IsEnum(KitchenState)
  @IsNotEmpty()
  newState: KitchenState;
}
