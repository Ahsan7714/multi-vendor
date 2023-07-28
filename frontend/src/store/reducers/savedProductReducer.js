import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  items: localStorage.getItem("savedProducts") ? JSON.parse(localStorage.getItem("savedProducts")) : [],
  loading: false,
  error: "",
};

export const addToSavedProducts = createAsyncThunk("Add/Saved", async ({ productId}, { getState }) => {
  try {
    const response = await axios.get(`http://localhost:3000/api/v1/product/${productId}`);
    const product = response.data.product;

    const state = getState().Saved;



      // Product does not exist in cart
      const newItems = [...state.items, { ...product, Date: Date.now() }];
      window.localStorage.setItem("savedProducts", JSON.stringify(newItems));
      return newItems;
    
  } catch (error) {
    console.log(error);
  }
});

export const removeFromSavedProducts = createAsyncThunk("Remove/Saved", async (productId, { getState }) => {
  try {
    const state = getState().Saved;

    const updatedItems = state.items.filter((item) => item._id !== productId);
    window.localStorage.setItem("savedProducts", JSON.stringify(updatedItems));
    return updatedItems;
  } catch (error) {
    console.log(error);
  }
});

const savedProductSlice = createSlice({
  name: "Saved",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(addToSavedProducts.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(addToSavedProducts.fulfilled, (state, { payload }) => {
      state.items = payload;
      state.loading = false;
      state.error = "";
    });
    builder.addCase(addToSavedProducts.rejected, (state, { error }) => {
      state.error = error.message;
      state.loading = false;
    });
    builder.addCase(removeFromSavedProducts.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(removeFromSavedProducts.fulfilled, (state, { payload }) => {
      state.items = payload;
      state.loading = false;
      state.error = "";
    });
    builder.addCase(removeFromSavedProducts.rejected, (state, { error }) => {
      state.error = error.message;
      state.loading = false;
    });
  },
});

export default savedProductSlice.reducer;
