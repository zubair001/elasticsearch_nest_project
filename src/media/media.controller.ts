import {
  BadRequestException,
  Controller,
  Get,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { SearchMediaDto } from './dto/media.dto';
import { MediaService } from './media.service';
import { MediaResponse } from 'src/interfaces/media.interface';

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Get('health')
  async checkHealth() {
    return this.mediaService.checkElasticsearchConnection();
  }

  @Get('search')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async searchMedia(
    @Query() searchMediaDto: SearchMediaDto,
  ): Promise<MediaResponse[]> {
    const { querystring, dateCreated1, dateCreated2 } = searchMediaDto;
    if (!querystring) {
      throw new BadRequestException('Query parameter is required');
    }

    return this.mediaService.searchMedia(
      querystring,
      dateCreated1,
      dateCreated2,
    );
  }
}
