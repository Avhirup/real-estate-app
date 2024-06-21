import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Explore from './pages/Explore';
import Category from './pages/Category';
import Offers from './pages/Offers';
import Profile from './pages/Profile';
import PrivateRoute from './components/PrivateRoute';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import ForgotPassword from './pages/ForgotPassword';
import CreateListing from './pages/CreateListing';
import EditListing from './pages/EditListing';
import Post from './pages/Post';
import Contact from './pages/Contact';
import Navbar from './components/Navbar';
import './App.css';

//*****************************TESTING PURPOSE******************************* */
import { NavProvider } from './context/NavContex';
import FooterNav from './components/navbars/FooterNav';
import UpperNav from './components/UpperNav';
import Footer from './components/Footer';

function App() {
  return (
    <>
      {/* <NavProvider> */}
      <Router>
        <UpperNav />
        <Routes>
          <Route path="/" element={<Explore />} />
          <Route path="/category/:categoryName" element={<Category />} />
          <Route path="/offers" element={<Offers />} />
          <Route path="/profile" element={<PrivateRoute />}>
            <Route path="/profile" element={<Profile />} />
          </Route>
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/create-listing" element={<CreateListing />} />
          <Route path="/edit-listing/:listingId" element={<EditListing />} />
          <Route path="/category/:categoryName/:listingId" element={<Post />} />
          <Route path="/contact/:landlordId" element={<Contact />} />
        </Routes>
        {/* <FooterNav /> */}
      </Router>
      <ToastContainer
        position="top-right"
        autoClose={3500}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition:Bounce
      />
      <Footer />
      {/* </NavProvider> */}
    </>
  );
}

export default App;
