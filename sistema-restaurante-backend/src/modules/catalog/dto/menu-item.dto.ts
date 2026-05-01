import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { CourseTypeEnum } from '../enums/course-type.dto';

export class MenuItemDto {
  @IsOptional()
  @IsString()
  itemName?: string;

  @IsEnum(CourseTypeEnum)
  @IsNotEmpty()
  courseType: CourseTypeEnum;

  @IsNotEmpty()
  @IsNumber()
  itemId: number;
}
