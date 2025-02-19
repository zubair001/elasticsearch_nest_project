import { Module } from '@nestjs/common';
import { MediaService } from './media.service';
import { MediaController } from './media.controller';
import { CustomElasticsearchModule } from 'src/config/elasticsearch.module';

@Module({
  imports: [CustomElasticsearchModule],
  providers: [MediaService],
  controllers: [MediaController],
})
export class MediaModule {}
