import './App.css';
import Login from './views/Login';
import {
  BrowserRouter as Router,
  Link,
  Outlet, 
  useRoutes,
  useNavigate
} from "react-router-dom";
import SignUp from './views/SignUp';
import Home from './views/Home';

function App() {
  const routes = useRoutes([
    { 
      path: '/', 
      element: (
        localStorage.getItem('userId')?
        <div className='App'>
          <Home/>
        </div>:
        <div className='App'>
          <Login/>
        </div>
      )
    },
    { 
      path: '/signup', 
      element: (
          <div className='App'>
            <SignUp/>
          </div>
      )
    },
    { 
      path: '/home', 
      element: (
        !localStorage.getItem('userId')?
        <div className='App'>
          <Login/>
        </div>:
        <div className='App'>
          <Home/>
        </div>
      )
    },
    /*{ path: '/polls/:id', element: <Vote/> } */
  ]);

  return routes;
}

export default App;