import { StatusBar } from 'expo-status-bar';
import * as MediaLibrary from 'expo-media-library';
import { useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as SQLite from 'expo-sqlite';

import ButtonDefault from '../../components/ButtonDefault';

export default function Home() {
    const db = SQLite.openDatabase('pedidos.db');

    useEffect(() => {
        // Código para criar a tabela "pedidos" se ela não existir
        db.transaction(tx => {
            tx.executeSql(
                'CREATE TABLE IF NOT EXISTS pedidos (id INTEGER PRIMARY KEY AUTOINCREMENT, client TEXT, fantasyName TEXT, cnpj TEXT, city TEXT, district TEXT, contactName TEXT, condiPG TEXT, prazo TEXT, adress TEXT, produtos TEXT)',
                [],
                (_, resultSet) => {
                    // A tabela foi criada com sucesso ou já existe
                },
                (_, error) => {
                    console.log('Erro criar a tabela todosPedidos no SQLite:', error);
                    return true; // Retorne true para indicar que ocorreu um erro
                }
            );
        });

        // Restante do código do useEffect
        // ...
    }, []);


    const navigation = useNavigation();

    const checkPermissions = async () => {
        const { status } = await MediaLibrary.getPermissionsAsync();

        if (status !== 'granted') {
            const { status: newStatus } = await MediaLibrary.requestPermissionsAsync();

            if (newStatus !== 'granted') {
                console.log('Permissions denied');
            }
        }
    };

    useEffect(() => {
        checkPermissions();
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.logoContainer}>
                <Image
                    style={styles.logo}
                    source={require('../../assets/noroeste-logo.png')}
                />
            </View>
            <View style={styles.buttonsContainer}>
                <ButtonDefault text={"TIRAR PEDIDO"} action={() => navigation.navigate("Tirar pedido" as never)} />
                <ButtonDefault text={"CONSULTAR PRODUTOS"} action={() => navigation.navigate("Consultar Produtos" as never)} />
                <ButtonDefault text={"CATÁLOGO"} />
            </View>

            <StatusBar style="auto" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#212121',
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoContainer: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    logo: {
        width: 200,
        height: 100
    },
    buttonsContainer: {
        width: "70%",
        marginTop: 100
    }
});
