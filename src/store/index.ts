import { createStore } from 'redux';
import { configureStore } from "@reduxjs/toolkit";
import localizationReducer from './slices/localizationSlice';

export const store = createStore(localizationReducer);