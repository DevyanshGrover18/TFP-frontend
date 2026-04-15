import React from 'react';
import Navbar from './components/common/Navbar'
import CategoryCarousel from './components/home/CategoryCarousel';
import HomeCarousal from './components/home/HomeCarousal';
import HomeCards from './components/home/HomeCards';
import HomeSection3 from './components/home/HomeSection3';

const Home = () => {
  return (
    <div className='bg-slate-50 flex flex-col'>
        <Navbar/>
        <HomeCarousal/>
        <CategoryCarousel/>
        <HomeSection3/>
        <HomeCards/>
    </div>
  );
}

export default Home;
