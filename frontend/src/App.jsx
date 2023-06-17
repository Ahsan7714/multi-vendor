import { Route, Routes } from "react-router";
import Header from "./components/Header";
import axios from "axios";

export default function App() {
  axios.defaults.baseURL="http://localhost:3000/api/v1"
  return (
    <>
      <Header/>
    <Routes>
      <Route  />
    </Routes>
    </>
  )
}