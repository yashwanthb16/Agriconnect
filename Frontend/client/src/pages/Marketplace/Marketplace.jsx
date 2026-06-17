import { Link } from "react-router-dom";
import FeaturedProducts from "../../components/FeaturedProducts/FeaturedProducts";

function Marketplace() {
  return (
    <div className="pt-24 px-6">
      <h1 className="text-4xl font-bold text-center mb-10">
        Marketplace
      </h1>

      <div className="flex flex-col md:flex-row justify-center items-center gap-4 mt-6">
        <input
          type="text"
          placeholder="🔍 Search Equipment..."
          className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-300"
        />

        <Link
          to="/add-rental"
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
        >
          + List Equipment
        </Link>
      </div>

      <FeaturedProducts />
    </div>
  );
}

export default Marketplace;