import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  loading: true,
  totalFeaturedProducts: [],
  error: "",
};
export const getAllFeaturedProducts = createAsyncThunk(
  "all/featured /Products",
  async () => {
    try {
      
      const response = await axios.get(`http://localhost:3000/api/v1/products/featured`);
      return response.data.products

    } catch (error) {
      console.log(error);
    }
  }
);

const getAllFeaturedProductsReducer = createSlice({
  name: "All Featured Products",
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {

    builder.addCase(getAllFeaturedProducts.pending, (state) => {
      state.loading = true;
      state.isUpdated = false;
      state.error = "";
    });
    builder.addCase(getAllFeaturedProducts.fulfilled, (state, action) => {
      state.loading = false;
      state.isUpdated = false;
      state.totalFeaturedProducts=action.payload
      state.error = "";
    });
    builder.addCase(getAllFeaturedProducts.rejected, (state, action) => {
      state.loading = false;
      state.isUpdated = false;
      state.error = action.payload;
    });

  
},
});



export default getAllFeaturedProductsReducer.reducer;
