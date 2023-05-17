import { Alchemy, Network } from 'alchemy-sdk';
import React, { useEffect, useState } from 'react';

import { BlockCard, TxCard } from '../components/Cards';
import SearchBar from '../components/SearchBar';

const settings = {
  apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};

const alchemy = new Alchemy(settings);

async function GetLast6Block(blockNumber){
  let blockPromises = [];
  for(let i = blockNumber - 6; i <= blockNumber; i++){
    blockPromises.push(alchemy.core.getBlockWithTransactions(i));
  }
  try {
    const blocks = await Promise.all(blockPromises);
    return blocks;
  } catch (err) {
    console.error(err);
    throw new Error("Failed to retrieve blocks");
  }
}

export function HomePage() {
  const [loading, setLoading] = useState(false);
  const [latestBlock, setLatestBlock] = useState();
  const [lastFewBlock, setLastFewBlock] = useState();

  useEffect(() => {
    async function getBlockNumber() {
      setLoading(true);
      const number = await alchemy.core.getBlockNumber();
      setLatestBlock(number);
      setLastFewBlock(await GetLast6Block(number));
      setLoading(false);
    }

    getBlockNumber();
  }, []);

  return (
  <>
     <SearchBar latestBlock={latestBlock}/>
    {loading? <>Loading...</>:
    <div className="flex gap-20 items-center justify-center p-20">
      <div className="outline outline-1 rounded-xl shadow-xl">
        <div className='m-4 font-bold'>Latest Blocks</div>
        {lastFewBlock?.slice(0).reverse().map((value) => (
          <React.Fragment key={`${value.number}`}>
          <hr className="h-px w-auto border-0 bg-black"></hr>
          <BlockCard value={value} />
          </React.Fragment>
        ))}
      </div>

      <div className="outline outline-1 rounded-xl shadow-xl">
        <div className='m-4 font-bold'>Latest Transactions</div>
        {lastFewBlock?.[lastFewBlock.length-1].transactions?.slice(-7).reverse().map((value) => (
          <React.Fragment key={`${value.hash}`}>
          <hr className="h-px w-auto border-0 bg-black"></hr>
          <TxCard value={value} />
          </React.Fragment>
        ))
        }
      </div>
    </div>
  }
  </>
  );
}