import { useParams } from "react-router-dom";

function ProductDetails() {
  const { id } = useParams();

  const products = [
    {
  id: 1,
  name: "Tractor",
  rent: "₹1200/day",
  location: "Salem",
  farmer: "Ramesh Kumar",
  phone: "9876543210",
  description: "Powerful tractor suitable for ploughing and transportation.",
  image:
    "https://preview.redd.it/our-2008-model-75-hp-its-an-indian-tractor-company-v0-8km8r6pm4ud51.jpg?auto=webp&s=21768dc166755e3113f4aca129f96c349e34a464",
},

{
  id: 2,
  name: "Rotavator",
  rent: "₹800/day",
  location: "Erode",
  farmer: "Dinesh Kumar",
  phone: "9876543211",
  description: "Rotavator for efficient soil preparation and weed control.",
  image:
    "https://www.tractorpool.com/media/2701/8822701/64692424/1780728677.jpg?width=240&height=180&crop=1",
},

{
  id: 3,
  name: "Harvester",
  rent: "₹5000/day",
  location: "Thanjavur",
  farmer: "Suresh Kumar",
  phone: "9876543212",
  description: "Combine harvester for quick and efficient harvesting.",
  image: "https://s3.amazonaws.com/cdn.toolspot.in/site/2022/12/WhatsApp-Image-2022-12-14-at-7.56.32-PM-1.jpeg",
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
            {product.rent}
          </p>

          <p className="text-lg mb-2">
            📍 <strong>Location:</strong> {product.location}
          </p>

          <p className="text-lg mb-2">
            👨‍🌾 <strong>Farmer:</strong> {product.farmer}
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