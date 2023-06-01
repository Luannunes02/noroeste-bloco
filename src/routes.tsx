import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Feather } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';

import Home from './screens/Home';
import MakeOrder from './screens/MakeOrder';
import ProductsConsult from './screens/ProductsConsult';
import Details from './screens/Details';
import VisualizarPedido from './screens/VisualizarPedido';
import ChangeOrder from './screens/ChangeOrder';
import AllOrders from './screens/AllOrders';

import { Provider } from 'react-redux';
import { store } from './store';

const Stack = createStackNavigator();

function Routes() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name='Home'
            component={Home}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name='Tirar pedido'
            component={MakeOrder}
          />

          <Stack.Screen
            name='Visualizar pedido'
            component={VisualizarPedido}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name='Consultar Produtos'
            component={ProductsConsult}
          />

          <Stack.Screen
            name='Detalhes'
            component={Details}
          />

          <Stack.Screen
            name='Todos os pedidos'
            component={AllOrders}
          />

          <Stack.Screen
            name='Alterar pedido'
            component={ChangeOrder}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  )
}

export default Routes
