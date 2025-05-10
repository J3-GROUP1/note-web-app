import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
import Home from "./pages/Home/Home";
import SignUp from "./pages/SignUp/SignUp";
import Login from "./pages/Login/Login";
import NotFound from "./pages/NotFound/NotFound";
import Landing from "./pages/Landing/Landing";
import MainLanding from "./pages/Landing/MainLanding";
import "./App.css";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path="/" element={<MainLanding />}></Route>
      <Route path="/dashboard" element={<Home />}></Route>
      <Route path="/signup" element={<SignUp />}></Route>
      <Route path="/login" element={<Login />}></Route>
      <Route path="*" element={<NotFound />}></Route>
    </Route>
  )
);

export default function App() {
  return <RouterProvider router={router} />;
}
