import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { CourseTypeEnum } from '../enums/course-type.dto';

export class RecipeMenuDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsEnum(CourseTypeEnum)
  @IsNotEmpty()
  courseType: CourseTypeEnum;

  @IsNotEmpty()
  @IsNumber()
  menuId: number;

  @IsOptional()
  @IsNumber()
  recipeId?: number;
}
