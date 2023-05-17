import { useParams, Link } from "react-router-dom";
import { Alchemy, Network } from 'alchemy-sdk';
import React, { useEffect, useState } from 'react';
import { Utils } from 'alchemy-sdk';

const settings = {
  apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};

const alchemy = new Alchemy(settings);

export function TxDetails() {
    const [loading, setLoading] = useState(false);
    const { txHash } = useParams();
    const [txInfo, setTxInfo] = useState();

    useEffect(() => {
        async function getInfo() {
            setLoading(true);
            const tx = await alchemy.core.getTransaction(txHash)
            setTxInfo(tx);
            setLoading(false);
        }
        getInfo();
    }, [txHash]);

    return (
        <>
            <div className="text-left p-2 m-2">
                <div>Transaction Details</div>
            </div>

            <div className="text-left flex justify-center items-center">
                <div className=" flex flex-col gap-2 p-4 m-4 outline outline-1 rounded max-w-[100rem]">
                {loading ? <> Loading...</>:
                <>
                <div>Transaction Hash: {txInfo?.hash}</div>
                <div className="flex gap-2 items-center">
                    <div>Block: <Link to={"/block/" + txInfo?.blockNumber} className='text-sky-400'>{txInfo?.blockNumber}</Link></div>
                    <div className="rounded outline outline-1 px-2"> {txInfo?.confirmations} Block Confirmations</div>
                </div>
                <div>From: <Link to={"/address/" + txInfo?.from} className='text-sky-400'>{txInfo?.from}</Link></div>
                <div>To: <Link to={"/address/" + txInfo?.to} className='text-sky-400'>{txInfo?.to}</Link></div>
                <div>Value: {txInfo && Utils.formatEther(txInfo?.value)} ETH</div>
                <div>Gas Price: {txInfo && Utils.formatUnits(txInfo?.gasPrice, "gwei")} Gwei {`(${txInfo && Utils.formatUnits(txInfo?.gasPrice)}) ETH`}</div>

                <div>Gas Limit: {txInfo?.gasLimit.toString()}</div>
                {txInfo?.maxFeePerGas &&
                    <div className="flex gap-2">Gas Fees:
                        <div>Max: {Utils.formatUnits(txInfo?.maxFeePerGas, "gwei")} Gwei</div>
                        <div>{"|"}</div>
                        <div>Max Priority: {Utils.formatUnits(txInfo?.maxPriorityFeePerGas, "gwei")} Gwei</div>
                    </div>
                }

                <div className="flex gap-2 items-center">Other Attributes:
                    <div className="rounded outline outline-1 px-2">Txn Type: {txInfo?.type} </div>
                    <div className="rounded outline outline-1 px-2">Nonce: {txInfo?.nonce} </div>
                    <div className="rounded outline outline-1 px-2">Position In Block: {txInfo?.transactionIndex} </div>
                </div>
                </>
                }
                </div>
            </div>
        </>
    );
  }