import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ProductCard from '../Components/ProductCard';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import { Carousel, Typography, Button } from "@material-tailwind/react";
import { catagoriesData } from '../Data/data';
import { carasouleData } from '../Data/data';
import Catagory from '../Components/Catagory';
import CarasouleComponent from '../Components/CarasouleComponent';
import { getAllProducts } from '../store/reducers/productReducer';
import { getAllFeaturedProducts } from '../store/reducers/featuredReducer';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const { totalFeaturedProducts, loading } = useSelector((state) => state.FeaturedProducts);

  useEffect(() => {
    dispatch(getAllFeaturedProducts());
  }, []);

  useEffect(() => {
    setFeaturedProducts(totalFeaturedProducts);
  }, [totalFeaturedProducts]);

  return (
    <div>
      <Carousel autoplay className='-z-0 carasoule'>
        {carasouleData.map((cara, index) => (
          <CarasouleComponent cara={cara} key={index} />
        ))}
      </Carousel>

      <div className="catagries my-10 mx-auto" style={{ width: "98%" }}>
        <Typography className="text-3xl tracking-wide pl-10">Catagories</Typography>

        <div className="catagories_group flex gap-10 overflow-hidden overflow-x-scroll no-scrollbar px-12 items-center my-11">
          {catagoriesData.map((cata, index) => (
            <Catagory cata={cata} key={index} />
          ))}
        </div>
      </div>

      {/* Featured Products */}
      <div className="my-40 featured_container bg-gray-100 ">
        <div className="mx-auto py-44" style={{ width: "98%" }}>
          <Typography className="text-3xl tracking-wide pl-10">Featured Products</Typography>

          {loading ? (
            <div className="flex justify-center items-center py-10">
              <SentimentVeryDissatisfiedIcon className="mr-2" />
              <Typography className="text-lg">Loading...</Typography>
            </div>
          ) : (
            <div className="flex gap-10 overflow-hidden px-12 items-center my-11 flex-wrap">
              {featuredProducts && featuredProducts.length > 0 ? (
                featuredProducts.map(single_product => (
                  <ProductCard product={single_product} key={single_product.id} />
                ))
              ) : (
                <div className="flex justify-center items-center py-10">
                  <SentimentVeryDissatisfiedIcon className="mr-2" />
                  <Typography className="text-lg">No featured products available.</Typography>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
