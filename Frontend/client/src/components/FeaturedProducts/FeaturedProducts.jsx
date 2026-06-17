// src/components/FeaturedProducts/FeaturedProducts.jsx

import { Link } from "react-router-dom";
import tractorImg from "../../assets/img/tractor.jpg";
function FeaturedProducts() {
  const rentals = [
  {
    id: 1,
    name: "Tractor",
    rent: "₹1200/day",
    location: "Salem",
    owner: "Ramesh",
    image: "https://preview.redd.it/our-2008-model-75-hp-its-an-indian-tractor-company-v0-8km8r6pm4ud51.jpg?auto=webp&s=21768dc166755e3113f4aca129f96c349e34a464"
  },
  {
    id: 2,
    name: "Rotavator",
    rent: "₹800/day",
    location: "Erode",
    owner: "Suresh",
    image: "https://www.tractorpool.com/media/2701/8822701/64692424/1780728677.jpg?width=240&height=180&crop=1"
  },
  {
    id: 3,
    name: "Harvester",
    rent: "₹5000/day",
    location: "Thanjavur",
    owner: "Kumar",
    image: "https://s3.amazonaws.com/cdn.toolspot.in/site/2022/12/WhatsApp-Image-2022-12-14-at-7.56.32-PM-1.jpeg"
  }
];

  return (
    <section className="py-10 px-6">
      <h2 className="text-3xl font-bold mb-6">
        Featured Rental Equipment
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rentals.map((rental) => (
          <div key={rental.id} className="border rounded-lg p-4 shadow">
            <img
              src={rental.image}
              alt={rental.name}
              className="w-full h-48 object-cover rounded"
            />

            <h3 className="text-xl font-bold mt-2">{rental.name}</h3>
            <p>{rental.rent}</p>
            <p>{rental.location}</p>

            <div className="flex gap-2 mt-4">
              <Link
                to={`/product/${rental.id}`}
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