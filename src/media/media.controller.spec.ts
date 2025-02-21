import { Test, TestingModule } from '@nestjs/testing';
import { MediaController } from './media.controller';
import { MediaService } from './media.service';
import { SearchMediaDto } from './dto/media.dto';
import { BadRequestException } from '@nestjs/common';

describe('MediaController', () => {
  let controller: MediaController;
  let mediaService: MediaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MediaController],
      providers: [
        {
          provide: MediaService,
          useValue: {
            checkElasticsearchConnection: jest.fn(),
            searchMedia: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<MediaController>(MediaController);
    mediaService = module.get<MediaService>(MediaService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('checkHealth', () => {
    it('should call mediaService.checkElasticsearchConnection', async () => {
      const checkElasticsearchConnectionSpy = jest.spyOn(
        mediaService,
        'checkElasticsearchConnection',
      );
      await controller.checkHealth();
      expect(checkElasticsearchConnectionSpy).toHaveBeenCalled();
    });
  });

  describe('searchMedia', () => {
    it('should throw BadRequestException if querystring is not provided', async () => {
      const searchMediaDto: SearchMediaDto = {
        querystring: '',
        startDate: '',
        endDate: '',
        sortBy: 'asc',
        page: 1,
        size: 10,
      };

      await expect(controller.searchMedia(searchMediaDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should call mediaService.searchMedia with correct parameters', async () => {
      const searchMediaDto: SearchMediaDto = {
        querystring: 'test',
        startDate: '2021-01-01',
        endDate: '2021-12-31',
        sortBy: 'asc',
        page: 1,
        size: 10,
      };

      const searchMediaSpy = jest.spyOn(mediaService, 'searchMedia');
      await controller.searchMedia(searchMediaDto);
      expect(searchMediaSpy).toHaveBeenCalledWith(
        'test',
        '2021-01-01',
        '2021-12-31',
        'asc',
        1,
        10,
      );
    });
  });
});
