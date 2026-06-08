import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-white shadow-md border-b border-gray-200">
      <Link to="/" className="text-2xl font-bold text-green-700">
        AgriConnect
      </Link>

      <ul className="flex gap-6 list-none">
        <li className="text-gray-700 hover:text-green-600 cursor-pointer font-medium">Home</li>
        <li className="text-gray-700 hover:text-green-600 cursor-pointer font-medium">Marketplace</li>
        <li className="text-gray-700 hover:text-green-600 cursor-pointer font-medium">Services</li>
        <li className="text-gray-700 hover:text-green-600 cursor-pointer font-medium">Schemes</li>
      </ul>

      <Link to="/login">
        <button className="px-5 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors">
          Login
        </button>
      </Link>
    </nav>
  );
}

export default Navbar;