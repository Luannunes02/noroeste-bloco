import { StyleSheet, Text, View, TextInput, ScrollView, TouchableOpacity, Alert } from 'react-native'
import React, { useState, useEffect, useRef } from 'react';
import { Feather } from '@expo/vector-icons';;
import ButtonDefault from '../../components/ButtonDefault';
import RNPickerSelect from 'react-native-picker-select';
import { useNavigation } from '@react-navigation/native';
import * as SQLite from 'expo-sqlite';
import { SQLError } from 'expo-sqlite';

import {
  updateTodosPedidos,
  updatePedido,
} from "../../store/slices/localizationSlice";
import { useSelector, useDispatch } from "react-redux";

const ChangeOrder = () => {
  const [inputClient, setInputClient] = useState('');
  const [inputFantasyName, setInputFantasyName] = useState('');
  const [inputCNPJ, setInputCNPJ] = useState('');
  const [inputCity, setInputCity] = useState('');
  const [inputAdress, setInputAdress] = useState('');
  const [inputDistrict, setInputDistrict] = useState('');
  const [inputContactName, setInputContactName] = useState('');
  const [inputPrazo, setInputPrazo] = useState('');
  const [inputCondiPG, setInputCondiPG] = useState('');
  const [inputProduct, setInputProduct] = useState('');
  const [inputQuantity, setInputQuantity] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [produtos, setProdutos] = useState<any>([]);

  const pedidoSelector = useSelector((state: any) => state.pedido);

  const db = SQLite.openDatabase('pedidos.db');

  const navigation = useNavigation();
  const dispatch = useDispatch();
  //const cepSelector = useSelector((state: any) => state.cep);
  /*
    useEffect(() => {
      // Código para recuperar os dados da tabela "pedidos"
      db.transaction(tx => {
        tx.executeSql(
          'SELECT * FROM pedidos',
          [],
          (_, resultSet) => {
            // Os dados foram recuperados com sucesso
            const { rows } = resultSet;
            const data = rows._array; // Obtém um array dos registros da tabela
  
            // Atualiza o estado Redux com os dados obtidos
            dispatch(updateTodosPedidos(data));
          },
          (_, error) => {
            console.log('Erro ao recuperar os dados da tabela pedidos:', error);
            return true;
          }
        );
  
  
      });
  
      // Restante do código do useEffect
      // ...
    }, []);*/

  const paymentOptions = [
    { label: 'Boleto', value: 'boleto' },
    { label: 'Dinheiro/Pix', value: 'dinheiro_pix' },
    { label: 'Cheque', value: 'cheque' },
  ];

  const pesquisarCnpj = () => {
    fetch(`https://publica.cnpj.ws/cnpj/${inputCNPJ.replace(/\D/g, '')}`)
      .then(response => response.json())
      .then(data => {
        setInputClient(data.razao_social);
        setInputCity(`${data.estabelecimento.cidade.nome} - ${data.estabelecimento.estado.sigla}`);
        setInputDistrict(data.estabelecimento.bairro);
        setInputAdress(`${data.estabelecimento.logradouro} ${data.estabelecimento.numero}`);
        setInputFantasyName(data.estabelecimento.nome_fantasia)
      })
      .catch(error => {
        Alert.alert('Erro', "CNPJ inválido");
        console.log(error)
        return;
      });

  };

  const adicionarProduto = () => {
    const novoProduto = { inputProduct, inputQuantity, inputValue };
    setProdutos([...produtos, novoProduto]);
    setInputProduct('');
    setInputQuantity('');
    setInputValue('');
  };

  function CriarPedido() {
    const novoPedido = {
      inputClient,
      inputFantasyName,
      inputCNPJ,
      inputCity,
      inputDistrict,
      inputContactName,
      inputCondiPG,
      inputPrazo,
      inputAdress,
      produtos,
    };

    dispatch(updatePedido(novoPedido));
  }

  function visualizarPedido() {
    CriarPedido();

    navigation.navigate("Visualizar pedido" as never);
  };

  function salvarPedidoNoSQLite(pedido: any) {
    CriarPedido();
    // Salvar o pedido no banco de dados
    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO pedidos (client, fantasyName, cnpj, city, district, contactName, condiPG, prazo, adress, produtos) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [pedido.inputClient, pedido.inputFantasyName, pedido.inputCNPJ, pedido.inputCity, pedido.inputDistrict, pedido.inputContactName, pedido.inputCondiPG, pedido.inputPrazo, pedido.inputAdress, JSON.stringify(pedido.produtos)],
        (_, resultSet) => {
          const { insertId } = resultSet;

          // Atualizar o estado Redux com o novo pedido
          const novoPedido = { ...pedido, id: insertId };
          dispatch(updateTodosPedidos(novoPedido));
        },
        (_, error) => {
          console.log('Erro ao salvar pedido no SQLite:', error);
          return true; // Retorne true para indicar que ocorreu um erro
        }
      );
    });
  }


  function salvarEVisualizarPedido() {
    CriarPedido();

    setInputClient('');
    setInputFantasyName('');
    setInputCNPJ('');
    setInputCity('');
    setInputDistrict('');
    setInputContactName('');
    setInputCondiPG('');
    setInputPrazo('');
    setInputAdress('');
    setProdutos([]);

    navigation.navigate("Visualizar pedido" as never);
  }



  /* Use isso para quando quiser ver o que tem na tabela do banco de dados do pedido
    const exibirPedidos = () => {
      // Código para executar a consulta SELECT na tabela "pedidos"
      db.transaction(tx => {
        tx.executeSql(
          'SELECT * FROM pedidos',
          [],
          (_, resultSet) => {
            // Os dados foram recuperados com sucesso
            const { rows } = resultSet;
            const data = rows._array; // Obtém um array dos registros da tabela
  
            // Exibe os pedidos no console ou em outro local desejado
            console.log('Pedidos:', data);
          },
          (_, error) => {
            console.log('Erro ao recuperar os pedidos da tabela pedidos:', error);
            return true
          }
        );
      });
    };
  
    // Chamada da função para exibir os pedidos
    exibirPedidos();
  */







  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>+</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => salvarPedidoNoSQLite(pedidoSelector)}>
          <Feather name="save" size={25} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Feather name="trash-2" size={25} color="#000" />
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.scrollView}>
        <View style={styles.inputContainer}>
          <Text style={styles.labelInput}>Razão social:</Text>
          <TextInput
            style={styles.input}
            onChangeText={setInputClient}
            value={inputClient}
          />
        </View>
        <View style={styles.divideInputsContainer}>
          <View style={styles.inputContainerHalf}>
            <Text style={styles.labelInput}>Nome fantasia:</Text>
            <TextInput
              style={styles.input}
              onChangeText={setInputFantasyName}
              value={inputFantasyName}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.labelInput}>CNPJ:</Text>
            <View style={styles.inputCnpjContainer}>
              <TextInput
                style={styles.inputCNPJ}
                onChangeText={setInputCNPJ}
                value={inputCNPJ}
              />
              <TouchableOpacity style={styles.cnpjButton} onPress={pesquisarCnpj}>
                <Feather name="search" size={25} color="#FFF" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.divideInputsContainer}>
          <View style={styles.inputContainerHalf}>
            <Text style={styles.labelInput}>Cidade:</Text>
            <TextInput
              style={styles.input}
              onChangeText={setInputCity}
              value={inputCity}
            />
          </View>
          <View style={styles.inputContainerHalf}>
            <Text style={styles.labelInput}>Bairro:</Text>
            <TextInput
              style={styles.input}
              onChangeText={setInputDistrict}
              value={inputDistrict}
            />
          </View>
        </View>

        <View style={styles.divideInputsContainer}>
          <View style={styles.inputContainerHalf}>
            <Text style={styles.labelInput}>Endereço:</Text>
            <TextInput
              style={styles.input}
              onChangeText={setInputAdress}
              value={inputAdress}
            />
          </View>
          <View style={styles.inputContainerHalf}>
            <Text style={styles.labelInput}>Nome do contato:</Text>
            <TextInput
              style={styles.input}
              onChangeText={setInputContactName}
              value={inputContactName}
            />
          </View>
        </View>
        {/*condição de pagamento*/}
        <View style={styles.divideInputsContainer}>
          <View style={styles.inputContainerHalf}>
            <Text style={styles.labelInput}>Condição de pagamento:</Text>
            <RNPickerSelect
              onValueChange={(value) => setInputCondiPG(value)}
              value={inputCondiPG}
              items={paymentOptions}
              placeholder={{ label: 'Selecione', color: '#000', value: 'Não definido' }}
            />
          </View>
          <View style={styles.inputContainerHalf}>
            <Text style={styles.labelInput}>Prazo:</Text>
            <TextInput
              style={styles.input}
              onChangeText={setInputPrazo}
              value={inputPrazo}
            />
          </View>
        </View>
        {/*Adicionar produto*/}
        <View style={styles.line}></View>
        <View style={styles.inputContainer}>
          <Text style={styles.labelInput}>Produto:</Text>
          <TextInput
            style={styles.input}
            onChangeText={setInputProduct}
            value={inputProduct}
          />
        </View>
        <View style={styles.divideInputsContainer}>
          <View style={styles.inputContainerHalf}>
            <Text style={styles.labelInput}>Quantidade:</Text>
            <TextInput
              style={styles.input}
              onChangeText={setInputQuantity}
              value={inputQuantity}
            />
          </View>
          <View style={styles.inputContainerHalf}>
            <Text style={styles.labelInput}>Valor:</Text>
            <TextInput
              style={styles.input}
              onChangeText={setInputValue}
              value={inputValue}
            />
          </View>
        </View>
        <ButtonDefault text="Adicionar" action={adicionarProduto} />
        <View style={styles.line}></View>

        <View style={styles.produtos}>
          {produtos.map((item: any, index: any) => (
            <View key={index} style={styles.produtosContainer}>
              <Text style={styles.produtoNome}>{item.inputProduct}</Text>
              <Text style={styles.produtoQuantidade}>{item.inputQuantity}</Text>
              <Text style={styles.produtoValor}>{item.inputValue}</Text>
            </View>
          ))}
        </View>

        <ButtonDefault text="Visualizar pedido" action={visualizarPedido} />
        <ButtonDefault text="Salvar e visualizar pedido" action={salvarEVisualizarPedido} />
      </ScrollView>
    </View>
  )
}

