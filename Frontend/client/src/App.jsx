import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';

import TransportDashboard from './pages/dash-tport/transdash';

import Register from './pages/Register';

function App() {
  return (
    <Router>
      <Routes>

        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route path="/transport-dashboard" element={<TransportDashboard/>}/>


        <Route path="/register" element={<Register />} />

 d36d978 (Completed register page changes)
      </Routes>
    </Router>
  );
}

export default App;