import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Explore from './pages/Explore';
import Offers from './pages/Offers';
import Profile from './pages/Profile';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import ForgotPassword from './pages/ForgotPassword';
import Navbar from './components/Navbar';
import './App.css';

//*****************************TESTING PURPOSE******************************* */
import { NavProvider } from './context/NavContex';
import FooterNav from './components/navbars/FooterNav';

function App() {
  return (
    <>
      <NavProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Explore />} />
            <Route path="/offers" element={<Offers />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
          </Routes>
          <FooterNav />
        </Router>
        <ToastContainer />
      </NavProvider>
    </>
  );
}

export default App;