export default ChangeOrder;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#212121'
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  button: {
    backgroundColor: '#fff813',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  buttonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 5,
    paddingVertical: 15,
    width: '100%'
  },
  divideInputsContainer: {
    width: '100%',
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  inputContainer: {

  },
  inputContainerHalf: {
    width: '48%',
  },
  labelInput: {
    color: '#fff',
  },
  input: {
    height: 40,
    borderRadius: 5,
    borderColor: 'gray',
    borderWidth: 1,
    textAlign: 'left',
    alignItems: 'flex-start',
    color: '#fff'
  },
  inputCnpjContainer: {
    width: '53%',
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  inputCNPJ: {
    borderRadius: 5,
    height: 40,
    flex: 1,
    borderColor: 'gray',
    borderWidth: 1,
    color: '#fff'
  },
  cnpjButton: {
    backgroundColor: '#000',
    paddingVertical: 4,
    paddingHorizontal: 7,
    justifyContent: 'center',
    borderRadius: 20
  },
  line: {
    borderColor: '#fff813',
    borderTopWidth: 4,
    marginVertical: 20
  },
  produtos: {

  },
  produtosContainer: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  produtoNome: {
    color: '#000',
    fontSize: 16
  },
  produtoQuantidade: {
    color: '#000',
    fontSize: 16
  },
  produtoValor: {
    color: '#000',
    fontSize: 16
  }
})