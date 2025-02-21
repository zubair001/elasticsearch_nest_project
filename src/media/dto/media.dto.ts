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
  startDate?: string;

  @IsOptional()
  @IsDateString({}, { message: 'end date must be a valid  format' })
  endDate?: string;

  @IsOptional()
  sortBy: 'asc' | 'desc' = 'desc';

  @IsOptional()
  page: number;

  @IsOptional()
  size: number;
}
