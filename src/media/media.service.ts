import { Injectable, Logger } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class MediaService {
  private readonly logger = new Logger(MediaService.name);

  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  async onModuleInit() {
    this.logger.log('Initializing MediaService...');
    await this.checkElasticsearchConnection();
  }

  async checkElasticsearchConnection(): Promise<void> {
    try {
      await this.elasticsearchService.ping();
      this.logger.log('✅ Successfully connected to Elasticsearch');
    } catch (error) {
      this.logger.error('❌ Elasticsearch connection failed:', error.message);
    }
  }

  async searchMedia(query: string) {
    try {
      const response = await this.elasticsearchService.search({
        index: process.env.ELASTICSEARCH_INDEX,
        body: {
          query: {
            multi_match: {
              query,
              fields: ['suchtext'],
            },
          },
          _source: [
            'bildnummer',
            'datum',
            'suchtext',
            'fotografen',
            'hoehe',
            'breite',
            'db',
          ], // fetch specific fields
        },
      });
      this.logger.log(`Searching media for query: ${query}`);

      return response.hits.hits.map((hit) => hit._source);
    } catch (error) {
      this.logger.error('Error searching media:', error);
      throw error;
    }
  }
}
