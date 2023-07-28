import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LocalMallIcon from '@mui/icons-material/LocalMall';
import Rating from '@mui/material/Rating';
import FavoriteIcon from '@mui/icons-material/Favorite';
import EmailIcon from '@mui/icons-material/Email';

import { addToCart, removeFromCart } from '../store/reducers/cartReducer';
import { addToSavedProducts, removeFromSavedProducts } from '../store/reducers/savedProductReducer';

const ProductCard = ({ product }) => {
  const date = new Date(product.createdAt);
  const formattedDate = date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.Cart.items);
  const isProductInCart = cartItems.find((item) => item._id === product._id);
  const savedItems = useSelector((state) => state.Saved.items);
  const isProductInSaved = savedItems.find((item) => item._id === product._id);


  const toggleCartHandler = (productId) => {
    if (isProductInCart) {
      dispatch(removeFromCart(productId));
    } else {
      dispatch(addToCart({ productId, quantity:1 }));
    }
  };
  
  const savedProductsHandler=(productId)=>{
    if (isProductInSaved) {
      dispatch(removeFromSavedProducts(productId));
    } else {
      dispatch(addToSavedProducts({ productId,quantity:1 }));
    }
  }


  return (
    <div className='mx-auto  relative'>
      <Card sx={{ width: 300, height: '460px', padding: '0 05px' }} className='shadow-2xl'>
        <CardHeader title={product.productName} subheader={formattedDate} />
        <div className='overflow-hidden'>
          <CardMedia
            component='img'
            height='194'
            image={product?.images[0]?.url}
            alt={product?.images[0]?.url}
            className='transition-transform h-44 duration-300 w-full  object-cover hover:scale-150'
          />
        </div>
        <div className='ml-3 my-3 flex gap-3 flex-col'>
          <span className='price text-xl font-bold font-sans'>${product.price}</span>
          <span className='rating flex gap-3'>
            <Typography component='legend'>Ratings</Typography>
            <Rating name='read-only' value={product.totalRating} precision={0.5} readOnly />
          </span>
          <p className='text-gray-500'>
            Stock{' '} 
            <span className='font-bold' style={product.stock <= 0 ? { color: 'red' } : { color: 'green' }}>
              ({product.stock})
            </span>
          </p>
        </div>

        <CardActions className='flex gap-4 mx-auto  ' style={{ width: '90%' }}>
          <IconButton onClick={() => savedProductsHandler(product._id)}
            
            >
            <FavoriteIcon  sx={isProductInSaved?{color:"red"}:{color:"unset"}} />
          </IconButton>
          <IconButton
            aria-label='add to favorites'
            onClick={() => toggleCartHandler(product._id)}
            sx={isProductInCart?{color:"blue"}:{color:"unset"}}
          >
            <ShoppingCartIcon />
          </IconButton>
          <IconButton aria-label='share'>
            <LocalMallIcon  className='text-orange-900'/>
          </IconButton>
<IconButton>
<EmailIcon className='cursor-pointer text-teal-800 ' fontSize='medium'  />
</IconButton>
        </CardActions>
      </Card>
      {
        product.isFeatured && <span  className='featured_tag text-center absolute top-10 right-0 px-3 py-1 bg-blue-900  text-white font-bold' style={{fontSize:"10px",width:"90px",borderTopleftRadius:"50%"}} >Featured </span>
      }

{
        product.deliveryCharges==0 && <span  className='featured_tag text-center absolute top-3 right-0 px-3 py-1 bg-deep-orange-700    text-white font-bold' style={{fontSize:"10px",width:"90px",borderTopleftRadius:"9px"}} >Free Delivery </span>
      }

    </div>
  );
};

export default ProductCard;
