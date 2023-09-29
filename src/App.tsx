import "antd/dist/reset.css";
import Router from "./pages/Router";

import Layout from "./pages/Layout";
import { BrowserRouter } from "react-router-dom";
import { RecoilRoot, useRecoilState } from "recoil";
import processingState, { ProcessingState } from "./state/processing";
import Processing from "./components/Processing";

function App() {
  return (
    <RecoilRoot>
      <BrowserRouter>
        <Layout>
          <Router />
        </Layout>
      </BrowserRouter>
    </RecoilRoot>
  );
}

export default App;
