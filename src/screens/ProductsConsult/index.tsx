import { StyleSheet, Text, View, ScrollView, Image } from 'react-native';
import React, { useState, useEffect } from 'react';

import CardProductsConsult from '../../components/CardProductsConsult';
import LoadingIndicator from '../../components/LoadingIndicator';

const ProductsConsult = () => {
  const [productsData, setProductsData] = useState<any>();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchData();
  }, [])

  const fetchData = async () => {
    try {
      // Substitua a URL abaixo pela URL da sua API
      const response = await fetch('https://api.jsonbin.io/v3/b/64bdb5689d312622a3839e04/latest', {
        method: 'GET',
        headers: {
          'X-Master-Key': '$2b$10$fTCsCYniOvsCifPdd6ZhG.5X1tU6f8dUnGi0YHNuIVveLDGZvJIjC',
        },
      });

      if (response.status === 200) {
        const jsonData = await response.json();
        setProductsData(jsonData.record.Products);
        setLoading(false);
      } else {
        console.error('Erro ao buscar dados da API:', response.status);
      }
    } catch (error) {
      console.error('Erro ao buscar dados da API:', error);
    }
  };


  return (
    <View style={styles.container}>
      <Text style={styles.title}>PRODUTOS</Text>
      {loading ?
        <View style={styles.loading}>
          <LoadingIndicator />
        </View>
        :
        <ScrollView>
          {productsData.map((produto: any) => {
            return (
              <CardProductsConsult
                key={produto.id}
                capa={produto.capa}
                name={produto.nome}
                embalagens_tamanho={produto.embalagens_tamanho}
                description={`${produto.descricao.slice(0, 70)}...`}
                id={produto.id}
              />
            )
          })}
        </ScrollView>
      }
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
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#212121'
  }
})