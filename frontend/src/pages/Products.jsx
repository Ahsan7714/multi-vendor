import React, { useEffect, useState } from 'react';
import FilterSection from '../Components/FilterSection';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useDispatch, useSelector } from 'react-redux';
import { getAllProducts } from '../store/reducers/productReducer';
import ProductCard from '../Components/ProductCard';

const Products = () => {
  const dispatch = useDispatch();
  const { products, productsCount, resultPerPage } = useSelector(state => state.Products.totalProducts);
  const { loading } = useSelector(state => state.Products);

  const [allProducts, setAllProducts] = useState([]);
  const [isInitialMount, setIsInitialMount] = useState(true); // Flag to indicate if it's the initial mount

  const getProductList = () => {
    const pageNo = Math.ceil(allProducts.length / resultPerPage) + 1;
    dispatch(getAllProducts({ keyword: "", page: pageNo }));
  };

  useEffect(() => {
    if (isInitialMount) {
      getProductList();
      setIsInitialMount(false); // Set the flag to false after the initial fetch
    }
  }, [isInitialMount]);

  useEffect(() => {
    if (products) {
      // Remove duplicates by checking for the existence of each product in the allProducts state
      setAllProducts(prevProducts => [...new Map([...prevProducts, ...products].map(item => [item._id, item])).values()]);
    }
  }, [products]);

  const fetchData = () => {
    getProductList();
  };

  return (
    <div className='products_container flex my-4' style={{ position: "relative" }}>
      <div className="filter_section bg-white shadow-2xl px-10" style={{ flex: "1", height: "90vh", position: "fixed", width: "300px", top: "100px" }}>
        <FilterSection />
      </div>
      <div className="product_display flex flex-col  gap-3 justify-center bg-gray-100" style={{ flex: "3", marginLeft: "320px", flexDirection: 'column' }}>
        <InfiniteScroll
          dataLength={allProducts.length}
          next={fetchData}
          hasMore={allProducts.length < productsCount}
        >
          {allProducts && allProducts.length > 0 && allProducts.map((item,i) => (
            <div key={item._id}>

              <ProductCard product={item} />
            </div>
          ))}
        </InfiniteScroll>
        {loading && <div className="spinner" style={{ margin: "0px auto" }}></div>}
      </div>
    </div>
  );
};

export default Products;
