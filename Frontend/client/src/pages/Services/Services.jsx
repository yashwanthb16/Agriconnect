import { Link } from 'react-router-dom';
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";

function Services() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-10 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-green-700">Our Services</p>
            <h1 className="mt-4 text-4xl md:text-5xl font-bold text-gray-900">
              Agriculture Services Built For Transport Operators
            </h1>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
              Explore our service offerings and get your transport registered quickly. Click the card below to start your transport registration process.
            </p>
            <Link to="/" className="inline-flex mt-6 items-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-green-700 shadow-md hover:bg-gray-100 transition">
              Back to Home
            </Link>
          </div>

          <section className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] items-start">
            <div className="space-y-6">
              <div className="rounded-3xl border border-green-100 bg-white p-8 shadow-sm">
                <h2 className="text-2xl font-bold text-gray-900">Transport & Service Registration</h2>
                <p className="mt-4 text-gray-600 leading-7">
                  Our transport service page centralizes the truck and vehicle registration flow so you can book, register, and manage transport from one dashboard.
                </p>
                <ul className="mt-6 space-y-3 text-gray-600">
                  <li>• Seamless transport registration workflow</li>
                  <li>• Document upload and verification</li>
                  <li>• Direct access to the transport dashboard</li>
                </ul>
              </div>

              <div className="rounded-3xl border border-green-100 bg-white p-8 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900">How It Works</h3>
                <ol className="mt-4 space-y-3 text-gray-600 list-decimal list-inside">
                  <li>Click the transport registration bar below.</li>
                  <li>Go to the transport dashboard page.</li>
                  <li>Complete your transport registration and manage requests.</li>
                </ol>
              </div>
            </div>

            <div className="rounded-3xl border border-green-100 bg-white p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Register Your Transport</h2>
              <p className="text-gray-600">
                The transport registration experience is now available directly on the home page for faster access.
              </p>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}

export default Services;
