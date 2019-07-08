const TransactionPool = require('./transaction-pool');
const Transaction = require('./transaction');
const Wallet = require('./index');


describe('TransactionPool', () => {
  let transactionPool;
  let transaction;
  let senderWallet;

  beforeEach(() => {
    transactionPool = new TransactionPool();
    senderWallet = new Wallet();

    transaction = new Transaction({
      senderWallet,
      recipient: 'Ryan!',
      amount: 50
    })
  });

  describe('setTransaction()', () => {
    //this function will have two primary behaviors;
    it('adds a transaction', () => {
      //we will use transaction pool instance and call setTransaction
      //we are passing it a transaction object
      transactionPool.setTransaction(transaction);

      expect(transactionPool.transactionMap[transaction.id])
        //tobe checks for original instance of that object
        .toBe(transaction);
    });
  });

  describe('existingTransaction()', () => {
    it('returns an existing transaction given an input address', () => {
      transactionPool.setTransaction(transaction);

      expect(
        transactionPool.existingTransaction({ inputAddress: senderWallet.publicKey })
      ).toBe(transaction);
    });
  });

  describe('validTransactions()', () => {
    let validTransactions, errorMock;

    beforeEach(() => {
      validTransactions = [];
      errorMock = jest.fn();
      global.console.error = errorMock;

      for (let i = 0; i < 10; i ++) {
        transaction = new Transaction({
          senderWallet,
          recipient: 'any-recipient',
          amount: 30
        });

        if (i % 3 === 0) {
          transaction.input.amount = 999999;
        } else if (i % 3 === 1) {
          transaction.input.signature = new Wallet().sign('foo');
        } else {
          validTransactions.push(transaction);
        }

        transactionPool.setTransaction(transaction);
      }
    });
    it('returns valid transaction', () => {
      expect(transactionPool.validTransactions()).toEqual(validTransactions);
    });

    it('logs errors for the invalid transactions', () => {
      transactionPool.validTransactions();
      expect(errorMock).toHaveBeenCalled();
    });
  });
});
