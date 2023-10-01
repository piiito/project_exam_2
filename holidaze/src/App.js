
import React from 'react';
import { Routes, Route, Link, Outlet } from 'react-router-dom';
import { HomePage } from './components/pages/homepage';
import { VenuePage } from './components/pages/venuepage';
import { LoginPage } from './components/pages/loginpage';
import { RegisterPage } from './components/pages/registerpage';
import { UpdateAvatarPage } from './components/pages/updateavatarpage';
import { ViewBookingsPage } from './components/pages/viewbookingspage';
import { CreateVenuePage } from './components/pages/createvenuepage';
import { UpdateVenuePage } from './components/pages/updatevenuepage';
import { ManageVenuesPage } from './components/pages/managevenuespage';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";

function Home(){
  return <HomePage />;
}

function Venue(){
  return <VenuePage />;
}

function Login(){
  return <LoginPage />;
}

function Register(){
  return <RegisterPage />;
}

function UpdateAvatar(){
  return <UpdateAvatarPage />;
}

function ViewBookings(){
  return <ViewBookingsPage />;
}

function CreateVenue(){
  return <CreateVenuePage />;
}

function UpdateVenue(){
  return <UpdateVenuePage />
}

function ManageVenues(){
  return <ManageVenuesPage />
}




function Header(){
  return (
    <header className='pb-5 bg-color-primary'>
      <Nav />
    </header>
  )
}

function Footer(){
  return (
  <footer className="text-center mt-4">
  <div className=''>
    <h5 className=" mb-0">Birgitte Vedaa©</h5>
  </div>
</footer>

  )
}

function Nav(){
  const token = localStorage.getItem('Token');
  const manager = localStorage.getItem('Manager');

  function handleLogout(){
    localStorage.clear();
    alert('You are now logged out');
    window.location.reload('/');
    
  }

  return (
  <div>
    <nav className='navbar navbar-expand-lg'>
      <div className="container-fluid">
      <Link className='navbar-brand' to="/">Holidaze</Link>
      <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div className='collapse navbar-collapse' id='navbarNav'>
        <ul className='navbar-nav'>
          <li className='nav-item'>
          {manager === 'true' ? (
          <Link className='nav-link' to="/managevenues">Manage Venues </Link>
          ) : ( '' )}
          </li>
          <li className='nav-item'>
          {manager === 'false' ? (
          <Link className='nav-link' to="/bookings">Bookings </Link>
          ) : ( '' )}
          </li>
          <li className='nav-item'>
          {!token ? (
          <Link className='nav-link' to="/login">Log in </Link>
          ) : ( '' )}
          </li>
          {token ? (
          <li className='nav-item'>
          <Link className='nav-link' to="/updateavatar">Profile</Link>
          </li>
          ) : ( '' )} 
          <li className='nav-item'>
          {token ?(
          <Link className='nav-link' onClick={() => handleLogout()}>Log out</Link>
          ):( '' )}
          </li>
        </ul>
      </div>
      </div>
    </nav>
    </div>
  )
}

function Layout(){
  return(
    <div>
      <Header />
      <Outlet />
      <Footer />
    </div>
  )
}

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element ={<Layout />}>
          <Route index element={<Home />} />
          <Route path="venue/:id" element={<Venue />} />
          <Route path="bookings" element={<ViewBookings />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="updateavatar" element={<UpdateAvatar />} />
          <Route path="createvenue" element={<CreateVenue />} />
          <Route path="updatevenue/:id" element={<UpdateVenue />} />
          <Route path="managevenues" element={<ManageVenues />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
