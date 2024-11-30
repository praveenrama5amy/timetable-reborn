//import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router";
import './index.css'
import App from './App.tsx'
import Login from './Login.tsx'
import Register from './Register.tsx'
import Classes from './pages/Classes.tsx';
import Faculties from './pages/Faculties.tsx';
import Subjects from './pages/Subjects.tsx';
import Summary from './pages/Summary.tsx';
import Settings from './pages/Settings.tsx';


import Nav from './pages/Nav.tsx';

//BootStrap Icons 
import "../node_modules/bootstrap-icons/font/bootstrap-icons.css"


createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Routes>
      <Route path='/login' element={<Login />} />
      <Route path="/Register" element={<Register />} />
      <Route path='/'>
        <Route path="/" element={<App />} index />
        <Route path='/' element={<Nav />}>
          <Route path="/classes" element={<Classes />} />
          <Route path="/faculties" element={<Faculties />} />
          <Route path="/subjects" element={<Subjects />} />
          <Route path="/summary" element={<Summary />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Route>
    </Routes>
  </BrowserRouter >
)
