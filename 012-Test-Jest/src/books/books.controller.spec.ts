import { Test, TestingModule } from '@nestjs/testing';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';

describe('BooksController', () => {
  let controller: BooksController;

  const mockBook = {
    _id: 'some-id',
    title: 'Test Book',
    author: 'Test Author',
    year: 2024,
    genre: 'Test Genre',
  };

  const mockBooksService = {
    create: jest.fn().mockResolvedValue(mockBook),
    findAll: jest.fn().mockResolvedValue([mockBook]),
    findOne: jest.fn().mockResolvedValue(mockBook),
    update: jest.fn().mockResolvedValue(mockBook),
    remove: jest.fn().mockResolvedValue(mockBook),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BooksController],
      providers: [
        {
          provide: BooksService,
          useValue: mockBooksService,
        },
      ],
    }).compile();

    controller = module.get<BooksController>(BooksController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('create → должен вызвать BooksService.create и вернуть книгу', async () => {
    const dto = { title: 'New Book', author: 'New Author' };
    const result = await controller.create(dto as any);
    expect(mockBooksService.create).toHaveBeenCalledWith(dto);
    expect(result).toEqual(mockBook);
  });

  it('findAll → должен вызвать BooksService.findAll', async () => {
    const result = await controller.findAll();
    expect(mockBooksService.findAll).toHaveBeenCalled();
    expect(result).toEqual([mockBook]);
  });

  it('findOne → должен вызвать BooksService.findOne с id', async () => {
    const result = await controller.findOne('some-id');
    expect(mockBooksService.findOne).toHaveBeenCalledWith('some-id');
    expect(result).toEqual(mockBook);
  });

  it('update → должен вызвать BooksService.update', async () => {
    const dto = { title: 'Updated' };
    const result = await controller.update('some-id', dto as any);
    expect(mockBooksService.update).toHaveBeenCalledWith('some-id', dto);
    expect(result).toEqual(mockBook);
  });

  it('remove → должен вызвать BooksService.remove', async () => {
    const result = await controller.remove('some-id');
    expect(mockBooksService.remove).toHaveBeenCalledWith('some-id');
    expect(result).toEqual(mockBook);
  });
});