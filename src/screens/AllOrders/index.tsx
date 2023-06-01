import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('pedidos.db');

const AllOrders: React.FC = () => {
    const [pedidos, setPedidos] = useState<any[]>([]);

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
                    return true
                }
            );
        });
    }, []);

    const renderPedidoItem = ({ item }: { item: any }) => (
        <View style={styles.pedidoItemContainer}>
            <Text style={styles.pedidoItemText}>Data: {new Date(item.date).toLocaleDateString()}</Text>
            <Text style={styles.pedidoItemText}>Cliente: {item.client}</Text>
            <Text style={styles.pedidoItemText}>Valor: {item.value}</Text>
            <Text style={styles.pedidoItemText}>Condição de pagamento: {item.condiPG}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={pedidos}
                renderItem={renderPedidoItem}
                keyExtractor={item => item.id.toString()}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    pedidoItemContainer: {
        marginBottom: 16,
        backgroundColor: '#F0F0F0',
        padding: 16,
        borderRadius: 8,
    },
    pedidoItemText: {
        fontSize: 16,
        marginBottom: 8,
    },
});

export default AllOrders;
