import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./layout/Layout";
import Mainpage from "./pages/Mainpage";

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Mainpage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
