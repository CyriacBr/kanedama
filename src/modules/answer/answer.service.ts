import { Injectable, HttpException } from '@nestjs/common';
import { TransactionRo, AnswerDto, AccountRo } from '@kanedama/common';
import { AccountsService } from 'modules/accounts/accounts.service';

@Injectable()
export class AnswerService {
  constructor(
    public accountsService: AccountsService,
  ) {}

  async getAnswer() {
    const accounts = await this.accountsService.findAll();
    const avgIncome = await this.makeAverageIncome(accounts, 6);
    return {
      '6_month_average_income': avgIncome,
    } as AnswerDto;
  }

  async makeAverageIncome(accounts: AccountRo[], months: number) {
    const transactionsTasks: Promise<TransactionRo[]>[] = [];
    const allTransactionsTasks: Promise<TransactionRo[]>[] = [];

    for (const account of accounts) {
      transactionsTasks.push(
        this.accountsService.findPositiveTransactionsByPeriod(
          account.account_id,
          months,
        ),
      );
      allTransactionsTasks.push(
        this.accountsService.findAllPositiveTransactions(account.account_id),
      );
    }
    // Positive transactions for the past x months
    const transactions = (await Promise.all(transactionsTasks)).reduce(
      (acc, val) => acc.concat(val), // flatten
      [],
    );
    // All positive transactions
    const allTransactions = (await Promise.all(allTransactionsTasks)).reduce(
      (acc, val) => acc.concat(val), // flatten
      [],
    );
    const sum = transactions.reduce((acc, v) => (acc += v.amount), 0);
    return sum / allTransactions.length;
  }
}
