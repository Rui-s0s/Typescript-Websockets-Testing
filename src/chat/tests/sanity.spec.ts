import { Test } from '@nestjs/testing';

describe('Nest Sanity', () => {
  it('should create testing module', async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [],
    }).compile();

    expect(moduleRef).toBeDefined();
  });
});
