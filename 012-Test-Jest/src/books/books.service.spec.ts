import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { NotFoundException } from '@nestjs/common';
import { BooksService } from './books.service';
import { Book, BookDocument } from './schemas/book.schema';
import { Model } from 'mongoose';

describe('BooksService', () => {
  let service: BooksService;
  let model: Model<BookDocument>;

  const mockBook = {
    _id: 'some-id',
    title: 'Test Book',
    author: 'Test Author',
    year: 2024,
    genre: 'Test Genre',
  };

  let findMock: jest.Mock;
  let findByIdMock: jest.Mock;
  let findByIdAndUpdateMock: jest.Mock;
  let findByIdAndDeleteMock: jest.Mock;
  let MockModel: any;

  beforeEach(async () => {

    findMock = jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue([mockBook]),
    });
    findByIdMock = jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(mockBook),
    });
    findByIdAndUpdateMock = jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(mockBook),
    });
    findByIdAndDeleteMock = jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(mockBook),
    });

    MockModel = jest.fn().mockImplementation((dto) => ({
      ...dto,
      save: jest.fn().mockResolvedValue({ ...dto, _id: 'new-id' }),
    }));

    MockModel.find = findMock;
    MockModel.findById = findByIdMock;
    MockModel.findByIdAndUpdate = findByIdAndUpdateMock;
    MockModel.findByIdAndDelete = findByIdAndDeleteMock;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BooksService,
        {
          provide: getModelToken(Book.name),
          useValue: MockModel,
        },
      ],
    }).compile();

    service = module.get<BooksService>(BooksService);
    model = module.get<Model<BookDocument>>(getModelToken(Book.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('должен создать книгу', async () => {
      const dto = { title: 'New Book', author: 'New Author' };
      const result = await service.create(dto);
      expect(result).toEqual({ ...dto, _id: 'new-id' });
    });
  });

  describe('findAll', () => {
    it('должен вернуть массив книг', async () => {
      const result = await service.findAll();
      expect(result).toEqual([mockBook]);
      expect(findMock).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('должен вернуть книгу по ID', async () => {
      const result = await service.findOne('some-id');
      expect(result).toEqual(mockBook);
      expect(findByIdMock).toHaveBeenCalledWith('some-id');
    });

    it('должен выбросить NotFoundException, если книга не найдена', async () => {
      findByIdMock.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValue(null),
      });
      await expect(service.findOne('non-existent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('должен обновить книгу', async () => {
      const result = await service.update('some-id', { title: 'Updated' });
      expect(result).toEqual(mockBook);
      expect(findByIdAndUpdateMock).toHaveBeenCalledWith(
        'some-id',
        { title: 'Updated' },
        { new: true },
      );
    });

    it('должен выбросить NotFoundException, если книга не найдена', async () => {
      findByIdAndUpdateMock.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValue(null),
      });
      await expect(service.update('non-existent', {})).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('должен удалить книгу', async () => {
      const result = await service.remove('some-id');
      expect(result).toEqual(mockBook);
      expect(findByIdAndDeleteMock).toHaveBeenCalledWith('some-id');
    });

    it('должен выбросить NotFoundException, если книга не найдена', async () => {
      findByIdAndDeleteMock.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValue(null),
      });
      await expect(service.remove('non-existent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});