import {
  Routes,
  Route,
} from "react-router-dom";
import routes from '../config/route';
import Home from './home/Home';
import ChangeBackground from "./change-background/ChangeBackground";

const Router: React.FC = () => (
  <Routes>
    <Route path={routes.Home} Component={Home} />
    <Route path={routes.ChangeBackground} Component={ChangeBackground} />
  </Routes>
);

export default Router;