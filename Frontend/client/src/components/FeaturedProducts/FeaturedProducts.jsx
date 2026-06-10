// src/components/FeaturedProducts/FeaturedProducts.jsx

import { Link } from "react-router-dom";

function FeaturedProducts() {
  const products = [
    {
      id: 1,
      name: "Tomato",
      price: "₹25/kg",
      location: "Salem",
      image:
        "https://plus.unsplash.com/premium_photo-1661811820259-2575b82101bf?q=80&w=2080&auto=format&fit=crop"
    },
    {
      id: 2,
      name: "Mango",
      price: "₹80/kg",
      location: "Erode",
      image:
        "https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?q=80&w=735&auto=format&fit=crop"
    },
    {
      id: 3,
      name: "Paddy",
      price: "₹35/kg",
      location: "Thanjavur",
      image:
        "https://images.unsplash.com/photo-1599328580087-15c9dab481f3?q=80&w=1170&auto=format&fit=crop"
    }
  ];

  return (
    <section className="py-10 px-6">
      <h2 className="text-3xl font-bold mb-6">Featured Products</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="border rounded-lg p-4 shadow">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-48 object-cover rounded"
            />

            <h3 className="text-xl font-bold mt-2">{product.name}</h3>
            <p>{product.price}</p>
            <p>{product.location}</p>

            <div className="flex gap-2 mt-4">
              <Link
                to={`/product/${product.id}`}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                View Details
              </Link>

              
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default FeaturedProducts;