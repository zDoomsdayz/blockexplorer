import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import './App.css';
import { HomePage } from './pages/HomePage';
import { BlockPage } from './pages/BlockPage';
import { TxPage } from "./pages/TxPage";
import { TxDetails } from "./pages/TxDetails";
import { AddressPage } from "./pages/AddressPage";

function App() {
	
	return (
		<div className="App">
      <BrowserRouter>
      <Link to={"/"}><img src="https://etherscan.io/assets/svg/logos/logo-etherscan.svg?v=0.0.5" alt="home" className="w-48 h-auto m-4"/></Link>
      <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/block/:blockNumber" element={<BlockPage />} />
          <Route path="/txs/:blockNumber" element={<TxPage />} />
          <Route path="/tx/:txHash" element={<TxDetails />} />
          <Route path="/address/:address" element={<AddressPage />} />
      </Routes>
      </BrowserRouter>
		</div>
	);
}
		
export default App;