import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { MediaService } from './media.service';

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Get('health')
  async checkHealth() {
    return this.mediaService.checkElasticsearchConnection();
  }

  @Get('search')
  async searchMedia(@Query('querystring') query: string) {
    if (!query) throw new BadRequestException('Query string is required');
    return this.mediaService.searchMedia(query);
  }
}
