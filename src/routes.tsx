import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Toast from 'react-native-toast-message';
import { Feather } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';

import Home from './screens/Home';
import MakeOrder from './screens/MakeOrder';
import ProductsConsult from './screens/ProductsConsult';
import Details from './screens/Details';
import VisualizarPedido from './screens/VisualizarPedido';
import AllOrders from './screens/AllOrders';
import Configuration from './screens/Configurations';

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
            initialParams={{ pedidoId: 0 }}
          />

          <Stack.Screen
            name='Visualizar pedido'
            component={VisualizarPedido}
            options={{ headerShown: true }}
          />

          <Stack.Screen
            name='Consultar Produtos'
            component={ProductsConsult}
          />

          <Stack.Screen
            name='Configuração'
            component={Configuration}
          />

          <Stack.Screen
            name='Detalhes'
            component={Details}
          />

          <Stack.Screen
            name='Todos os pedidos'
            component={AllOrders}
          />
        </Stack.Navigator>
        <Toast />
      </NavigationContainer>
    </Provider>
  )
}

export default Routes
