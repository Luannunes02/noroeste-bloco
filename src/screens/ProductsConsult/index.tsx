import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity, TextInput } from 'react-native';
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import { FontAwesome } from '@expo/vector-icons';

import CardProductsConsult from '../../components/CardProductsConsult';
import LoadingIndicator from '../../components/LoadingIndicator';
import CardProductsConsultSimple from '../../components/CardProductsConsultSimple';

const ProductsConsult = () => {
  const [productsData, setProductsData] = useState<any>();
  const [loading, setLoading] = useState<boolean>(true);
  const [cardSimples, setCardSimples] = useState<any>();
  const [mostrarValor, setMostrarValor] = useState<any>();
  const [searchText, setSearchText] = useState<string>('');
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);

  useEffect(() => {
    getData('cardSimples');
    getData('mostrarValor');
    fetchData();
  }, []);

  const filterProducts = (text: string) => {
    const filtered = productsData.filter((produto: any) => {
      return (
        produto.nome.toLowerCase().includes(text.toLowerCase()) ||
        produto.descricao.toLowerCase().includes(text.toLowerCase())
      );
    });
    setFilteredProducts(filtered);
  };

  const getData = async (key: string) => {
    switch (key) {
      case 'cardSimples':
        try {
          const value = await AsyncStorage.getItem(key);
          if (value !== null) {
            setCardSimples(value);
          } else {
            Toast.show({
              type: 'info',
              text1: `Nenhum valor encontrado para ${key}`,
              visibilityTime: 2000,
            });
          }
        } catch (error) {
          Toast.show({
            type: 'info',
            text1: `Erro ao obter informação de ${key},` + error,
            visibilityTime: 2000,
          });
        }
        break
      case 'mostrarValor':
        try {
          const value = await AsyncStorage.getItem(key);
          if (value !== null) {
            setMostrarValor(value);
          } else {
            Toast.show({
              type: 'info',
              text1: `Nenhum valor encontrado para ${key}`,
              visibilityTime: 2000,
            });
          }
        } catch (error) {
          Toast.show({
            type: 'info',
            text1: `Erro ao obter informação de ${key},` + error,
            visibilityTime: 2000,
          });
        }
        break
    }
  };

  async function saveData(key: string, value: any) {
    try {
      await AsyncStorage.setItem(key, value);
      Toast.show({
        type: 'success',
        text1: 'Dados salvos com sucesso!',
        visibilityTime: 1000,
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: `Erro ao salvar dados: ` + error,
        visibilityTime: 5000,
      });
    }
  }

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
        setFilteredProducts(jsonData.record.Products);
        setLoading(false);
      } else {
        console.error('Erro ao buscar dados da API:', response.status);
      }
    } catch (error) {
      console.error('Erro ao buscar dados da API:', error);
    }
  };

  function toggleCardType() {
    const newCardType = cardSimples === 'true' ? 'false' : 'true';
    setCardSimples(newCardType);
    saveData('cardSimples', newCardType);
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>PRODUTOS</Text>
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: '#fff813' }]}>
              Tipo de Card:
            </Text>
            <View style={styles.inputWrapper}>
              <Text style={[styles.cardTypeText, { color: '#fff813' }]}>
                {cardSimples === 'true' ? 'Card simples' : 'Card completo'}
              </Text>
              <TouchableOpacity style={styles.cardTypeButton} onPress={toggleCardType} >
                <Image
                  style={{ width: '100%', height: '100%', marginVertical: 'auto' }}
                  source={require('../../assets/icons/trocar.png')}
                  resizeMode='contain'
                />
                <FontAwesome name="exchange" size={18} color="#000" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={styles.searchContainer}>
          <FontAwesome name="search" size={20} color="#fff" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Pesquisar produtos..."
            placeholderTextColor="#fff813"
            onChangeText={(text) => {
              setSearchText(text);
              filterProducts(text);
            }}
            value={searchText}
          />
        </View>
      </View>
      {loading ?
        <View style={styles.loading}>
          <LoadingIndicator />
        </View>
        :
        <ScrollView>
          {filteredProducts.map((produto: any) =>
            cardSimples !== 'true' ? (
              <CardProductsConsult
                key={produto.id}
                capa={produto.capa}
                name={`${produto.nome.slice(0, 50)}`}
                embalagens_tamanho={produto.embalagens_tamanho}
                description={`${produto.descricao.slice(0, 70)}...`}
                id={produto.id}
                valor={mostrarValor === 'true' ? produto.valor : ''}
                marca={produto.marca}
              />
            ) : (
              <CardProductsConsultSimple
                key={produto.id}
                valor={mostrarValor === 'true' ? produto.valor.toFixed(2).replace('.', ',') : ''}
                name={produto.nome}
                embalagens_tamanho={produto.embalagens_tamanho}
                description={`${produto.descricao.slice(0, 100)}...`}
                id={produto.id}
              />
            )
          )}
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
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#212121'
  },
  header: {
    flexDirection: 'column',
    backgroundColor: '#212121', // Cor de fundo do header
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    marginRight: 10,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardTypeText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  cardTypeButton: {
    marginLeft: 10,
    padding: 5,
    height: 35,
    width: 35,
    borderRadius: 20,
    backgroundColor: '#fff813', // Cor de fundo do botão "Trocar"
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#fff813',
    borderBottomWidth: 1,
    borderBottomColor: '#fff813',
  },
})