import {
  Routes,
  Route,
} from "react-router-dom";

import Home from './home/Home';
import ChangeBackground from "./change-background/ChangeBackground";

const Router: React.FC = () => (
  <Routes>
    <Route path="/" Component={Home} />
    <Route path="/change-background" Component={ChangeBackground} />
  </Routes>
);

export default Router;