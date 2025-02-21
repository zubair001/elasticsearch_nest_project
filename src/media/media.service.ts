import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import * as dotenv from 'dotenv';
import { PinoLogger } from 'nestjs-pino';
import { MediaResponse, MediaSource } from 'src/interfaces/media.interface';
dotenv.config();

@Injectable()
export class MediaService {
  private readonly logger: PinoLogger;

  constructor(
    private readonly elasticsearchService: ElasticsearchService,
    logger: PinoLogger,
  ) {
    this.logger = logger;
  }

  async onModuleInit() {
    this.logger.info('Initializing Media Service...');
    await this.checkElasticsearchConnection();
  }

  async checkElasticsearchConnection(): Promise<void> {
    try {
      await this.elasticsearchService.ping();
      this.logger.info('Successfully connected to Elasticsearch');
    } catch (error) {
      this.logger.error('Elasticsearch connection failed:', error.message);
    }
  }

  /**
   * Searches for media based on the provided query and optional filters.
   *
   * @param {string} query - The search query string.
   * @param {string} [startDate] - The start date for filtering media.
   * @param {string} [endDate] - The end date for filtering media.
   * @param {'asc' | 'desc'} [sortBy='desc'] - The sort order for the search results based on the date.
   * @param {number} [page=0] - The page number for pagination.
   * @param {number} [size=10] - The number of results per page.
   * @returns {Promise<MediaResponse[]>} - A promise that resolves to an array of media responses.
   * @throws {Error} - Throws an error if the search operation fails.
   */

  async searchMedia(
    query: string,
    startDate?: string,
    endDate?: string,
    sortBy: 'asc' | 'desc' = 'desc',
    page?: number,
    size?: number,
  ): Promise<MediaResponse[]> {
    try {
      const boolQuery: any = {
        must: [
          {
            multi_match: {
              query,
              fields: ['suchtext^3', 'fotografen^2', 'db'],
              type: 'best_fields',
              fuzziness: 'AUTO',
            },
          },
          {
            prefix: {
              suchtext: {
                value: query,
                boost: 3,
              },
            },
          },
        ],
        filter: [],
      };
      if (startDate && endDate) {
        boolQuery.filter.push({
          range: {
            datum: {
              gte: startDate,
              lte: endDate,
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
          ],
          from: page || 0,
          size: size || 10,
          sort: [{ datum: { order: sortBy } }],
        },
      });
      if (startDate && endDate) {
        this.logger.info(
          `Searching media for query: ${query} between dates: ${startDate} and ${endDate}`,
        );
      } else {
        this.logger.info(`Searching media for query: ${query}`);
      }

      return (result.hits?.hits || [])
        .map((hit) => {
          const source = hit._source as MediaSource;
          const suchtext = source.suchtext || '';
          const title = suchtext ? suchtext : 'No title';
          const description = suchtext ? suchtext : 'No description';
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
