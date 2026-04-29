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
  recipeName?: string;

  @IsEnum(CourseTypeEnum)
  @IsNotEmpty()
  courseType: CourseTypeEnum;

  @IsNumber()
  recipeId: number;
}
