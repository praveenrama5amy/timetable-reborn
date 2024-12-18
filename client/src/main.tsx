//import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router";
import './index.css'


//pages 
import App from './App.tsx'


//BootStrap Icons 
import "../node_modules/bootstrap-icons/font/bootstrap-icons.css"
import AppDataProvider from './context/AppDataContext.tsx';
import AuthProvider from './context/AuthContext.tsx';
import Classes from './pages/Classes.tsx';
import Login from './Login.tsx';
import Home from './pages/Home.tsx';
import Faculties from './pages/Faculties.tsx';
import Subjects from './pages/Subjects.tsx';
import Timetable from './pages/Timetable.tsx';
import Print from './pages/Print.tsx';

createRoot(document.getElementById('root')!).render(
  <AppDataProvider>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/auth'>
            <Route path='login' Component={Login} />
          </Route>
          <Route path='/' Component={App}  >
            {/* <Route path='/' Component={Home} /> */}
            <Route path='/' Component={Subjects} />
            <Route path='/home' Component={Home} />
            <Route path='/classes' Component={Classes} />
            <Route path='/faculties' Component={Faculties} />
            <Route path='/subjects' Component={Subjects} />
            <Route path='/timetable' Component={Timetable} />
          </Route>
          <Route path='/print' Component={Print} />
        </Routes>
      </BrowserRouter >
    </AuthProvider>
  </AppDataProvider>
)