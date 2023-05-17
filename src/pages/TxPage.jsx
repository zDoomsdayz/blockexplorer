import { useParams, Link } from "react-router-dom";
import { Alchemy, Network } from 'alchemy-sdk';
import React, { useEffect, useState } from 'react';
import { Utils } from 'alchemy-sdk';

const settings = {
  apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};

const alchemy = new Alchemy(settings);

function Tx({value}){
    return <tr>
        <td><Link to={"/tx/" + value.hash} className='text-sky-400'><p>{value.hash.slice(0,20)}...</p></Link></td>
        <td><Link to={"/address/" + value.from} className='text-sky-400'><p>{value.from.slice(0,20)}...</p></Link></td>
        <td><p className="flex items-center justify-center h-6 w-6 rounded-full outline outline-1 outline-green-400 bg-green-200 text-green-700"> → </p></td>
        <td><Link to={"/address/" + value?.to} className='text-sky-400'><p>{value.to? value.to?.slice(0,20): "Create: " + value.creates?.slice(0,20)}...</p></Link></td>
        <td><p>{Utils.formatEther(value.value).slice(0,7)} ETH</p></td>
    </tr>
}

export function TxPage() {
    const [loading, setLoading] = useState(false);
    const { blockNumber } = useParams();
    const [blockInfo, setBlockInfo] = useState();

    useEffect(() => {
        async function getInfo() {
            setLoading(true);
            const block = await alchemy.core.getBlockWithTransactions(+blockNumber)
            setBlockInfo(block);
            setLoading(false);
        }
        getInfo();
    }, [blockNumber]);

    return (
        <>
            <div className="p-2 m-2 items-center">
                <div className="font-bold">Transaction</div>
                <div>For Block <Link to={"/block/" + blockNumber} className='text-sky-400'>{blockNumber}</Link></div>
            </div>

            <div className="flex justify-center items-center">
                <div className=" flex flex-col gap-4 p-4 m-4 outline outline-1 rounded max-w-[100rem]">
                {loading ? <> Loading...</>:
                <>
                A total of {blockInfo?.transactions.length} transactions found
                <hr className="h-px w-auto border-0 bg-black"></hr>

                <table className="table-auto border-separate border-spacing-x-4 border-spacing-y-1">
                <thead>
                    <tr>
                        <th>Txn Hash</th>
                        <th>From</th>
                        <th> </th>
                        <th>To</th>
                        <th>Value</th>
                    </tr>
                </thead>
                <tbody>
                {
                    blockInfo?.transactions.slice(0).reverse().map((value) => (
                        <React.Fragment key={`${value.hash}`}>
                        <Tx value={value} />
                        </React.Fragment>
                    ))
                }
                </tbody>
                </table>
                </>
                }
                </div>
            </div>
        </>
    );
  }