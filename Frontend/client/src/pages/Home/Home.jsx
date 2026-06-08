import Navbar from "../../components/Navbar/Navbar";
import Hero from "../../components/Hero/Hero";
import StatCard from "../../components/StatCard/StatCard";

function Home() {
  return (
    <main className="home-page">
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
      </div>

      <Footer />    
    </main>
  );
}

export default Home;