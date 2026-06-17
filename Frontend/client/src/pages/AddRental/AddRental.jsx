function AddRental() {
  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-2xl p-8">

        <h1 className="text-4xl font-bold text-center text-green-700 mb-2">
          🚜 List Your Equipment
        </h1>

        <p className="text-center text-gray-500 mb-8">
          Add your agricultural equipment and earn money by renting it to other farmers.
        </p>

        <form className="space-y-6">

          {/* Equipment Name */}
          <div>
            <label className="block font-medium mb-2">
              Equipment Name
            </label>

            <input
              type="text"
              placeholder="e.g. Tractor, Rotavator"
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block font-medium mb-2">
              Category
            </label>

            <select className="w-full border border-gray-300 rounded-lg p-3">
              <option>Select Category</option>
              <option>Tractor</option>
              <option>Rotavator</option>
              <option>Harvester</option>
              <option>Seeder</option>
              <option>Sprayer</option>
              <option>Others</option>
            </select>
          </div>

          {/* Rent and Location */}
          <div className="grid md:grid-cols-2 gap-4">

            <div>
              <label className="block font-medium mb-2">
                Rent Per Day
              </label>

              <input
                type="number"
                placeholder="₹ 1200"
                className="w-full border border-gray-300 rounded-lg p-3"
              />
            </div>

            <div>
              <label className="block font-medium mb-2">
                Location
              </label>

              <input
                type="text"
                placeholder="Salem"
                className="w-full border border-gray-300 rounded-lg p-3"
              />
            </div>

          </div>
            <div>
  <label className="block font-medium mb-2">
    Owner Name
  </label>

  <input
    type="text"
    placeholder="Ramesh Kumar"
    className="w-full border border-gray-300 rounded-lg p-3"
  />
</div>

          {/* Contact */}
          <div>
            <label className="block font-medium mb-2">
              Contact Number
            </label>

            <input
              type="tel"
              placeholder="9876543210"
              className="w-full border border-gray-300 rounded-lg p-3"
            />
          </div>

          {/* Upload Image */}
          <div>
            <label className="block font-medium mb-2">
              Equipment Image
            </label>

            <div className="border-2 border-dashed border-green-400 rounded-xl p-8 text-center">
              <p className="text-gray-500">
                📸 Upload Equipment Photo
              </p>

              <input
                type="file"
                className="mt-3"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block font-medium mb-2">
              Description
            </label>

            <textarea
              rows="4"
              placeholder="Describe your equipment..."
              className="w-full border border-gray-300 rounded-lg p-3"
            />
          </div>

          {/* Availability */}
          <div>
            <label className="block font-medium mb-2">
              Availability
            </label>

            <select className="w-full border border-gray-300 rounded-lg p-3">
              <option>Available</option>
              <option>Currently Rented</option>
            </select>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl text-lg font-semibold transition"
          >
            🚜 List Equipment
          </button>

        </form>
      </div>
    </div>
  );
}

export default AddRental;