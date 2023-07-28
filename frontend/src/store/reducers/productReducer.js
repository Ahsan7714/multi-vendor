import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  loading: true,
  totalProducts: [],
  error: "",

};
export const getAllProducts = createAsyncThunk(
  "all/Products",
  async ({ keyword = "",page}) => {
    try {
      
      const response = await axios.get(`http://localhost:3000/api/v1/products?keyword=${keyword}&page=${page}`);
      return response.data

    } catch (error) {
      console.log(error);
    }
  }
);
export const searchProduct = createAsyncThunk(
  "search/Products",
  async ({ keyword = ""}) => {
    try {
      
      const response = await axios.get(`http://localhost:3000/api/v1/products?keyword=${keyword}`);
      return response.data.products

      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);

const getAllProductsReducer = createSlice({
  name: "AllProducts",
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {

    builder.addCase(getAllProducts.pending, (state) => {
      state.loading = true;
      state.error = "";
    });
    builder.addCase(getAllProducts.fulfilled, (state, action) => {
      state.loading = false;
      state.totalProducts=action.payload
      state.error = "";
    });
    builder.addCase(getAllProducts.rejected, (state, action) => {
      state.loading = false;

      state.error = action.payload;
    });

    // search product
    builder.addCase(searchProduct.pending, (state) => {
      state.loading = true;
      state.error = "";
    });
    builder.addCase(searchProduct.fulfilled, (state, action) => {
      state.loading = false;
      state.totalProducts=action.payload
      state.error = "";
    });
    builder.addCase(searchProduct.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
},
});



export default getAllProductsReducer.reducer;
