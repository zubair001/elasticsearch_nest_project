import { Module } from '@nestjs/common';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { LoggerModule } from 'nestjs-pino';
import { elasticsearchConfig } from './config/elasticsearch.config';
import { pinoConfig } from './logger.config';
import { MediaModule } from './media/media.module';

@Module({
  imports: [
    LoggerModule.forRoot(pinoConfig),
    ElasticsearchModule.register(elasticsearchConfig),
    MediaModule,
  ],
})
export class AppModule {}
