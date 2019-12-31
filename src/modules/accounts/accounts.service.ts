import { Injectable } from '@nestjs/common';
import { TransactionRo, AccountRo } from '@kanedama/common';
import * as dayjs from 'dayjs';
import { HttpClient } from '../../common/service/http-client';
import { REMOTE_ENDPOINT } from '../../common/utils';

@Injectable()
export class AccountsService {
  constructor(protected http: HttpClient) {}

  findAll() {
    return this.http.get<AccountRo[]>(`${REMOTE_ENDPOINT}/accounts`);
  }

  findTransactionsByDateRange(
    accountId: string,
    startDate: string,
    endDate: string,
  ) {
    return this.http.get<TransactionRo[]>(
      `${REMOTE_ENDPOINT}/accounts/${accountId}/transactions?from=${startDate}&to=${endDate}`,
    );
  }

  findOldestTransaction(accountId: string) {
    return this.http.get<TransactionRo>(
      `${REMOTE_ENDPOINT}/accounts/${accountId}/transactions`,
    );
  }

  async findPositiveTransactionsByPeriod(
    accountId: string,
    monthDuration: number,
  ) {
    /**
     * We need to find the most recent transaction first
     */
    const recentTransac = await this.findMostRecentTransaction(accountId);
    /**
     * We then need to get all the positives transactions for the x months prior
     */
    const startDate = dayjs(recentTransac.timestamp).subtract(
      monthDuration,
      'month',
    );
    const endDate = dayjs(recentTransac.timestamp).add(1, 'h'); // To be sure we account for the recent transac' in case there's a strict comparison check

    const transactions = await this.findTransactionsByDateRange(
      accountId,
      startDate.toISOString(),
      endDate.toISOString(),
    );
    return transactions.map(t => (t.amount > 0 ? t : null)).filter(t => !!t);
  }

  async findAllPositiveTransactions(accountId: string) {
    return (await this.findAllTransactions(accountId))
      .map(t => (t.amount > 0 ? t : null))
      .filter(t => !!t);
  }

  async findMostRecentTransaction(accountId: string) {
    let startDate = dayjs();
    let endDate = dayjs();
    startDate = startDate.subtract(365, 'day');

    const oldestTransac = await this.findOldestTransaction(accountId);
    /**
     * If there isn't even any recorded transaction we return null
     */
    if (!oldestTransac) return null;

    while (true) {
      const result = await this.findTransactionsByDateRange(
        accountId,
        startDate.toISOString(),
        endDate.toISOString(),
      );
      /**
       * The service already return sorted transactions by date
       */
      if (result.length > 0) return result[result.length - 1];
      /**
       * We haven't found any transaction for this period, so we'll try for a previous year
       */
      endDate = endDate.subtract(365, 'day');
      startDate = startDate.subtract(365, 'day');

      if (endDate.isBefore(dayjs(oldestTransac.timestamp))) return null;
    }
  }

  async findAllTransactions(accountId: string) {
    let startDate = dayjs();
    let endDate = dayjs();
    startDate = startDate.subtract(365, 'day');

    const oldestTransac = await this.findOldestTransaction(accountId);
    if (!oldestTransac) return [];

    let transactions: TransactionRo[] = [];
    while (true) {
      const result = await this.findTransactionsByDateRange(
        accountId,
        startDate.toISOString(),
        endDate.toISOString(),
      );
      transactions = transactions.concat(result);
      /**
       * On to the previous period
       */
      endDate = endDate.subtract(365, 'day');
      startDate = startDate.subtract(365, 'day');

      if (endDate.isBefore(dayjs(oldestTransac.timestamp))) break;
    }
    return transactions;
  }
}
