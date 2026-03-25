import { IsArray, IsNotEmpty } from 'class-validator';
import { ItemDetailDto } from './item-detail.dto';

export class AddItemDetailsDto {
  @IsNotEmpty()
  @IsArray()
  items: ItemDetailDto[];
}
