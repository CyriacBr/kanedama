import { Injectable } from '@nestjs/common';
import { TransactionRo, AccountRo } from '@kanedama/common';
import * as dayjs from 'dayjs';
import { HttpClient } from 'common/service/http-client';
import { AccountsService } from './accounts.service';
import fixtures from '../../../test/fixtures';

@Injectable()
export class MockAccountsService extends AccountsService {

  async findAll() {
    return fixtures.accounts;
  }

  async findTransactionsByDateRange(
    accountId: string,
    startDate: string,
    endDate: string,
  ) {
    return fixtures.transactions[accountId].filter(t => {
      const date = dayjs(t.timestamp);
      return dayjs(startDate).isBefore(date) && dayjs(endDate).isAfter(date);
    });
  }

  async findOldestTransaction(accountId: string) {
    return fixtures.transactions[accountId][0];
  }
}
