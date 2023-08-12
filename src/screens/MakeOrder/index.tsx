import { StyleSheet, Text, View, TextInput, ScrollView, FlatList, Modal, TouchableOpacity, Alert } from 'react-native'
import React, { useState, useEffect, useRef } from 'react';
import { Table, Row, Cell, TableWrapper } from 'react-native-table-component';
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

const MakeOrder = () => {
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
  const [modalVisible, setModalVisible] = useState(false);
  const [produtoEmEdicao, setProdutoEmEdicao] = useState<any>(null);
  const [editProductFields, setEditProductFields] = useState({
    product: '',
    inputQuantity: '',
    value: '',
  });

  const pedidoSelector = useSelector((state: any) => state.pedido);

  const db = SQLite.openDatabase('pedidos.db');

  const [tenPorcentOfDiscont, setTenPorcentOfDiscont] = useState(false);
  const [bonification, setBonification] = useState(true);

  const RadioButton: React.FC<{ label: string; selected: boolean; onPress: () => void }> = ({
    label,
    selected,
    onPress,
  }) => (
    <TouchableOpacity style={styles.radioButtonContainer} onPress={onPress}>
      <View style={[styles.radioButton, selected && styles.radioButtonSelected]} />
      <Text style={styles.radioButtonLabel}>{label}</Text>
    </TouchableOpacity>
  );

  const handleTenPorcentOfDiscontPress = () => {
    setTenPorcentOfDiscont(!tenPorcentOfDiscont);
    setBonification(false);
  };

  const handleBonificationPress = () => {
    setTenPorcentOfDiscont(false);
    setBonification(!bonification);
  };

  const navigation = useNavigation();
  const dispatch = useDispatch();

  const productsData = [
    { name: 'CC 2030 1KG', value: 24.00 },
    { name: 'CC Parrots 6KG', value: 78.00 },
    // Outros produtos...
  ];

  const [showProductModal, setShowProductModal] = useState(false);

  const [filteredProducts, setFilteredProducts] = useState(productsData);

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
    const updateValue = parseFloat(inputValue.replace(',', '.'));
    const quantity = parseFloat(inputQuantity.replace(',', '.'));
    if (bonification) {
      if (quantity >= 10 && quantity < 20) {
        const product = inputProduct + `(+1)`;
        const value = updateValue;
        setAndClearProductAdd(value, product);
        return;
      } else if (quantity >= 20 && quantity < 30) {
        const product = inputProduct + `(+2)`;
        const value = updateValue;
        setAndClearProductAdd(value, product);
        return;
      } else if (quantity >= 30 && quantity < 40) {
        const product = inputProduct + `(+3)`;
        const value = updateValue;
        setAndClearProductAdd(value, product);
        return;
      } else if (quantity >= 40 && quantity < 50) {
        const product = inputProduct + `(+4)`;
        const value = updateValue;
        setAndClearProductAdd(value, product);
        return;
      } else if (quantity >= 50 && quantity < 60) {
        const product = inputProduct + `(+5)`;
        const value = updateValue;
        setAndClearProductAdd(value, product);
        return;
      } else if (quantity >= 60 && quantity < 70) {
        const product = inputProduct + `(+6)`;
        const value = updateValue;
        setAndClearProductAdd(value, product);
        return;
      } else if (quantity >= 70 && quantity < 80) {
        const product = inputProduct + `(+7)`;
        const value = updateValue;
        setAndClearProductAdd(value, product);
        return;
      } else if (quantity >= 80 && quantity < 90) {
        const product = inputProduct + `(+8)`;
        const value = updateValue;
        setAndClearProductAdd(value, product);
        return;
      } else if (quantity >= 90 && quantity <= 100) {
        const product = inputProduct + `(+9)`;
        const value = updateValue;
        setAndClearProductAdd(value, product);
        return;
      } else {
        // Ação padrão para outros valores

      }

    }

    if (tenPorcentOfDiscont) {
      const value = updateValue - (updateValue * (10 / 100));
      const product = inputProduct;
      const novoProduto = { product, inputQuantity, value };
      setProdutos([...produtos, novoProduto]);
      setInputProduct('');
      setInputQuantity('');
      setInputValue('');
      return;
    }

    const value = updateValue;
    const product = inputProduct;
    setAndClearProductAdd(value, product);

    function setAndClearProductAdd(value: Number, product: string) {
      const novoProduto = { product, inputQuantity, value };
      setProdutos([...produtos, novoProduto]);
      setInputProduct('');
      setInputQuantity('');
      setInputValue('');
    }
  };

  const selectProduct = (product: any) => {
    setInputProduct(product.name);
    setInputValue(product.value.toFixed(2).toString());
    setShowProductModal(false);
  };

  const searchProducts = (text: any) => {
    const filtered = productsData.filter((product) =>
      product.name.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredProducts(filtered);
  };

  function CriarPedido(ApenasVerPedido = false) {
    function formatDateToDDMMYYYY(date: any) {
      const d = new Date(date);
      const day = d.getDate().toString().padStart(2, '0');
      const month = (d.getMonth() + 1).toString().padStart(2, '0');
      const year = d.getFullYear();
      return `${day}/${month}/${year}`;
    }

    const date = formatDateToDDMMYYYY(new Date());

    const novoPedido = {
      date,
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

    if (ApenasVerPedido === true) {
      return
    }
    // Salvar o pedido no banco de dados
    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO pedidos (client, date, fantasyName, cnpj, city, district, contactName, condiPG, prazo, adress, produtos) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [novoPedido.inputClient, novoPedido.date, novoPedido.inputFantasyName, novoPedido.inputCNPJ, novoPedido.inputCity, novoPedido.inputDistrict, novoPedido.inputContactName, novoPedido.inputCondiPG, novoPedido.inputPrazo, novoPedido.inputAdress, JSON.stringify(novoPedido.produtos)],
        (_, resultSet) => {
          const { insertId } = resultSet;

          // Atualizar o estado Redux com o novo pedido
          const novoPedidoBD = { ...novoPedido, id: insertId };
          dispatch(updateTodosPedidos(novoPedidoBD));
        },
        (_, error) => {
          console.log('Erro ao salvar pedido no SQLite:', error);
          return true; // Retorne true para indicar que ocorreu um erro
        }
      );
    });

  }

  function visualizarPedido() {
    CriarPedido();

    navigation.navigate("Visualizar pedido" as never);
  };

  function LimparInputs() {
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
  }


  function salvarEVisualizarPedido() {
    CriarPedido();

    LimparInputs();

    navigation.navigate("Visualizar pedido" as never);
  }

  const tableHead = ['Produto', 'Qt.', 'Valor', 'Total', 'Ações'];
  const tableData = produtos.map((item: any, index: any) => [
    item.product,
    item.inputQuantity,
    parseFloat(item.value).toFixed(2),
    // Calcula o total multiplicando a quantidade pelo valor unitário    
    parseFloat(item.inputQuantity) * parseFloat(item.value),
    <TouchableOpacity onPress={() => editarProduto(index)}>
      <Feather name="edit" size={20} color="#000" />
    </TouchableOpacity>,
    <TouchableOpacity onPress={() => excluirProduto(index)}>
      <Feather name="trash-2" size={20} color="#000" />
    </TouchableOpacity>
  ]);


  const columnWidths = [3, 0.8, 0.9, 1, 0.7, 0.7];
  const columnWidthsHeader = [3, 0.8, 0.9, 1, 1.4];

  const editarProduto = (index: any) => {
    // Obter o produto com base no índice
    const produtoSelecionado = produtos[index];

    // Definir o produto selecionado como produto em edição
    setProdutoEmEdicao(produtoSelecionado);

    // Preencher os campos do modal com os dados do produto selecionado
    setEditProductFields({
      product: produtoSelecionado.product,
      inputQuantity: produtoSelecionado.inputQuantity,
      value: produtoSelecionado.value.toString(),
    });

    // Abrir o modal
    setModalVisible(true);
  };

  const salvarProdutoEditado = () => {
    // Verificar se algum campo está vazio
    if (!editProductFields.product || !editProductFields.inputQuantity || !editProductFields.value) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
      return;
    }

    // Atualizar o produto no estado
    setProdutos((prevState: any) => {
      const newProducts = [...prevState];
      const index = newProducts.findIndex((produto) => produto.id === produtoEmEdicao.id);
      const updateValue = parseFloat(editProductFields.value.replace(',', '.'));

      if (index !== -1) {
        newProducts[index] = {
          ...newProducts[index],
          product: editProductFields.product,
          inputQuantity: editProductFields.inputQuantity,
          value: updateValue,
        };
      }

      return newProducts;
    });

    // Fechar o modal
    setModalVisible(false);
  };

  const excluirProduto = (index: any) => {
    setProdutos((prevState: any) => {
      const newProducts = [...prevState];
      newProducts.splice(index, 1);
      return newProducts;
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => LimparInputs()}>
          <Text style={styles.buttonText}>+</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Todos os pedidos" as never)}>
          <Text>VER PEDIDOS</Text>
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
          <View style={styles.productNameContainer}>
            <TextInput
              style={styles.inputProductSearch}
              onChangeText={setInputProduct}
              value={inputProduct}
            />
            <TouchableOpacity onPress={() => setShowProductModal(true)} style={styles.modalInputBtn}>
              <Feather name="search" size={25} color="#FFF" />
            </TouchableOpacity>
          </View>
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
        <View style={styles.containerDiscont}>
          <View>
            <Text style={styles.labelInputRadio}>Desconto de 10%:</Text>
            <RadioButton
              label="Desconto"
              selected={tenPorcentOfDiscont}
              onPress={handleTenPorcentOfDiscontPress}
            />
          </View>
          <View>
            <Text style={styles.labelInputRadio}>Bonificação:</Text>
            <RadioButton label="Bonificação" selected={bonification} onPress={handleBonificationPress} />
          </View>
        </View>
        <ButtonDefault text="Adicionar" action={adicionarProduto} />

        {/* Modal de seleção de produtos */}
        <Modal visible={showProductModal} animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.searchInputContainer}>
              <TextInput
                style={styles.searchInput}
                placeholder="Pesquisar produto"
                onChangeText={searchProducts}
              />
            </View>
            <FlatList
              data={filteredProducts}
              keyExtractor={(item) => item.name}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => selectProduct(item)}>
                  <Text style={styles.productItem}>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity onPress={() => setShowProductModal(false)}>
              <Text style={styles.closeButton}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </Modal>
        {/*Modal de edição de produto*/}
        <Modal visible={modalVisible} animationType="slide">
          <View style={styles.modalContainerEdit}>
            <Text style={styles.modalTitleEdit}>Editar Produto</Text>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButton}>Cancelar</Text>
            </TouchableOpacity>
            <Text style={styles.labelInputEdit}>Produto:</Text>
            <TextInput
              style={styles.inputEdit}
              onChangeText={(text) =>
                setEditProductFields((prevState) => ({
                  ...prevState,
                  product: text,
                }))
              }
              value={editProductFields.product}
            />
            <Text style={styles.labelInputEdit}>Quantidade:</Text>
            <TextInput
              style={styles.inputEdit}
              onChangeText={(text) =>
                setEditProductFields((prevState) => ({
                  ...prevState,
                  inputQuantity: text,
                }))
              }
              value={editProductFields.inputQuantity}
            />
            <Text style={styles.labelInputEdit}>Valor:</Text>
            <TextInput
              style={styles.inputEdit}
              onChangeText={(text) =>
                setEditProductFields((prevState) => ({
                  ...prevState,
                  value: text,
                }))
              }
              value={editProductFields.value}
            />
            <ButtonDefault text="Salvar" action={salvarProdutoEditado} />
          </View>
        </Modal>




        <View style={styles.line}></View>

        <Table borderStyle={styles.tableBorder}>
          <Row data={tableHead} style={styles.tableHeader} textStyle={{ ...styles.tableHeaderText }} flexArr={columnWidthsHeader} />
          {tableData.map((rowData: any, index: any) => (
            <Row key={index} data={rowData} style={styles.tableRow} textStyle={{ ...styles.tableRowText }} flexArr={columnWidths} />
          ))}
          <Row
            data={['TOTAL', tableData.reduce((sum: any, row: any) => sum + row[3], 0).toFixed(2)]}
            style={styles.tableTotalRow}
            textStyle={{ ...styles.tableTotalRowText }}
          />
        </Table>


        <ButtonDefault text="Salvar e visualizar pedido" action={salvarEVisualizarPedido} />
        <ButtonDefault text="Visualizar pedido" action={visualizarPedido} />
      </ScrollView>
    </View>
  )
}

