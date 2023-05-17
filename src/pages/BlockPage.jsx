import { useParams, Link } from "react-router-dom";
import { Alchemy, Network } from 'alchemy-sdk';
import { useEffect, useState } from 'react';
import { timeAgo } from "../components/Utils";
import { Utils } from 'alchemy-sdk';

const settings = {
  apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};

const alchemy = new Alchemy(settings);

export function BlockPage() {
    const [loading, setLoading] = useState(false);
    const { blockNumber } = useParams();
    const [blockInfo, setBlockInfo] = useState();
    const [latestBlock, setLatestBlock] = useState();


    useEffect(() => {
        async function getInfo() {
            setLoading(true);
            const block = await alchemy.core.getBlockWithTransactions(+blockNumber)
            const latestBlock = await alchemy.core.getBlockNumber();
            setBlockInfo(block);
            setLatestBlock(latestBlock);
            setLoading(false);
        }
        getInfo();
    }, [blockNumber]);

    return (
    <div className="flex justify-center items-center">
        <div className="text-left flex flex-col gap-4 p-4 m-4 outline outline-1 rounded">
            {loading ? <> Loading...</>:
            <>
            <div className="flex gap-4 items-center">
                <div>Block #{ blockNumber } </div>
                <div className="outline outline-1 rounded"><Link to={"/block/" + (+blockNumber-1)}><p className="px-2">{"<"}</p></Link></div>
                {+blockNumber === latestBlock ? "" :
                    <div className="outline outline-1 rounded"><Link to={"/block/" + (+blockNumber+1)}><p className="px-2">{">"}</p></Link></div>
                }
            </div>
            <div>Timestamp: {timeAgo(blockInfo?.timestamp)}</div>
            <div>Transactions: <Link to={"/txs/" + blockNumber} className='text-sky-400'>{blockInfo?.transactions.length} transactions</Link> in this block</div>
            <div>Fee Recipient: <Link to={"/address/" + blockInfo?.miner} className='text-sky-400'>{blockInfo?.miner}</Link></div>

            <div>Gas Used: {blockInfo?.gasUsed.toString()} {`(${(blockInfo?.gasUsed / blockInfo?.gasLimit * 100).toFixed(2)}%)`}</div>
            <div>Gas Limit: {blockInfo?.gasLimit.toString()}</div>
            <div>Base Fee Per Gas: {blockInfo? Utils.formatEther(blockInfo?.baseFeePerGas) : ''} ETH</div>
            </>
            }
        </div>
    </div>
    );
  }