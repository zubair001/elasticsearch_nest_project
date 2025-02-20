import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsDateString,
} from 'class-validator';

export class SearchMediaDto {
  @IsNotEmpty({ message: 'Query string is required' })
  @IsString()
  querystring: string;

  @IsOptional()
  @IsDateString({}, { message: 'start date must be a valid format' })
  dateCreated1?: string;

  @IsOptional()
  @IsDateString({}, { message: 'end date must be a valid  format' })
  dateCreated2?: string;

  @IsOptional()
  @IsString({ message: 'Sort by must be either asc or desc' })
  sortBy: 'asc' | 'desc' = 'desc';

  @IsOptional()
  @IsNotEmpty({ message: 'Page number is missing.' })
  page: number;

  @IsOptional()
  @IsNotEmpty({ message: 'Size is missing.' })
  size: number;
}
