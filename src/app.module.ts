import { Module } from '@nestjs/common';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { elasticsearchConfig } from './config/elasticsearch.config';
import { MediaModule } from './media/media.module';

@Module({
  imports: [ElasticsearchModule.register(elasticsearchConfig), MediaModule],
})
export class AppModule {}
