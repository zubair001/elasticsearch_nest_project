import {
  BadRequestException,
  Controller,
  Get,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
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
