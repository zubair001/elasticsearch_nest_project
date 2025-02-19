import { Injectable, Logger } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import * as dotenv from 'dotenv';
import { MediaResponse, MediaSource } from 'src/interfaces/media.interface';
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

  async searchMedia(
    query: string,
    dateCreated1?: string,
    dateCreated2?: string,
  ): Promise<MediaResponse[]> {
    try {
      const boolQuery: any = {
        must: [
          {
            multi_match: {
              query,
              fields: ['suchtext', 'fotografen'],
            },
          },
        ],
        filter: [],
      };
      if (dateCreated1 && dateCreated2) {
        boolQuery.filter.push({
          range: {
            datum: {
              gte: dateCreated1,
              lte: dateCreated2,
              format: 'yyyy-MM-dd',
            },
          },
        });
      }
      const result = await this.elasticsearchService.search({
        index: process.env.ELASTICSEARCH_INDEX,
        body: {
          query: {
            bool: boolQuery,
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
      if (dateCreated1 && dateCreated2) {
        this.logger.log(
          `Searching media for query: ${query} between dates: ${dateCreated1} and ${dateCreated2}`,
        );
      } else {
        this.logger.log(`Searching media for query: ${query}`);
      }

      return (result.hits?.hits || [])
        .map((hit) => {
          const source = hit._source as MediaSource;
          const suchtext = source.suchtext || '';
          const title = suchtext;
          const description = suchtext;
          return {
            id: source.bildnummer,
            title,
            description,
            photographer: source.fotografen,
            height: source.hoehe,
            width: source.breite,
            date: source.datum,
            source: source.db,
          };
        })
        .filter((item) => item !== undefined) as MediaResponse[];
    } catch (error) {
      this.logger.error('Error searching media:', error.message);
      throw new Error(
        'An error occurred while searching for media. Please try again later.',
      );
    }
  }
}
