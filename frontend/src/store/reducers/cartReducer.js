import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  items: localStorage.getItem("cartItems") ? JSON.parse(localStorage.getItem("cartItems")) : [],
  loading: false,
  error: "",
};

export const addToCart = createAsyncThunk("Add/Cart", async ({ productId, quantity }, { getState }) => {
  try {
    console.log(productId);
    const response = await axios.get(`http://localhost:3000/api/v1/product/${productId}`);
    const product = response.data.product;

    const state = getState().Cart;

    const isItemExist = state.items.find((item) => item._id === product._id);

    if (isItemExist) {
      // Product already exists in cart
      const updatedItems = state.items.map((item) =>
        item._id === product._id ? { ...item, quantity: item.quantity + quantity } : item
      );
      window.localStorage.setItem("cartItems", JSON.stringify(updatedItems));
      return updatedItems;
    } else {
      // Product does not exist in cart
      const newItems = [...state.items, { ...product, quantity, Date: Date.now() }];
      window.localStorage.setItem("cartItems", JSON.stringify(newItems));
      return newItems;
    }
  } catch (error) {
    console.log(error);
  }
});

export const removeFromCart = createAsyncThunk("Remove/Cart", async (productId, { getState }) => {
  try {
    const state = getState().Cart;

    const updatedItems = state.items.filter((item) => item._id !== productId);
    window.localStorage.setItem("cartItems", JSON.stringify(updatedItems));
    return updatedItems;
  } catch (error) {
    console.log(error);
  }
});

const cartSlice = createSlice({
  name: "Cart",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(addToCart.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(addToCart.fulfilled, (state, { payload }) => {
      state.items = payload;
      state.loading = false;
      state.error = "";
    });
    builder.addCase(addToCart.rejected, (state, { error }) => {
      state.error = error.message;
      state.loading = false;
    });
    builder.addCase(removeFromCart.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(removeFromCart.fulfilled, (state, { payload }) => {
      state.items = payload;
      state.loading = false;
      state.error = "";
    });
    builder.addCase(removeFromCart.rejected, (state, { error }) => {
      state.error = error.message;
      state.loading = false;
    });
  },
});

export default cartSlice.reducer;
