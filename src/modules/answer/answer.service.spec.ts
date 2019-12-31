import { Test, TestingModule } from '@nestjs/testing';
import { AnswerService } from './answer.service';
import { AccountsService } from 'modules/accounts/accounts.service';
import { MockAccountsService } from 'modules/accounts/mockAccounts.service';
import fixtures from '../../../test/fixtures';
import { AnswerModule } from './answer.module';

describe('AnswerService', () => {
  let service: AnswerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AnswerModule],
    })
      /**
       * Mocking
       */
      .overrideProvider(AccountsService)
      .useClass(MockAccountsService)
      .compile();

    service = module.get<AnswerService>(AnswerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe(`'makeAverageIncome' should work`, () => {
    it('by default', async () => {
      const avg = await service.makeAverageIncome(fixtures.accounts, 6);
      expect(avg).toBe((80 + 50) / 3);
    });
  });
});
