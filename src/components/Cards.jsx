import { Utils } from 'alchemy-sdk';
import {Link} from 'react-router-dom';
import { timeAgo } from './Utils';

export function BlockCard({value}){
    return <div className="m-4 flex justify-between items-center gap-6">
    <div>
      <div>
        <p>Block <Link to={"/block/" + value.number} className='text-sky-400'>{value.number}</Link></p>
      </div>
      <div>
        {timeAgo(value.timestamp)} 
      </div>
    </div>

    <div>
      <div>
        <p>Fee Recipient <Link to={"/address/" + value.miner} className='text-sky-400'>{value.miner.slice(0,10)}...</Link></p>
      </div>
      <div>
        {value.transactions.length} txns
      </div>
    </div>
  </div>;
}

export function TxCard({value}){
    return <div className="m-4 flex justify-between items-center gap-6">
    <div>
      <div>
        <p>TX# <Link to={"/tx/" + value.hash} className='text-sky-400'>{value.hash.slice(0,10)}...</Link></p>
      </div>
    </div>

    <div>
      <div>
      <p>From <Link to={"/address/" + value.from} className='text-sky-400'>{value.from.slice(0,10)}...</Link></p>
      </div>
      <div>
      <p>To <Link to={"/address/" + value.to} className='text-sky-400'>{value.to.slice(0,10)}...</Link></p>
      </div>
    </div>

    <div className='outline outline-1 rounded p-2'>
        {Utils.formatEther(value.value).slice(0,7)} ETH
      </div>
  </div>;
}