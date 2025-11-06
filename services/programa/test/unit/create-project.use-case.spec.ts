import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';

import { CreateProjectUseCase } from '@/application/use-cases/projects/create-project.use-case';
import { IProjectRepository } from '@/domain/repositories/project.repository.interface';
import { CreateProjectDto } from '@/application/dtos';
import { ProjectStatus } from '@construccion/types';

describe('CreateProjectUseCase', () => {
  let useCase: CreateProjectUseCase;
  let repository: jest.Mocked<IProjectRepository>;

  beforeEach(async () => {
    const mockRepository: Partial<IProjectRepository> = {
      create: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateProjectUseCase,
        {
          provide: 'IProjectRepository',
          useValue: mockRepository,
        },
      ],
    }).compile();

    useCase = module.get<CreateProjectUseCase>(CreateProjectUseCase);
    repository = module.get('IProjectRepository');
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should create a project successfully', async () => {
      const dto: CreateProjectDto = {
        name: 'Test Project',
        client: 'Test Client',
        location: 'Test Location',
        startDate: '2025-01-01',
        status: ProjectStatus.DRAFT,
      };

      const mockProject = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        ...dto,
        startDate: new Date(dto.startDate),
        createdAt: new Date(),
        updatedAt: new Date(),
        spaces: [],
      };

      repository.create.mockResolvedValue(mockProject as any);

      const result = await useCase.execute(dto);

      expect(result).toEqual(mockProject);
      expect(repository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          name: dto.name,
          client: dto.client,
          location: dto.location,
        }),
      );
    });

    it('should throw error if start date is in the past', async () => {
      const dto: CreateProjectDto = {
        name: 'Test Project',
        client: 'Test Client',
        location: 'Test Location',
        startDate: '2020-01-01', // Past date
        status: ProjectStatus.DRAFT,
      };

      await expect(useCase.execute(dto)).rejects.toThrow(
        BadRequestException,
      );
      await expect(useCase.execute(dto)).rejects.toThrow(
        'Start date cannot be in the past',
      );
    });

    it('should throw error if estimated end date is before start date', async () => {
      const dto: CreateProjectDto = {
        name: 'Test Project',
        client: 'Test Client',
        location: 'Test Location',
        startDate: '2025-12-01',
        estimatedEndDate: '2025-01-01', // Before start date
        status: ProjectStatus.DRAFT,
      };

      await expect(useCase.execute(dto)).rejects.toThrow(
        BadRequestException,
      );
      await expect(useCase.execute(dto)).rejects.toThrow(
        'Estimated end date must be after start date',
      );
    });
  });
});
