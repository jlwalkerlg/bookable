import React from 'react';
import HomeHead from '../components/HomeHead';
import HomeBestSellerContainer from '../components/HomeBestSellerContainer';
import HomeNewBooksContainer from '../components/HomeNewBooksContainer';
import HomeFeaturedBooksContainer from '../components/HomeFeaturedBooksContainer';
import HomePenguinBooksContainer from '../components/HomePenguinBooksContainer';
import HomeTrendingCategoryContainer from '../components/HomeTrendingCategoryContainer';

const Home = () => {
  return (
    <>
      <HomeHead />
      <HomeBestSellerContainer />
      <HomeNewBooksContainer />
      <HomeFeaturedBooksContainer />
      <HomePenguinBooksContainer />
      <HomeTrendingCategoryContainer />
    </>
  );
};

export default Home;
