import { combineReducers, configureStore } from '@reduxjs/toolkit';
import productReducer from './reducers/productReducer';
import cartReducer from './reducers/cartReducer';
import savedProductReducer from './reducers/savedProductReducer';
import featuredReducer from './reducers/featuredReducer';
const rootReducer = combineReducers({
  Products: productReducer,
  Cart:cartReducer,
  Saved:savedProductReducer,
  FeaturedProducts:featuredReducer,
});

 const store = configureStore({
  reducer: rootReducer
});

export default store
