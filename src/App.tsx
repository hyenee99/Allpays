import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./layout/Layout";
import Mainpage from "./pages/Mainpage";
import TransactionHistory from "./pages/TransactionHistory";
import Merchants from "./pages/Merchants";
import MerhchantsDetail from "./pages/MerchantsDetail";

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Mainpage />} />
          <Route path="/transactions" element={<TransactionHistory />} />
          <Route path="/merchants" element={<Merchants />} />
          <Route path="/merchants/detail" element={<MerhchantsDetail />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
