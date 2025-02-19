import { Module } from '@nestjs/common';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { elasticsearchConfig } from './elasticsearch.config';
import * as dotenv from 'dotenv';

dotenv.config();

@Module({
  imports: [ElasticsearchModule.register(elasticsearchConfig)],
  exports: [ElasticsearchModule],
})
export class CustomElasticsearchModule {}