export default MakeOrder;

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
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'white',
  },
  modalTitle: {

  },
  searchInputContainer: {
    marginBottom: 10,
    padding: 5,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
  },
  searchInput: {
    fontSize: 16,
    height: 40,
  },
  productItem: {
    paddingVertical: 10,
    fontSize: 16,
  },
  closeButton: {
    marginTop: 20,
    paddingVertical: 10,
    backgroundColor: 'gray',
    textAlign: 'center',
    fontSize: 16,
    color: 'white',
  },
  inputProductSearch: {
    borderRadius: 5,
    height: 40,
    flex: 1,
    borderColor: 'gray',
    borderWidth: 1,
    color: '#fff'
  },
  productInput: {
    color: "#000",
    backgroundColor: "#fff813",
    height: 25,
  },
  modalInputBtn: {
    marginEnd: 10,
    backgroundColor: "#000",
    padding: 6,
    borderRadius: 20
  },
  productNameContainer: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  labelInputRadio: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: "#fff",
  },
  radioButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#fff',
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioButtonSelected: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#fff',
  },
  radioButtonLabel: {
    fontSize: 16,
    color: "#fff",
  },
  containerDiscont: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    textAlign: 'center',
    alignItems: 'center',
    marginTop: 10
  },
  tableBorder: {
    borderWidth: 1,
    borderColor: '#000',
  },
  tableHeader: {
    height: 40,
    backgroundColor: '#f1f8ff',
  },
  tableHeaderText: {
    margin: 0,
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center',
  },
  tableRow: {
    height: 30,
    backgroundColor: '#e7eff6',
  },
  tableRowText: {
    margin: 6,
    fontSize: 12,
    textAlign: 'center',
  },
  tableTotalRow: {
    height: 40,
    backgroundColor: '#c5d1e4',
  },
  tableTotalRowText: {
    margin: 6,
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center',
  },
  modalContainerEdit: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  modalHeaderEdit: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitleEdit: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButtonEdit: {
    fontSize: 16,
    color: '#888',
  },
  labelInputEdit: {
    fontSize: 16,
    marginBottom: 5,
  },
  inputEdit: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
})