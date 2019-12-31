import { TransactionRo } from 'common/ro/transaction.ro';

const transactions: Record<string, TransactionRo[]> = {
  '1': [
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
  ],
  '2': [
    {
      amount: 200,
      currency: 'USD',
      status: null,
      timestamp: '2014-01-02 10:00:00',
      transaction_category: null,
      transaction_type: null,
    },
    {
      amount: -300,
      currency: 'USD',
      status: null,
      timestamp: '2014-01-03 10:00:00',
      transaction_category: null,
      transaction_type: null,
    },
    {
      amount: 180,
      currency: 'USD',
      status: null,
      timestamp: '2015-01-02 10:00:00',
      transaction_category: null,
      transaction_type: null,
    },
    {
      amount: 500,
      currency: 'USD',
      status: null,
      timestamp: '2015-04-02 10:00:00',
      transaction_category: null,
      transaction_type: null,
    },
  ]
};

export { transactions };
