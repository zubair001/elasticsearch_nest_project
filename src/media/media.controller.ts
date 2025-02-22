import {
  BadRequestException,
  Controller,
  Get,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiResponse, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { PinoLogger } from 'nestjs-pino';
import { SearchMediaDto } from './dto/media.dto';
import { MediaService } from './media.service';
import { MediaResponse } from 'src/interfaces/media.interface';

@Controller('media')
export class MediaController {
  private readonly logger: PinoLogger;

  constructor(
    private readonly mediaService: MediaService,
    logger: PinoLogger,
  ) {
    this.logger = logger;
  }

  @Get('health')
  @ApiOperation({ summary: 'Check Elasticsearch health status' })
  @ApiResponse({ status: 200, description: 'Elasticsearch is responsive' })
  @ApiResponse({ status: 500, description: 'Elasticsearch is unreachable' })
  async checkHealth() {
    try {
      const result = await this.mediaService.checkElasticsearchConnection();
      this.logger.info('Health check result:', result);
      return result;
    } catch (error) {
      this.logger.error('Error checking Elasticsearch connection', error.stack);
      throw error;
    }
  }

  @Get('search')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  @ApiOperation({ summary: 'Search media records' })
  @ApiQuery({
    name: 'querystring',
    required: true,
    description: 'Search keyword',
  })
  @ApiQuery({
    name: 'startDate',
    required: false,
    description: 'Filter from this date (YYYY-MM-DD)',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    description: 'Filter until this date (YYYY-MM-DD)',
  })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    description: 'Sort results by field',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number (default: 1)',
  })
  @ApiQuery({
    name: 'size',
    required: false,
    description: 'Results per page (default: 10)',
  })
  @ApiResponse({
    status: 200,
    description: 'Successful search results',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Missing required parameters',
  })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async searchMedia(
    @Query() searchMediaDto: SearchMediaDto,
  ): Promise<MediaResponse[]> {
    const { querystring, startDate, endDate, sortBy, page, size } =
      searchMediaDto;
    if (!querystring) {
      this.logger.warn('Query parameter is required');
      throw new BadRequestException('Query parameter is required');
    }

    try {
      const result = await this.mediaService.searchMedia(
        querystring,
        startDate,
        endDate,
        sortBy,
        page,
        size,
      );
      this.logger.info('Search completed successfully');
      return result;
    } catch (error) {
      this.logger.error('Error performing media search', error.stack);
      throw error;
    }
  }
}
