import { Button, Slider, Typography } from '@mui/material';
import React, { useState } from 'react'
import { useParams } from 'react-router-dom';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
// Catagories
const  categoriesData = ["Electronics", "Clothing", "Home & Kitchen", "Beauty & Personal Care", "Sports & Outdoors", "Books", "Toys & Games", "Automotive", "Health & Wellness", "Baby & Kids"]

const FilterSection = () => {
    const params=useParams()
    const [price, setPrice] = useState([0, 25000]);
    const [catagory, setCatagory] = useState("");
    const [ratings, setRatings] = useState(0);
    const [tagsData,setTagsData]=useState({
        offer:false,
        featured:false,
        freeDelivery:false,
        topSeller:false,
    })
    const keyword = params.keyword;
    const priceHandler = (event, newPrice) => {
        setPrice(newPrice);
      };
      const handleChangeCatagory = (event) => {
        setCatagory(event.target.value);
      };
      const handelTagChange=(e)=>{
        setTagsData({
            ...tagsData,
            [e.target.name]:e.target.checked
        })
      }
      
  return (
    <div className='flex flex-col gap-2 pt-3'> 
        <Typography>Price</Typography>
    <Slider
      value={price}
      onChange={priceHandler}
      valueLabelDisplay="auto"
      aria-labelledby="range-slider"
      min={0}
      max={25000}
    />

    <Typography>Categories</Typography>
    <FormControl sx={{ m: 1, minWidth: 80 }}>
        <InputLabel id="demo-simple-select-autowidth-label">Age</InputLabel>
        <Select
          labelId="demo-simple-select-autowidth-label"
          id="demo-simple-select-autowidth"
          value={catagory}
          onChange={handleChangeCatagory}
          autoWidth
          label="Age"
        >
          <MenuItem value="">
            <em>No Catagory</em>
          </MenuItem>
        {
            categoriesData.map(single_catagory=>(
                <MenuItem value={single_catagory.toLocaleLowerCase()}>
                    <em>{single_catagory}</em>
                </MenuItem>
            ))
        }
        </Select>
      </FormControl>

    <fieldset>
      <Typography component="legend">Ratings Above</Typography>
      <Slider
        value={ratings}
        onChange={(e, newRating) => {
          setRatings(newRating);
        }}
        aria-labelledby="continuous-slider"
        valueLabelDisplay="auto"
        min={0}
        max={5}
      />
    </fieldset>
    <Typography >Tags</Typography>
    <label className='filter_label' htmlFor="offers">Offer 
    <input type="checkbox" id='offers'  name='offer' onChange={(e)=>handelTagChange(e)}  />
    </label>
    <label className='filter_label' htmlFor="featured">Featured 
    <input type="checkbox" id='featured' name='featured' onChange={(e)=>handelTagChange(e)} />
    </label>
    <label className='filter_label' htmlFor="freeDelivery">Free delivery 
    <input type="checkbox" id='freeDelivery' name='freeDelivery' onChange={(e)=>handelTagChange(e)} />
    </label>
    <label className='filter_label' htmlFor="topSeller">Top Seller 
    <input type="checkbox" id='topSeller'  name='topSeller' onChange={(e)=>handelTagChange(e)}/>
    </label>

    <Button variant="contained" style={{marginTop:"20px"}} >Apply </Button>
    </div>

  )
}

export default FilterSection