const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const path = require('path');
const api = require('./routes/api');

const Blockchain = require('./blockchain/blockchain');
const TransactionPool = require('./wallet/transaction-pool.js');

const app = express();
const blockchain = new Blockchain();
const transactionPool = new TransactionPool();

const DEFAULT_PORT = 3000;
const ROOT_NODE_ADDRESS = `http://localhost:${DEFAULT_PORT}`

app.use(bodyParser.json());
app.use(express.static('client/dist'));
app.use('/', api);


app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './client/dist/index.html'))
});

const syncWithRootState = () => {
  request({ url: `${ROOT_NODE_ADDRESS}/api/blocks` }, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      const rootChain = JSON.parse(body);

      console.log('replace chain on a sync with', rootChain);
      blockchain.replaceChain(rootChain);
    }
  });
  request({ url: `${ROOT_NODE_ADDRESS}/api/transaction-pool-map` }, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      const rootTransactionPoolMap = JSON.parse(body);

      console.log('replace transaction pool map on a sync with', rootTransactionPoolMap);
      transactionPool.setMap(rootTransactionPoolMap)
    }
  })
};

let PEER_PORT;

if (process.env.GENERATE_PEER_PORT === 'true') {
  PEER_PORT = DEFAULT_PORT + Math.ceil(Math.random() * 1000);
}

const PORT = PEER_PORT || DEFAULT_PORT;

app.listen(PORT, () => {
  console.log(`We listening at localhost:${PORT}`);

  if (PORT !== DEFAULT_PORT) {
    syncWithRootState();
  }
});






