import Navbar from "../../components/Navbar/Navbar";
import Hero from "../../components/Hero/Hero";
import StatCard from "../../components/StatCard/StatCard";
import Footer from "../../components/Footer/Footer";
function Home() {
  return (
    <>
      <Navbar />

      <Hero />
      

      <div className="stats-container">
        <StatCard
          title="Registered Farmers"
          value="12,458+"
        />

        <StatCard
          title="Products Listed"
          value="8,932+"
        />

        <StatCard
          title="Machines Available"
          value="1,245+"
        />

        <StatCard
          title="Transport Requests"
          value="568+"
        />
        <StatCard
          title="Organic Waste Offers"
          value="2,345+"
        />
        <Footer />
      </div>
    </>
  );
}

export default Home;