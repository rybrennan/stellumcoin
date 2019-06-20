const Block = require('./block');
//was exported in an object
const { GENESIS_DATA } = require('./config');
//first arg to describe is name of tests followed by JS function to be run
describe('Block', () => {
  //variable for every relevant field of a block
  const timestamp = 'a-date';
  const lastHash = 'foo-hash';
  const hash = 'bar-hash';
  const data = ['blockchain', 'data'];
  const block = new Block({ timestamp, lastHash, hash, data });

  it('has a timestamp, lastHash, hash, and data property', () => {
    //actual value, expected equal
    expect(block.timestamp).toEqual(timestamp);
    expect(block.lastHash).toEqual(lastHash);
    expect(block.hash).toEqual(hash);
    expect(block.data).toEqual(data);
  });

  describe('genesis()', () => {
    //not on instance of Block, but on Block classname itself
    //going to be a Static Function on the Block
    const genesisBlock = Block.genesis();
    it('returns a Block instance', () => {
      expect(genesisBlock instanceof Block).toBe(true);
    });

    it('returns genesis data', () => {
      expect(genesisBlock).toEqual(GENESIS_DATA);
    });
  });
});
