import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./layout/Layout";
import Mainpage from "./pages/Mainpage";
import TransactionHistory from "./pages/TransactionHistory";

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Mainpage />} />
          <Route path="/transactions" element={<TransactionHistory />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
