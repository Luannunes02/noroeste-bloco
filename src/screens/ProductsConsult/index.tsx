import { StyleSheet, Text, View, ScrollView } from 'react-native';
import React from 'react';

import Api from "../../api/products.json";

import CardProductsConsult from '../../components/CardProductsConsult';

const produtos = Api.Products;

const ProductsConsult = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>PRODUTOS</Text>
      <ScrollView>
        {produtos.map((produto: any) => {
          return (
            <CardProductsConsult
              key={produto.id}
              capa={produto.capa}
              name={produto.name}
              embalagens_tamanho={produto.embalagens_tamanho}
              description={`${produto.descricao.slice(0, 70)}...`}
              id={produto.id}
            />
          )
        })}
      </ScrollView>
    </View>
  )
}

export default ProductsConsult;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    backgroundColor: "#212121",
    flex: 1
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff813',
    marginVertical: 15,
  }
})