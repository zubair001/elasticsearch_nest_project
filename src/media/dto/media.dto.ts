import { IsNotEmpty, IsOptional, IsString, IsISO8601 } from 'class-validator';

export class SearchMediaDto {
  @IsNotEmpty({ message: 'Query string is required' })
  @IsString()
  querystring: string;

  @IsOptional()
  @IsISO8601(
    {},
    { message: 'start date must be a valid YYYY-MM-DD date format' },
  )
  datecreated1?: string;

  @IsOptional()
  @IsISO8601(
    {},
    { message: 'end date must be a valid  YYYY-MM-DD date format' },
  )
  datecreated2?: string;
}
