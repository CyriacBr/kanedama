import { Test, TestingModule } from '@nestjs/testing';
import { AccountsService } from './accounts.service';
import { AccountsModule } from './accounts.module';
import { MockAccountsService } from './mockAccounts.service';
import fixtures from '../../../test/fixtures';

describe('AccountsService', () => {
  let service: AccountsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AccountsModule],
    })
      /**
       * Mocking
       */
      .overrideProvider(AccountsService)
      .useClass(MockAccountsService)
      .compile();

    service = module.get<AccountsService>(AccountsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe(`'findMostRecentTransaction' should work`, () => {
    it(`by default`, async () => {
      const trans = await service.findMostRecentTransaction('1');
      expect(trans).toBe(fixtures.transactions['1'][3]);
    });

    it(`when there are no transaction`, async () => {
      jest
        .spyOn(service, 'findTransactionsByDateRange')
        .mockImplementation(async () => []);
      jest
        .spyOn(service, 'findOldestTransaction')
        .mockImplementation(async () => null);

      const trans = await service.findMostRecentTransaction('1');
      expect(trans).toBe(null);
    });
  });

  describe(`'findPositiveTransactions' should work`, () => {
    it('by default', async () => {
      const transacs = await service.findPositiveTransactionsByPeriod('1', 6);
      expect(transacs).toEqual([
        fixtures.transactions['1'][2],
        fixtures.transactions['1'][3],
      ]);
    });
  });

  describe(`'findAllTransactions' should work`, () => {
    it('by default', async () => {
      const transacs = await service.findAllTransactions('1');
      expect(transacs.length).toEqual(fixtures.transactions['1'].length);
    });
  });
});
