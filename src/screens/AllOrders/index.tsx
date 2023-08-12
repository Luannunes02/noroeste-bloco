import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Modal, Button } from 'react-native';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('pedidos.db');

const AllOrders: React.FC = () => {
    const [pedidos, setPedidos] = useState<any[]>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [pedidoToDelete, setPedidoToDelete] = useState<any | null>(null);

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

    const renderPedidoItem = ({ item }: { item: any }) => {
        let prazoFormatted = '';
        if (item.prazo) {
            const prazoArray = item.prazo.split('x');
            prazoFormatted = prazoArray.join('x');
        }

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
                </View>
                <TouchableOpacity onPress={() => handleDelete(item)}>
                    <Text style={styles.apagarText}>Apagar</Text>
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <View style={styles.container}>
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
    apagarText: {
        color: 'red',
        fontSize: 16,
        fontWeight: 'bold',
        marginRight: 10,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        width: '80%',
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 20,
    },
    modalButton: {
        color: 'white',
        backgroundColor: '#2ECC71',
        borderRadius: 5,
        padding: 10,
        marginRight: 10,
        fontWeight: 'bold',
    },
});

export default AllOrders;
