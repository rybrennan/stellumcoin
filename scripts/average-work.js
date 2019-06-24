const Blockchain = require('./blockchain/blockchain');

const blockchain = new Blockchain();

blockchain.addBlock({ data: 'initial ' });

let prevTimestamp;
let nextTimestamp;
let nextBlock;
let timeDiff;
let average;


const times = [];

for (let i = 0; i < 10000; i++) {
  prevTimestamp = blockchain.chain[blockchain.chain.length - 1].timestamp;
  blockchain.addBlock({ data: `block ${i}` });
  nextBlock = blockchain.chain[blockchain.chain.length - 1];

  nextTimestamp = nextBlock.timestamp;
  //how long it took us to mine new block
  timeDiff = nextTimestamp - prevTimestamp;
  times.push(timeDiff);

  average = times.reduce((total, num) => (total + num)) / times.length;
  console.log(`Time to mine block: ${timeDiff}ms Difficulty: ${nextBlock.difficulty}. Average time: ${average}ms`)
}
