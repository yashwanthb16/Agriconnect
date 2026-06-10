import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import TransportDashboard from './pages/dash-tport/transdash';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/transport-dashboard" element={<TransportDashboard/>}/>
      </Routes>
    </Router>
  );
}

export default App;