import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface LocalizationState {
  todosPedidos: Array<object>;
  pedido: undefined;
}

const initialState: LocalizationState = {
  todosPedidos: [],
  pedido: undefined,
};

const localizationSlice = createSlice({
  name: 'localization',
  initialState,
  reducers: {
    updateTodosPedidos(state: any, action: PayloadAction<object>) {
      state.todosPedidos = [...state.todosPedidos, action.payload];
    },
    updatePedido(state: any, action: PayloadAction<object>) {
      state.pedido = action.payload;
    }
  },
});

export const { updateTodosPedidos, updatePedido } = localizationSlice.actions;
export default localizationSlice.reducer;