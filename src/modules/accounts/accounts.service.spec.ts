import { Test, TestingModule } from '@nestjs/testing';
import { AccountsService } from './accounts.service';
import { AccountsModule } from './accounts.module';
import { TransactionRo } from '@kanedama/common';
import dayjs = require('dayjs');

describe('AccountsService', () => {
  let service: AccountsService;
  const transactions: TransactionRo[] = [
    {
      amount: 400,
      currency: 'USD',
      status: null,
      timestamp: '2010-01-01 10:00:00',
      transaction_category: null,
      transaction_type: null,
    },
    {
      amount: -100,
      currency: 'USD',
      status: null,
      timestamp: '2013-01-01 10:00:00',
      transaction_category: null,
      transaction_type: null,
    },
    {
      amount: 80,
      currency: 'USD',
      status: null,
      timestamp: '2015-01-01 10:00:00',
      transaction_category: null,
      transaction_type: null,
    },
    {
      amount: 50,
      currency: 'USD',
      status: null,
      timestamp: '2015-04-01 10:00:00',
      transaction_category: null,
      transaction_type: null,
    },
  ];

  async function mockFindTransactions(
    accountId: string,
    startDate: string,
    endDate: string,
  ) {
    return transactions.filter(t => {
      const date = dayjs(t.timestamp);
      return dayjs(startDate).isBefore(date) && dayjs(endDate).isAfter(date);
    });
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AccountsModule],
    }).compile();

    service = module.get<AccountsService>(AccountsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe(`'findMostRecentTransaction' should work`, () => {
    it(`by default`, async () => {
      jest
        .spyOn(service, 'findTransactionsByDateRange')
        .mockImplementation(mockFindTransactions);
      jest
        .spyOn(service, 'findOldestTransaction')
        .mockImplementation(async () => transactions[0]);

      const trans = await service.findMostRecentTransaction('1');
      expect(trans).toBe(transactions[3]);
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
      jest
        .spyOn(service, 'findTransactionsByDateRange')
        .mockImplementation(mockFindTransactions);
      jest
        .spyOn(service, 'findOldestTransaction')
        .mockImplementation(async () => transactions[0]);

      const transacs = await service.findPositiveTransactions('1', 6);
      expect(transacs).toEqual([transactions[2], transactions[3]]);
    });
  });

  describe(`'findAllTransactions' should work`, () => {
    it('by default', async () => {
      jest
        .spyOn(service, 'findTransactionsByDateRange')
        .mockImplementation(mockFindTransactions);
      jest
        .spyOn(service, 'findOldestTransaction')
        .mockImplementation(async () => transactions[0]);
      const transacs = await service.findAllTransactions('1');
      expect(transacs.length).toEqual(transactions.length);
    });
  });
});