import { Injectable } from '@nestjs/common';
import { TransactionRo } from '@kanedama/common';
import * as dayjs from 'dayjs';
import { HttpClient } from 'common/service/http-client';

@Injectable()
export class AccountsService {
  constructor(private http: HttpClient) {}

  findTransactions(accountId: string, startDate: string, endDate: string) {
    return this.http.get<TransactionRo[]>(
      `https://kata.getmansa.com/accounts/${accountId}/transactions?from=${startDate}&to=${endDate}`,
    );
  }

  findOldestTransaction(accountId: string) {
    return this.http.get<TransactionRo>(
      `https://kata.getmansa.com/accounts/${accountId}/transactions`,
    );
  }

  async findPositiveTransactions(accountId: string, monthDuration: number) {
    /**
     * We need to find the most recent transaction first
     */
    const recentTransac = await this.findMostRecentTransaction(accountId);
    console.log('recentTransac :', recentTransac);
    /**
     * We then need to get all the positives transactions for the 6 months prior to ^
     */
    const startDate = dayjs(recentTransac.timestamp).subtract(
      monthDuration,
      'month',
    );
    const endDate = dayjs(recentTransac.timestamp)
      .add(1, 'h'); // Au cas oû l'égalité est stricte côté serveur
      
    const transactions = await this.findTransactions(
      accountId,
      startDate.toISOString(),
      endDate.toISOString(),
    );
    return transactions.map(t => (t.amount > 0 ? t : null)).filter(t => !!t);
  }

  async findMostRecentTransaction(accountId: string) {
    let startDate = dayjs();
    let endDate = dayjs();
    startDate = startDate.subtract(1, 'year');
    startDate = startDate.subtract(1, 'day');

    const oldestTransac = await this.findOldestTransaction(accountId);
    /**
     * If there isn't even any recorded transaction we return null
     */
    if (!oldestTransac) return null;

    while (true) {
      const result = await this.findTransactions(
        accountId,
        startDate.toISOString(),
        endDate.toISOString(),
      );
      /**
       * The service already return sorted transactions by date
       */
      if (result.length > 0) return result[result.length - 1];
      /**
       * We haven't found any trasanction for this period, so we'll try for a previous year
       */
      endDate = endDate.subtract(1, 'year');
      startDate = startDate.subtract(1, 'year');

      if (endDate.isBefore(dayjs(oldestTransac.timestamp))) return null;
    }
  }
}
