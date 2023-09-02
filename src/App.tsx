import 'antd/dist/reset.css';
import Router from './pages/Router';

import Layout from './pages/Layout';
import { BrowserRouter } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Router />
      </Layout>
    </BrowserRouter>
  );
}

export default App;
