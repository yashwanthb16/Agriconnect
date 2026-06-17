import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Schemes from "./pages/Schemes/Schemes";
import TransportDashboard from './pages/dash-tport/transdash';
import TransportBooking from './pages/dash-tport/transportbooking';
import Marketplace from "./pages/Marketplace/Marketplace";
import ProductDetails from "./pages/ProductDetails/ProductDetails";
import AddRental from "./pages/AddRental/AddRental";
import SchemeDetails from "./pages/SchemeDetails/SchemeDetails";


import Register from './pages/Register';

function App() {
  return (
    <Router>
      <Routes>

        <Route path="/" element={<Home />} />
        <Route path="/marketplace" element={<Marketplace />} />

        <Route path="/schemes" element={<Schemes />} />

        <Route path="/login" element={<Login />} />

        <Route path="/transport-dashboard" element={<TransportDashboard/>}/>
        <Route path="/book-transport" element={<TransportBooking/>}/>
        <Route path="/add-rental" element={<AddRental />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/schemes/:id" element={<SchemeDetails />} />

        <Route path="/register" element={<Register />} />

 
      </Routes>
    </Router>
  );
}

export default App;