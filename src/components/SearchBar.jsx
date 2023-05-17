import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

function SearchBar(block) {
    const { latestBlock } = block;
    const [search, setsearch] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setsearch(e.target.value);
    }

    const handleSubmit = (e)=> {
        if(search.length === 0) return;

        if (e.key === 'Enter' || e.type === 'click') {
            if(search.startsWith('0x') && search.length === 66) {
                navigate(`/tx/${search}`);
            } else if(search.startsWith('0x') && search.length === 42) {
                navigate(`/address/${search}`);
            } else if (+search > 0 && +search <= latestBlock ) {
                navigate(`/block/${search}`);
            } else {
                alert("Make sure to enter the correct Address / Txn Hash / Block / Token.");
            }
        }
    };

    return (
    <>
        The Ethereum Blockchain Explorer
        <div className='p-4 max-w-xl mx-auto'>
            <div className="relative">
                <input 
                className="block w-full p-4 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50" 
                placeholder="Search by Address / Txn Hash / Block / Token"
                value={search}
                onChange={handleChange}
                onKeyDown={handleSubmit}
                />
                <button onClick={handleSubmit}
                className="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2">
                    <svg aria-hidden="true" 
                    className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                    </svg>
                </button>
            </div>
        </div>
    </>
  )
}

export default SearchBar