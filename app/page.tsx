import React from "react";
import Navbar from "./components/common/Navbar";
import CategoryCarousel from "./components/home/CategoryCarousel";
import HomeCarousal from "./components/home/HomeCarousal";
import HomeCards from "./components/home/HomeCards";
import HomeSection3 from "./components/home/HomeSection3";
import HomePartnership from "./components/home/HomePartnership";
import Footer from "./components/common/Footer";
import HeroSection from "./components/common/HeroSection";
import ComponentsSection from "./components/home/ComponentsSection";
import WhyChooseUs from "./components/home/WhyChooseUs";

const Home = () => {
  return (
    <div className="bg-slate-50 bg-white">
      <Navbar />
      <HeroSection/>
      {/* <HomeCarousal /> */}
      <CategoryCarousel />
      {/* <HomeSection3 /> */}
      <ComponentsSection/>
      <HomeCards />
      {/* <HomePartnership /> */}
      <WhyChooseUs/>
      <Footer />
    </div>
  );
};

export default Home;
