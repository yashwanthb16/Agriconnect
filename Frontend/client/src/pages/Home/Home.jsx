import Navbar from "../../components/Navbar/Navbar";
import Hero from "../../components/Hero/Hero";
import StatCard from "../../components/StatCard/StatCard";

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
      </div>
    </>
  );
}

export default Home;