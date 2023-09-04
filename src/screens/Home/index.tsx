import { StatusBar } from 'expo-status-bar';
import * as MediaLibrary from 'expo-media-library';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as SQLite from 'expo-sqlite';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

import ButtonDefault from '../../components/ButtonDefault';

export default function Home() {
    const db = SQLite.openDatabase('pedidos.db');
    const [sellerName, setSellerName] = useState<any>();
    const [cardSimples, setCardSimples] = useState<any>();
    const [mostrarValor, setMostrarValor] = useState<any>();

    useEffect(() => {
        checkPermissions();
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


    }, []);

    async function saveData(key: string, value: any) {
        try {
            await AsyncStorage.setItem(key, value);
            console.log('Dados salvos com sucesso!');
        } catch (error) {
            console.error('Erro ao salvar dados:', error);
        }
    }

    const navigation = useNavigation();

    const checkPermissions = async () => {
        const { status } = await MediaLibrary.getPermissionsAsync();

        if (status !== 'granted') {
            const { status: newStatus } = await MediaLibrary.requestPermissionsAsync();

            if (newStatus !== 'granted') {
                Toast.show({
                    type: 'info',
                    text1: `Sem a permissão de arquivo o aplicativo não terá o devido funcionamento`,
                    visibilityTime: 5000,
                });
            }
        }
    };

    const getData = async (key: string) => {
        switch (key) {
            case 'vendedor':
                try {
                    const value = await AsyncStorage.getItem(key);
                    if (value !== null) {
                        setSellerName(value);
                    } else {
                        saveData('vendedor', '');
                    }
                } catch (error) {
                    Toast.show({
                        type: 'info',
                        text1: `Erro ao obter informação de ${key},` + error,
                        visibilityTime: 2000,
                    });
                }
                break
            case 'cardSimples':
                try {
                    const value = await AsyncStorage.getItem(key);
                    if (value !== null) {
                        setCardSimples(value);
                    } else {
                        saveData('cardSimples', 'true');
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
                        saveData('mostrarValor', 'true');
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
                <ButtonDefault text={"PEDIDOS"} action={() => navigation.navigate("Todos os pedidos" as never)} />
                <ButtonDefault text={"CONFIGURAÇÕES"} action={() => navigation.navigate("Configuração" as never)} />
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
