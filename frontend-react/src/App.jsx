import {
  BrowserRouter,
  Routes,
  Route,
  NavLink,
} from "react-router-dom";

import Home from "./pages/Home";
import Prediction from "./pages/Prediction";
import BillEstimator from "./pages/BillEstimator";
import About from "./pages/About";

import "./App.css";


function Navigation() {

  return (

    <header className="navbar">

      <NavLink
        to="/"
        className="nav-brand"
      >

        <div className="nav-logo">
          ⚡
        </div>

        <div>

          <strong>
            SmartHome
          </strong>

          <span>
            Energy Intelligence
          </span>

        </div>

      </NavLink>


      <nav>

        <NavLink to="/">
          Home
        </NavLink>

        <NavLink to="/prediction">
          Prediction
        </NavLink>

        <NavLink to="/bill-estimator">
          Bill Estimator
        </NavLink>

        <NavLink to="/about">
          About
        </NavLink>

      </nav>

    </header>

  );

}


function App() {

  return (

    <BrowserRouter>

      <div className="app">

        <Navigation />

        <Routes>

          <Route
            path="/"
            element={<Home />}
          />

          <Route
            path="/prediction"
            element={<Prediction />}
          />
          <Route
  path="/bill-estimator"
  element={<BillEstimator />}
/>

          <Route
            path="/about"
            element={<About />}
          />

        </Routes>


        <footer>

          SmartHome Energy Intelligence
          • Machine Learning • FastAPI

        </footer>

      </div>

    </BrowserRouter>

  );

}


export default App;