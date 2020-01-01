import { Injectable, HttpException } from '@nestjs/common';
import { TransactionRo, AnswerDto, AccountRo } from '@kanedama/common';
import * as dayjs from 'dayjs';
import { AccountsService } from '../accounts/accounts.service';

@Injectable()
export class AnswerService {
  constructor(public accountsService: AccountsService) {}

  async getAnswer() {
    const accounts = await this.accountsService.findAll();
    const avgIncome = await this.makeAverageIncome(accounts, 6);
    const minMax = await this.findMinMaxBalance(accounts);
    const hasActivity = await this.has3YearsActivity(accounts);

    return {
      '6_month_average_income': Math.floor(avgIncome),
      '3_years_activity': hasActivity,
      max_balance: Math.floor(minMax.max),
      min_balance: Math.floor(minMax.min),
    } as AnswerDto;
  }

  async makeAverageIncome(accounts: AccountRo[], months: number) {
    const transactionsTasks: Promise<TransactionRo[]>[] = [];

    for (const account of accounts) {
      transactionsTasks.push(
        this.accountsService.findPositiveTransactionsByPeriod(
          account.account_id,
          months,
        ),
      );
    }
    // Positive transactions for the past x months
    const transactions = (await Promise.all(transactionsTasks)).reduce(
      (acc, val) => acc.concat(val), // flatten
      [],
    );
    const sum = transactions.reduce((acc, v) => (acc += v.amount), 0);
    return sum / transactions.length;
  }

  async findMinMaxBalance(accounts: AccountRo[]) {
    let transactions: TransactionRo[] = [];
    for (const account of accounts) {
      const result = await this.accountsService.findAllTransactions(
        account.account_id,
      );
      transactions = transactions.concat(result);
    }
    transactions = transactions.sort((a, b) =>
      dayjs(a.timestamp).isBefore(dayjs(b.timestamp)) ? -1 : 1,
    );

    let min = Infinity;
    let max = 0;
    let balance = 0;
    for (const trans of transactions) {
      balance += trans.amount;
      if (balance > max) {
        max = balance;
      }
      if (balance < min) {
        min = balance;
      }
    }
    return {
      min,
      max,
    };
  }

  async has3YearsActivity(accounts: AccountRo[]) {
    let oldTransactions: TransactionRo[] = [];
    let recentTransactions: TransactionRo[] = [];
    for (const account of accounts) {
      oldTransactions = oldTransactions.concat(
        await this.accountsService.findOldestTransaction(account.account_id),
      );
      recentTransactions = recentTransactions.concat(
        await this.accountsService.findMostRecentTransaction(
          account.account_id,
        ),
      );
    }

    let oldest = oldTransactions.sort((a, b) =>
      dayjs(a.timestamp).isBefore(dayjs(b.timestamp)) ? -1 : 1,
    )[0];
    let recent = recentTransactions.sort((a, b) =>
      dayjs(a.timestamp).isBefore(dayjs(b.timestamp)) ? 1 : -1,
    )[0];

    return dayjs(recent.timestamp).diff(dayjs(oldest.timestamp), 'y') >= 3;
  }
}
