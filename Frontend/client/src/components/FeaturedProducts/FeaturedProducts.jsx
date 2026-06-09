// src/components/FeaturedProducts/FeaturedProducts.jsx

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
          <div
            key={product.id}
            className="bg-white rounded-xl shadow-lg overflow-hidden"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-56 object-cover"
            />

            <div className="p-4">
              <h3 className="text-xl font-semibold">{product.name}</h3>
              <p className="text-green-600 font-medium">{product.price}</p>
              <p className="text-gray-500">{product.location}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default FeaturedProducts;