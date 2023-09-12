import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Modal, Button, ScrollView, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // ou outra biblioteca de ícones que você preferir
import * as SQLite from 'expo-sqlite';
import { useNavigation } from '@react-navigation/native';
import RNPickerSelect from 'react-native-picker-select';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';

const db = SQLite.openDatabase('pedidos.db');

import LoadingIndicator from '../../components/LoadingIndicator';
import CardProductsConsultSimple from '../../components/CardProductsConsultSimple';

const AllOrders: React.FC = () => {
    const backgroundColor = '#F5F5F5';
    const textColor = '#333';
    const [pedidos, setPedidos] = useState<any[]>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [pedidoToDelete, setPedidoToDelete] = useState<any | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [searchText, setSearchText] = useState('');
    const navigation = useNavigation();
    const [filterModalVisible, setFilterModalVisible] = useState(false);
    const [selectedMonthFilter, setSelectedMonthFilter] = useState<string | null>(null);
    const [minValue, setMinValue] = useState('');
    const [maxValue, setMaxValue] = useState('');
    const [commissionPaidFilter, setCommissionPaidFilter] = useState<string | null>('Todos'); // Valor padrão 'Todos'
    const [districtFilter, setDistrictFilter] = useState('');
    const [paymentFilter, setPaymentFilter] = useState('');
    const paymentOptions = [
        { label: 'Boleto', value: 'Boleto' },
        { label: 'Dinheiro/Pix', value: 'Dinheiro/Pix' },
        { label: 'Cheque', value: 'Cheque' },
    ];
    const [originalPedidos, setOriginalPedidos] = useState<any[]>([]);
    const [comissionReceived, setComissionReceived] = useState(false);
    const monthOptions = [
        { label: 'Todos', value: 'Todos' },
        { label: 'Janeiro (01)', value: '01' },
        { label: 'Fevereiro (02)', value: '02' },
        { label: 'Março (03)', value: '03' },
        { label: 'Abril (04)', value: '04' },
        { label: 'Maio (05)', value: '05' },
        { label: 'Junho (06)', value: '06' },
        { label: 'Julho (07)', value: '07' },
        { label: 'Agosto (08)', value: '08' },
        { label: 'Setembro (09)', value: '09' },
        { label: 'Outubro (10)', value: '10' },
        { label: 'Novembro (11)', value: '11' },
        { label: 'Dezembro (12)', value: '12' },
    ];

    useEffect(() => {
        // Carregar os pedidos do banco de dados em ordem inversa (do último criado para o primeiro)
        db.transaction(tx => {
            tx.executeSql(
                'SELECT * FROM pedidos ORDER BY id DESC',
                [],
                (_, resultSet) => {
                    const { rows } = resultSet;
                    const data = rows._array;
                    setOriginalPedidos(data);
                    setPedidos(data);
                    setLoading(false);
                },
                (_, error) => {
                    console.log('Erro ao carregar pedidos:', error);
                    return true; // Retorna true para indicar o erro
                }
            );
        });
    }, []);


    const handleDelete = (pedido: any) => {
        setPedidoToDelete(pedido);
        setModalVisible(true);
    }

    const confirmDelete = () => {
        if (pedidoToDelete) {
            // Apagar o pedido do banco de dados
            db.transaction(tx => {
                tx.executeSql(
                    'DELETE FROM pedidos WHERE id = ?',
                    [pedidoToDelete.id],
                    (_, resultSet) => {
                        // Pedido apagado com sucesso do banco de dados
                        console.log('Pedido apagado do banco de dados');
                        // Recarregar os pedidos após a exclusão
                        db.transaction(tx => {
                            tx.executeSql(
                                'SELECT * FROM pedidos',
                                [],
                                (_, resultSet) => {
                                    const { rows } = resultSet;
                                    const data = rows._array;
                                    setPedidos(data);
                                },
                                (_, error) => {
                                    console.log('Erro ao recarregar pedidos após exclusão:', error);
                                    return true;
                                }
                            );
                        });
                    },
                    (_, error) => {
                        console.log('Erro ao apagar pedido do banco de dados:', error);
                        return true; // Retorne true para indicar que ocorreu um erro
                    }
                );
            });

            setPedidoToDelete(null);
            setModalVisible(false);
        }
    }

    const filteredPedidos = pedidos.filter(pedido => {
        const searchTerm = searchText.toLowerCase();
        return (
            pedido.client ? pedido.client.toLowerCase().includes(searchTerm) : '' ||
                pedido.contactName ? pedido.contactName.toLowerCase().includes(searchTerm) : '' ||
                    pedido.fantasyName ? pedido.fantasyName.toLowerCase().includes(searchTerm) : ''
        );
    });

    const calculateTotalValue = (produtos: any) => {
        let total = 0;
        try {
            const produtosArray = JSON.parse(produtos);

            produtosArray.forEach((produto: any) => {
                total += parseFloat(produto.value) * parseFloat(produto.inputQuantity);
            });

            return total.toFixed(2); // Arredonda para 2 casas decimais
        } catch (error) {
            // Trate o erro de análise JSON aqui, por exemplo, log ou retorne um valor padrão.
            Toast.show({
                type: 'info',
                text1: `Erro ao somar os valores dos pedidos, reinicie o aplicativo para visualizar, erro recebido: ` + error,
                visibilityTime: 2000,
            });
            return 'Erro ao calcular o valor';
        }
    }

    const handleEdit = (pedidoId: number) => {
        const route = ["Tirar pedido", { pedidoId }];
        navigation.navigate(...(route as never));
    };

    const showFilterModal = () => {
        setFilterModalVisible(true);
    };

    const applyFilters = () => {
        const filtered = originalPedidos.filter((pedido) => {
            if (selectedMonthFilter && selectedMonthFilter !== 'Todos') {
                const month = selectedMonthFilter; // Mês selecionado (por exemplo, '08')
                const pedidoMonth = pedido.date.split('/')[1]; // Extrai o mês da data do pedido
                if (pedidoMonth !== month) {
                    return false;
                }
            }

            if (commissionPaidFilter === 'Comissão paga' && !pedido.commissionPaid) {
                return false;
            }

            if (commissionPaidFilter === 'Comissão a receber' && pedido.commissionPaid) {
                return false;
            }

            const totalValue = calculateTotalValue(pedido.produtos);

            // Verifica se o valor mínimo está definido e filtra os pedidos com valor menor que o mínimo
            if (minValue && parseFloat(totalValue) < parseFloat(minValue)) {
                return false;
            }

            // Verifica se o valor máximo está definido e filtra os pedidos com valor maior que o máximo
            if (maxValue && parseFloat(totalValue) > parseFloat(maxValue)) {
                return false;
            }

            if (!pedido.city.toLowerCase().includes(districtFilter) || !pedido.district.toLowerCase().includes(districtFilter) || !pedido.adress.toLowerCase().includes(districtFilter)) {
                return false
            }

            // Verifica se a condição de pagamento está definida e filtra os pedidos com condição de pagamento diferente
            if (paymentFilter && pedido.condiPG !== paymentFilter) {
                return false;
            }

            return true;
        });

        if (minValue === '' && maxValue === '' && districtFilter === '' && paymentFilter === '' && commissionPaidFilter === "Todos") {
            setPedidos(originalPedidos);
        }

        setPedidos(filtered);
        setFilterModalVisible(false);
    };


    const clearFilters = () => {
        // Limpe os valores dos filtros
        setMinValue('');
        setMaxValue('');
        setDistrictFilter('');
        setPaymentFilter('');

        setPedidos(originalPedidos);
    };

    const handleToggleComissionReceived = (item: any) => {
        // Crie uma cópia dos pedidos
        const updatedPedidos = [...pedidos];

        // Encontre o pedido correspondente pelo ID
        const pedidoToUpdate = updatedPedidos.find(pedido => pedido.id === item.id);

        if (pedidoToUpdate) {
            // Inverta o valor de commissionPaid (true para false e vice-versa)
            pedidoToUpdate.commissionPaid = !pedidoToUpdate.commissionPaid;

            // Atualize o estado com os pedidos atualizados
            setPedidos(updatedPedidos);

            // Atualize o SQLite
            db.transaction(tx => {
                tx.executeSql(
                    'UPDATE pedidos SET commissionPaid = ? WHERE id = ?',
                    [pedidoToUpdate.commissionPaid ? 1 : 0, pedidoToUpdate.id],
                    (_, resultSet) => {
                        Toast.show({
                            type: 'success',
                            text1: 'Pedido atualizado',
                            visibilityTime: 500,
                        });
                    },
                    (_, error) => {
                        console.error('Erro ao atualizar no SQLite:', error);
                        return true; // Retorne true para indicar que ocorreu um erro
                    }
                );
            });
        }
    };

    const renderPedidoItem = ({ item }: { item: any }) => {
        let prazoFormatted = '';
        if (item.prazo) {
            const prazoArray = item.prazo.split('x');
            prazoFormatted = prazoArray.join('x');
        }

        const totalValue = calculateTotalValue(item.produtos);

        return (
            <View style={styles.pedidoItemContainer}>
                <View style={styles.infoContainer}>
                    <Text style={styles.clientName}>{item.client}</Text>
                    <Text style={styles.city}>{item.city}</Text>
                    <Text style={styles.condiPG}>{item.condiPG}</Text>
                </View>
                <View style={styles.prazoContainer}>
                    <View style={styles.commissionContainer}>
                        <Text>Comissão recebida:</Text>
                        <TouchableOpacity
                            style={styles.checkbox}
                            onPress={() => handleToggleComissionReceived(item)}
                        >
                            {item.commissionPaid ? (
                                <Icon name="check-square" size={20} color="green" />
                            ) : (
                                <Icon name="square" size={20} color="gray" />
                            )}
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.prazoText}>Prazo: {prazoFormatted}</Text>
                    <Text style={styles.dateText}>Data: {item.date}</Text>
                    <Text style={styles.totalText}>Valor Total: R$ {totalValue}</Text>
                    <View style={styles.btnsContainer}>
                        <TouchableOpacity onPress={() => handleDelete(item)}>
                            <Text style={styles.apagarText}>Apagar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleEdit(item.id)}>
                            <Text style={styles.editarText}>Editar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    };

    const totalValueOfAllOrders = pedidos.reduce((acc, pedido) => {
        const totalValue = !pedido.commissionPaid ? parseFloat(calculateTotalValue(pedido.produtos)) : 0;
        return acc + totalValue;
    }, 0).toFixed(2);

    return (
        <View style={styles.container}>
            <View style={styles.totalContainer}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-around', width: '100%' }}>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Pesquisar pedidos"
                        onChangeText={setSearchText}
                        value={searchText}
                    />
                    <TouchableOpacity onPress={showFilterModal} style={styles.filterButton}>
                        <Text style={styles.filterButtonText}>Filtrar</Text>
                        <Modal
                            visible={filterModalVisible}
                            animationType="slide"
                            transparent={true}
                            onRequestClose={() => setFilterModalVisible(false)}
                        >
                            <View style={styles.filterModal}>
                                <Text style={styles.filterTitle}>Filtros</Text>
                                <RNPickerSelect
                                    onValueChange={value => setSelectedMonthFilter(value)}
                                    value={selectedMonthFilter}
                                    items={monthOptions}
                                    placeholder={{ label: 'Selecione o Mês', color: '#000', value: null }}
                                    style={{
                                        inputAndroid: { color: 'black', width: 300, height: 20, marginHorizontal: '11.7%', backgroundColor: '#ffff', marginBottom: 40 },
                                        inputIOS: { color: 'white' },
                                    }}
                                />
                                <TextInput
                                    style={styles.filterInput}
                                    placeholder="Valor Mínimo"
                                    onChangeText={text => {
                                        // Permitir apenas números e um único ponto
                                        const cleanedText = text.replace(/[^0-9.]/g, '');
                                        setMinValue(cleanedText);
                                    }}
                                    value={minValue}
                                    keyboardType="numeric"
                                />
                                <TextInput
                                    style={styles.filterInput}
                                    placeholder="Valor Máximo"
                                    onChangeText={text => {
                                        // Permitir apenas números e um único ponto
                                        const cleanedText = text.replace(/[^0-9.]/g, '');
                                        setMaxValue(cleanedText);
                                    }}
                                    value={maxValue}
                                    keyboardType="numeric"
                                />
                                <RNPickerSelect
                                    onValueChange={value => setCommissionPaidFilter(value)}
                                    value={commissionPaidFilter}
                                    items={[
                                        { label: 'Todos', value: 'Todos' },
                                        { label: 'Comissão paga', value: 'Comissão paga' },
                                        { label: 'Comissão a receber', value: 'Comissão a receber' },
                                    ]}
                                    style={{
                                        inputAndroid: { color: 'black', width: 300, height: 20, marginHorizontal: '11.7%', backgroundColor: '#ffff', marginBottom: 40 },
                                        inputIOS: { color: 'white' },
                                    }}
                                />
                                <TextInput
                                    style={styles.filterInput}
                                    placeholder="Bairro"
                                    onChangeText={text => setDistrictFilter(text)}
                                    value={districtFilter}
                                />
                                <RNPickerSelect
                                    onValueChange={value => setPaymentFilter(value)}
                                    value={paymentFilter}
                                    items={paymentOptions}
                                    placeholder={{ label: 'Tipo de pagamento', color: '#000', value: null }}
                                    style={{
                                        inputAndroid: { color: 'black', width: 300, height: 20, marginHorizontal: '11.7%', backgroundColor: '#ffff', marginBottom: 40 },
                                        inputIOS: { color: 'white' },
                                    }}
                                />
                                <TouchableOpacity
                                    style={styles.applyButton}
                                    onPress={applyFilters}
                                >
                                    <Text style={styles.applyButtonText}>Aplicar filtro</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.clearButton}
                                    onPress={clearFilters}
                                >
                                    <Text style={styles.clearButtonText}>Limpar filtro</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.closeButton}
                                    onPress={() => setFilterModalVisible(false)}
                                >
                                    <Text style={styles.closeButtonText}>Fechar</Text>
                                </TouchableOpacity>
                            </View>
                        </Modal>
                    </TouchableOpacity>
                </View>
                <View style={{ flexDirection: 'row', marginTop: 10 }}>
                    <Text style={styles.totalLabel}>Total de Pedidos:</Text>
                    <Text style={styles.totalValue}>R$ {totalValueOfAllOrders}</Text>
                </View>
            </View>
            {loading ? (
                <View style={styles.loading}>
                    <LoadingIndicator />
                </View>
            ) : (

                <FlatList
                    data={filteredPedidos}
                    style={{ marginTop: 10 }}
                    renderItem={renderPedidoItem}
                    keyExtractor={item => item.id.toString()}
                />

            )}
            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text>Deseja realmente apagar este pedido?</Text>
                        <View style={styles.modalButtons}>
                            <Button title="Cancelar" onPress={() => setModalVisible(false)} />
                            <Button title="Apagar" onPress={confirmDelete} />
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    totalContainer: {
        backgroundColor: '#fffaff',
        padding: 10,
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: 15,
        borderRightWidth: 5,
        borderRightColor: "#fff813",
        borderLeftWidth: 5,
        borderLeftColor: "#fff813"
    },
    totalLabel: {
        fontSize: 18,
        fontWeight: 'bold',
        marginRight: 7
    },
    totalValue: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#212121',
    },
    searchInput: {
        justifyContent: 'flex-start',
        height: 40,
        borderBottomColor: '#000000',
        borderBottomWidth: 2,
        width: '50%'

    },
    filterModal: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
    },
    filterTitle: {
        fontSize: 24,
        marginBottom: 20,
        color: '#fff813',
        fontWeight: 'bold'
    },
    filterInput: {
        width: 300,
        height: 40,
        borderColor: '#fff',
        backgroundColor: '#fff',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
    },
    commissionContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkbox: {
        width: 24,
        height: 24,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
    },
    checkboxIcon: {
        fontSize: 18,
        color: 'green', // Cor da marca de seleção quando marcado
    },
    commissionText: {
        fontSize: 16,
        marginLeft: 5,
    },
    applyButton: {
        backgroundColor: '#fff700',
        padding: 10,
        borderRadius: 5,
        marginTop: 15,
        width: 150
    },
    applyButtonText: {
        color: '#000',
        textAlign: 'center',
        fontWeight: 'bold'
    },
    closeButton: {
        backgroundColor: '#ff8f8f',
        padding: 10,
        borderRadius: 5,
        marginTop: 15,
        width: 150
    },
    closeButtonText: {
        color: '#000',
        textAlign: 'center',
        fontWeight: 'bold'
    },
    filterButton: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff700',
        paddingHorizontal: 15,
        paddingVertical: 7,
        borderRadius: 10,
    },
    filterButtonText: {
        fontWeight: '600'
    },
    clearButton: {
        backgroundColor: '#8f8f8f',
        padding: 10,
        borderRadius: 5,
        marginTop: 15,
        width: 150
    },
    clearButtonText: {
        color: '#000',
        textAlign: 'center',
        fontWeight: 'bold'
    },
    pedidoItemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
        backgroundColor: '#FFF',
        borderRadius: 8,
        padding: 16,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 2,
    },
    infoContainer: {
        flex: 1,
    },
    clientName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    city: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    condiPG: {
        fontSize: 14,
        color: '#2ECC71',
    },
    prazoContainer: {
        alignItems: 'flex-end',
    },
    prazoText: {
        color: '#333',
        fontSize: 14,
    },
    dateText: {
        color: '#666',
        fontSize: 14,
    },
    btnsContainer: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'flex-end'
    },
    apagarText: {
        color: 'red',
        fontSize: 16,
        fontWeight: 'bold',
        marginRight: 10,
        alignContent: 'flex-end',
        alignItems: 'flex-end'
    },
    editarText: {
        color: 'green',
        fontSize: 16,
        fontWeight: 'bold',
        marginRight: 10,
        alignContent: 'flex-end',
        alignItems: 'flex-end'
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    totalText: {

    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        width: '80%',
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
        gap: 20,
    },
    modalButton: {
        color: 'white',
        backgroundColor: '#2ECC71',
        borderRadius: 5,
        padding: 10,
        marginRight: 10,
        fontWeight: 'bold',
    },
    loading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default AllOrders;
