import React, { Suspense } from 'react';
import {
  Routes,
  Route,
} from "react-router-dom";
import routes from '../config/route';
import Loading from '../components/Loading';

const Home = React.lazy(() => import(/* webpackChunkName: "Home" */ './home/Home'));
const ChangeBackground = React.lazy(() => import(/* webpackChunkName: "ChangeBackground" */ './change-background/ChangeBackground'));
const GeneratePoster = React.lazy(() => import(/* webpackChunkName: "GeneratePoster" */ './generate-poster/GeneratePoster'));

const Router: React.FC = () => (
  <Suspense fallback={<Loading />}>
    <Routes>
      <Route path={routes.Home} Component={Home} />
      <Route path={routes.ChangeBackground} Component={ChangeBackground} />
      <Route path={routes.GeneratePoster} Component={GeneratePoster} />
    </Routes>
  </Suspense>
);

export default Router;