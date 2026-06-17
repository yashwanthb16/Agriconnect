import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-white shadow-md border-b border-gray-200">
      <Link to="/" className="text-2xl font-bold text-green-700">
        AgriConnect
      </Link>

      <ul className="flex gap-6 list-none">
        <li className="text-gray-700 hover:text-green-600 cursor-pointer font-medium">
          <Link to="/">Home</Link>
        </li>
        <li className="text-gray-700 hover:text-green-600 cursor-pointer font-medium">
          <Link to="/marketplace">Marketplace</Link>
        </li>
        <li className="text-gray-700 hover:text-green-600 cursor-pointer font-medium">
          <Link to="/services">Services</Link>
        </li>
        <li className="text-gray-700 hover:text-green-600 cursor-pointer font-medium">
          <Link to="/schemes">Schemes</Link>
        </li>
        <li className="text-gray-700 hover:text-green-600 cursor-pointer font-medium">
          <Link to="/transport-dashboard">Transport Dashboard</Link>
        </li>
      </ul>

      <div className="flex items-center gap-3">
        <Link to="/login">
          <button className="px-5 py-2 bg-white text-green-600 border-2 border-green-600 rounded-lg font-medium hover:bg-green-50 transition-colors">
            Login
          </button>
        </Link>
        <Link to="/register">
          <button className="px-5 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors shadow-md hover:shadow-lg">
            Register
          </button>
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;