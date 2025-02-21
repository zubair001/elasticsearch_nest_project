jest.mock('@nestjs/elasticsearch', () => ({
  ElasticsearchService: jest.fn().mockImplementation(() => ({
    search: jest.fn(), // Mock the search function
    ping: jest.fn(), // Mock the ping function
  })),
}));

import { Test, TestingModule } from '@nestjs/testing';
import { MediaService } from './media.service';
import { ElasticsearchService } from '@nestjs/elasticsearch';

describe('MediaService', () => {
  let service: MediaService;
  let elasticsearchService: ElasticsearchService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MediaService, ElasticsearchService],
    }).compile();

    service = module.get<MediaService>(MediaService);
    elasticsearchService =
      module.get<ElasticsearchService>(ElasticsearchService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('checkElasticsearchConnection', () => {
    it('should log success message if connection is successful', async () => {
      jest.spyOn(elasticsearchService, 'ping').mockResolvedValueOnce(true);
      const loggerSpy = jest.spyOn(service['logger'], 'log');

      await service.checkElasticsearchConnection();

      expect(loggerSpy).toHaveBeenCalledWith(
        'Successfully connected to Elasticsearch',
      );
    });

    it('should log error message if connection fails', async () => {
      const error = new Error('Connection failed');
      jest.spyOn(elasticsearchService, 'ping').mockRejectedValueOnce(error);
      const loggerSpy = jest.spyOn(service['logger'], 'error');

      await service.checkElasticsearchConnection();

      expect(loggerSpy).toHaveBeenCalledWith(
        'Elasticsearch connection failed:',
        error.message,
      );
    });
  });

  describe('searchMedia', () => {
    it('should return search results', async () => {
      const mockResponse = {
        hits: {
          hits: [
            {
              _source: {
                bildnummer: '1',
                datum: '2023-01-01',
                suchtext: 'test',
                fotografen: 'John Doe',
                hoehe: 100,
                breite: 200,
                db: 'source1',
              },
            },
          ],
        },
      };
      (elasticsearchService.search as jest.Mock).mockResolvedValue(
        mockResponse,
      );

      const result = await service.searchMedia('test');

      expect(result).toEqual([
        {
          id: '1',
          title: 'test',
          description: 'test',
          photographer: 'John Doe',
          height: 100,
          width: 200,
          date: '2023-01-01',
          source: 'source1',
        },
      ]);
    });

    it('should log error and throw if search fails', async () => {
      const error = new Error('Search failed');
      jest.spyOn(elasticsearchService, 'search').mockRejectedValueOnce(error);
      const loggerSpy = jest.spyOn(service['logger'], 'error');

      await expect(service.searchMedia('test')).rejects.toThrow(
        'An error occurred while searching for media. Please try again later.',
      );
      expect(loggerSpy).toHaveBeenCalledWith(
        'Error searching media:',
        error.message,
      );
    });
  });
});
