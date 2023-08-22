import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Modal, Button, ScrollView } from 'react-native';
import * as SQLite from 'expo-sqlite';
import { useNavigation } from '@react-navigation/native';

const db = SQLite.openDatabase('pedidos.db');

import LoadingIndicator from '../../components/LoadingIndicator';

const AllOrders: React.FC = () => {
    const [pedidos, setPedidos] = useState<any[]>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [pedidoToDelete, setPedidoToDelete] = useState<any | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const navigation = useNavigation();

    useEffect(() => {
        // Carregar os pedidos do banco de dados
        db.transaction(tx => {
            tx.executeSql(
                'SELECT * FROM pedidos',
                [],
                (_, resultSet) => {
                    const { rows } = resultSet;
                    const data = rows._array;
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

    const calculateTotalValue = (produtos: any) => {
        let total = 0;
        const produtosArray = JSON.parse(produtos);

        produtosArray.forEach((produto: any) => {
            total += parseFloat(produto.value) * parseFloat(produto.inputQuantity);
        });
        return total.toFixed(2); // Arredonda para 2 casas decimais
    }

    const handleEdit = (pedidoId: number) => {
        navigation.navigate('Tirar pedido' as never, { pedidoId });
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

    return (
        <View style={styles.container}>
            {
                loading ?
                    <View style={styles.loading}>
                        <LoadingIndicator />
                    </View>
                    :
                    <View>
                        <FlatList
                            data={pedidos}
                            renderItem={renderPedidoItem}
                            keyExtractor={item => item.id.toString()}
                        />

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
            }
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#F5F5F5',
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
