import { useParams } from "react-router-dom";

function ProductDetails() {
  const { id } = useParams();

  const products = [
    {
      id: 1,
      name: "Tomato",
      price: "₹25/kg",
      location: "Salem",
      farmer: "Ramesh Kumar",
      phone: "9876543210",
      quantity: "500 Kg Available",
      description:
        "Fresh organic tomatoes harvested directly from the farm.",
      image:
        "https://plus.unsplash.com/premium_photo-1661811820259-2575b82101bf?q=80&w=2080&auto=format&fit=crop",
    },
    {
      id: 2,
      name: "Mango",
      price: "₹80/kg",
      location: "Erode",
      farmer: "Dinesh Kumar",
      phone: "9876543211",
      quantity: "200 Kg Available",
      description:
        "Fresh organic mangoes harvested directly from the farm.",
      image:
        "https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?q=80&w=735&auto=format&fit=crop",
    },
    {
      id: 3,
      name: "Paddy",
      price: "₹35/kg",
      location: "Thanjavur",
      farmer: "Suresh Kumar",
      phone: "9876543212",
      quantity: "800 Kg Available",
      description:
        "Fresh organic paddy harvested directly from the farm.",
      image:
        "https://images.unsplash.com/photo-1599328580087-15c9dab481f3?q=80&w=1170&auto=format&fit=crop",
    },
  ];

  const product = products.find(
    (item) => item.id === Number(id)
  );

  if (!product) {
    return (
      <div className="p-8 text-center text-red-500">
        Product Not Found
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="grid md:grid-cols-2 gap-10">
        
        <div>
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-[450px] object-cover rounded-lg shadow-lg"
          />
        </div>

        <div>
          <h1 className="text-4xl font-bold mb-4">
            {product.name}
          </h1>

          <p className="text-3xl font-semibold text-green-600 mb-4">
            {product.price}
          </p>

          <p className="text-lg mb-2">
            📍 <strong>Location:</strong> {product.location}
          </p>

          <p className="text-lg mb-2">
            👨‍🌾 <strong>Farmer:</strong> {product.farmer}
          </p>

          <p className="text-lg mb-2">
            📦 <strong>Available Quantity:</strong> {product.quantity}
          </p>

          <p className="text-lg mb-6">
            📞 <strong>Contact:</strong> {product.phone}
          </p>

          <div className="bg-gray-100 p-4 rounded-lg mb-6">
            <h2 className="text-xl font-semibold mb-2">
              Product Description
            </h2>

            <p>{product.description}</p>
          </div>

          <div className="flex gap-4">
            <a
              href={`tel:${product.phone}`}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg"
            >
              Call Farmer
            </a>

            <a
              href={`https://wa.me/91${product.phone}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-600 text-white px-6 py-3 rounded-lg"
            >
              WhatsApp Farmer
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}

export default ProductDetails;