import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { SearchMediaDto } from './dto/media.dto';
import { MediaService } from './media.service';

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Get('health')
  async checkHealth() {
    return this.mediaService.checkElasticsearchConnection();
  }

  @Get('search')
  async searchMedia(@Query() searchMediaDto: SearchMediaDto) {
    const { querystring, datecreated1, datecreated2 } = searchMediaDto;
    if (!querystring) {
      throw new BadRequestException('Query parameter is required');
    }

    return this.mediaService.searchMedia(
      querystring,
      datecreated1,
      datecreated2,
    );
  }
}
