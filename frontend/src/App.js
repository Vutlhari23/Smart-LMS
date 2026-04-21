
import {BrowserRouter, Routes,Route} from "react-router-dom"
import Login from "./components/Login.jsx"
import Register from "./components/Register.jsx"
import NavBar from "./components/NavBar.jsx";

function App() {
  return (
 <>
 <NavBar/>
 
    <Routes path="/login" elements= {<Login/>}/>
    <Routes path="/register" elements ={<Register/>}/>
 
 
 </>
  );
}

export default App;
