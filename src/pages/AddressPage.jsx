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
        <td><Link to={"/tx/" + value.hash} className='text-sky-400'><p>{value.hash?.slice(0,20)}...</p></Link></td>
        <td><Link to={"/block/" + parseInt(value.blockNum, 16)} className='text-sky-400'><p>{parseInt(value.blockNum, 16)}</p></Link></td>
        <td><Link to={"/txs/" + value.from} className='text-sky-400'><p>{value.from?.slice(0,20)}...</p></Link></td>

        {
            value.in? 
            <td><p className="flex items-center justify-center h-6 w-12 rounded-md outline outline-1 outline-green-400 bg-green-200 text-green-700 text-xs"> IN </p></td>
            :<td><p className="flex items-center justify-center h-6 w-12 rounded-md outline outline-1 outline-yellow-400-400 bg-yellow-200 text-yellow-700 text-xs"> OUT </p></td>
        }

        <td><Link to={"/txs/" + value.to} className='text-sky-400'><p>{value.to?.slice(0,20)}...</p></Link></td>
        <td><p>{value?.value} {value?.asset}</p></td>
    </tr>
}

export function AddressPage() {
    const [loading, setLoading] = useState(false);
    const { address } = useParams();
    const [balance, setBalance] = useState();
    const [history, setHistory] = useState();
    const [selected, setSelected] = useState();

    useEffect(() => {
        getInfo(['external']);
        setSelected('external');
    }, [address]);

    const onClickTransactions = () => {
        getInfo(['external']);
        setSelected('external');
    };

    const onClickInternal = () => {
        getInfo(['internal']);
        setSelected('internal');
    };

    const onClickToken = () => {
        getInfo(['erc20']);
        setSelected('token');
    };

    const onClickNFT = () => {
        getInfo(['erc721', 'erc1155']);
        setSelected('nft');
    };

    const getHeader = () => {
        switch (selected) {
            case 'external':  return `Latest ${history?.length} from a total of ${history?.length} transactions`;
            case 'internal':  return `Latest ${history?.length} internal transactions`;
            case 'token':  return `Latest ${history?.length} ERC-20 Token Transfer Events`;
            case 'nft':  return `Latest ${history?.length} NFT Transfers Token Transfer Events`;
            default: return ``;
        }
    };

    async function getInfo(category) {
        setLoading(true);
        const balance = await alchemy.core.getBalance(address);
        setBalance(balance)

        const from = await alchemy.core.getAssetTransfers({
            fromBlock: "0x0",
            fromAddress: address,
            excludeZeroValue: false,
            category: category,
        });

        const to = await alchemy.core.getAssetTransfers({
            fromBlock: "0x0",
            toAddress: address,
            excludeZeroValue: false,
            category: category,
        });

        const all = [...from.transfers.map(obj => ({ ...obj, in: false })), ...to.transfers.map(obj => ({ ...obj, in: true }))]
        const sortedHistory = all.sort((a,b)=>parseInt(b.blockNum, 16) - parseInt(a.blockNum, 16))

        setHistory(sortedHistory);
        setLoading(false);
    }

    return (
        <> 
            <div className="flex justify-center gap-4 p-4">
                <div className="flex flex-col gap-4 p-4 outline outline-1 rounded max-w-[100rem]">
                    <div>Address {address}</div>
                    <div>ETH BALANCE {balance && Utils.formatEther(balance)} ETH</div>
                </div>
            </div>

            <div className="flex justify-center gap-4">
                <button type="button" onClick={onClickTransactions}><p className={`${selected === 'external' ? 'outline-blue-600 bg-blue-500 text-white' : 'outline-gray-400 bg-gray-300 text-black'} flex items-center justify-center h-6 w-20 rounded-md outline outline-1 text-xs`}>Transactions</p></button>
                <button type="button" onClick={onClickInternal}><p className={`${selected === 'internal' ? 'outline-blue-600 bg-blue-500 text-white' : 'outline-gray-400 bg-gray-300 text-black'} flex items-center justify-center h-6 w-32 rounded-md outline outline-1 text-xs`}>Internal Transactions</p></button>
                <button type="button" onClick={onClickToken}><p className={`${selected === 'token' ? 'outline-blue-600 bg-blue-500 text-white' : 'outline-gray-400 bg-gray-300 text-black'} flex items-center justify-center h-6 w-40 rounded-md outline outline-1 text-xs`}>Token Transfers {`(ERC-20)`}</p></button>
                <button type="button" onClick={onClickNFT}><p className={`${selected === 'nft' ? 'outline-blue-600 bg-blue-500 text-white' : 'outline-gray-400 bg-gray-300 text-black'} flex items-center justify-center h-6 w-20 rounded-md outline outline-1 text-xs`}>NFT</p></button>
            </div>

            <div className="flex justify-center items-center">
                <div className=" flex flex-col gap-4 p-4 m-4 outline outline-1 rounded max-w-[100rem]">
                {loading ? <> Loading...</>:
                <>

                { getHeader() }
                

                <hr className="h-px w-auto border-0 bg-black"></hr>

                {
                
                <table className="table-auto border-separate border-spacing-x-4 border-spacing-y-1">
                <thead>
                    <tr>
                        <th>Transaction Hash</th>
                        <th>Block</th>
                        <th>From</th>
                        <th> </th>
                        <th>To</th>
                        <th>Value</th>
                    </tr>
                </thead>
                <tbody>
                {
                    history?.map((value) => (
                        <React.Fragment key={`${value.hash}`}>
                        <Tx value={value} />
                        </React.Fragment>
                    ))
                }
                </tbody>
                </table>
                
                }

                </>
                }
                </div>
            </div>
        </>
    );
  }