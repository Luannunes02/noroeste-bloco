import { StyleSheet, Text, View, TouchableOpacity, TextInput, Modal } from 'react-native';
import React from 'react';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SQLite from 'expo-sqlite';
import Toast from 'react-native-toast-message';

const Configurations = () => {
    const db = SQLite.openDatabase('pedidos.db');
    const [sellerName, setSellerName] = useState<string>('');
    const [confirmationModalVisible, setConfirmationModalVisible] = useState<boolean>(false);
    const [isCreatingDatabase, setIsCreatingDatabase] = useState<boolean>(false);
    const [isDeletingDatabase, setIsDeletingDatabase] = useState<boolean>(false);
    const [cardSimples, setCardSimples] = useState<any>();
    const [mostrarValor, setMostrarValor] = useState<any>();
    const backgroundColor = '#212121';
    const textColor = '#fff813';
    const showToast = (message: string) => {
        Toast.show({
            type: 'success',
            text1: message,
            visibilityTime: 1000,
        });
    };

    useEffect(() => {
        getData('vendedor');
        getData('cardSimples');
        getData('mostrarValor');
    }, [])

    const criarBancoDeDados = () => {
        hideConfirmationModal();
        db.transaction(tx => {
            tx.executeSql(
                'CREATE TABLE pedidos (id INTEGER PRIMARY KEY AUTOINCREMENT, client TEXT, date TEXT NOT NULL, fantasyName TEXT, cnpj TEXT, city TEXT, district TEXT, contactName TEXT, condiPG TEXT, prazo TEXT, adress TEXT, observation TEXT, produtos TEXT, commissionPaid BOOLEAN DEFAULT 0)',
                [],
                () => {
                    showToast('Tabela "pedidos" criada com sucesso.');
                },
                (_, error) => {
                    showToast(`Essa tabela já existe`);
                    return true;
                }
            );
        });
    }

    const apagarBancoDeDados = () => {
        hideConfirmationModal();
        db.transaction(tx => {
            // Execute a instrução SQL para apagar a tabela
            tx.executeSql(
                `DROP TABLE IF EXISTS pedidos`,
                [],
                (_, resultSet) => {
                    // Tabela apagada com sucesso
                    Toast.show({
                        type: 'success',
                        text1: 'Tabela de pedidos apagada com sucesso',
                        visibilityTime: 1000,
                    });
                },
                (_, error) => {
                    // Ocorreu um erro ao apagar a tabela
                    Toast.show({
                        type: 'error',
                        text1: `Erro ao apagar a tabela pedidos: ` + error,
                        visibilityTime: 5000,
                    });
                    return true
                }
            );
        });
    }

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

    const getData = async (key: string) => {
        switch (key) {
            case 'vendedor':
                try {
                    const value = await AsyncStorage.getItem(key);
                    if (value !== null) {
                        setSellerName(value);
                    } else {
                        console.log(`Nenhum valor encontrado para ${key}`);
                    }
                } catch (error) {
                    Toast.show({
                        type: 'info',
                        text1: `Salve seu nome de vendedor,` + error,
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

    const showConfirmationModal = () => {
        // Mostrar o modal de confirmação
        setConfirmationModalVisible(true);
    };

    const hideConfirmationModal = () => {
        // Ocultar o modal de confirmação
        setConfirmationModalVisible(false);
    };

    const confirmAction = () => {
        // Executar a ação (criar ou apagar o banco) e ocultar o modal de confirmação
        if (confirmationModalVisible) {
            hideConfirmationModal();
            if (isCreatingDatabase) {
                criarBancoDeDados();
                setIsCreatingDatabase(false);
            } else if (isDeletingDatabase) {
                apagarBancoDeDados();
                setIsDeletingDatabase(false);
            }
        }
    };

    const saveSellerName = async () => {
        try {
            // Implemente o código para salvar o nome do vendedor
            await AsyncStorage.setItem('vendedor', sellerName);

            // Exemplo de toast de sucesso
            showToast('Nome do vendedor salvo com sucesso!');
        } catch (error) {
            // Exemplo de toast de erro
            showToast('Erro ao salvar dados: ' + error);
        }
    };

    const toggleCardType = async () => {
        const newCardType = cardSimples === 'true' ? 'false' : 'true';
        setCardSimples(newCardType);
        await saveData('cardSimples', newCardType);
    };

    // Função para alternar o valor de "Mostrar Valor" (CheckBox)
    const toggleMostrarValor = async () => {
        const newMostrarValor = mostrarValor === 'true' ? 'false' : 'true';
        setMostrarValor(newMostrarValor);
        await saveData('mostrarValor', newMostrarValor);
    };

    return (
        <View style={[styles.container, { backgroundColor }]}>
            <Text style={{ color: '#fff813', fontWeight: 'bold', fontSize: 25, borderBottomColor: '#fff813', borderBottomWidth: 5 }}>Configurações do sistema</Text>
            <View style={styles.inputContainer}>
                <Text style={[styles.label, { color: textColor }]}>
                    Tipo de card para exibir os produtos:
                </Text>
                <View style={styles.inputWrapper}>
                    <Text style={[styles.cardTypeText, { color: textColor }]}>
                        {cardSimples === 'true' ? 'Card simples' : 'Card completo'}
                    </Text>
                    <TouchableOpacity
                        style={styles.cardTypeButton}
                        onPress={() => {
                            const newCardType = cardSimples === 'true' ? 'false' : 'true';
                            setCardSimples(newCardType);
                            saveData('cardSimples', newCardType);
                        }}
                    >
                        <Text style={[styles.buttonText, { color: '#fff' }]}>
                            Trocar
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.inputContainer}>
                <Text style={[styles.label, { color: textColor }]}>
                    Exibir o valor dos produtos:
                </Text>
                <View style={styles.checkboxContainer}>
                    <Text style={[styles.checkboxLabel, { color: textColor, marginRight: 10 }]}>
                        {mostrarValor === 'true' ? 'Sim' : 'Não'}
                    </Text>
                    <TouchableOpacity
                        style={styles.checkbox}
                        onPress={() => {
                            const newValue = mostrarValor === 'true' ? 'false' : 'true';
                            setMostrarValor(newValue);
                            saveData('mostrarValor', newValue);
                        }}
                    >
                        <View
                            style={[
                                styles.checkboxInner,
                                {
                                    backgroundColor:
                                        mostrarValor === 'false' ? backgroundColor : '#fff',
                                },
                            ]}
                        />
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.inputContainer}>
                <Text style={[styles.label, { color: textColor }]}>
                    Nome do vendedor:
                </Text>
                <View style={styles.inputWrapper}>
                    <TextInput
                        style={[styles.input, { borderColor: textColor, color: textColor }]}
                        onChangeText={text => setSellerName(text)} // Alteração aqui
                        value={sellerName}
                    />
                    <TouchableOpacity
                        style={styles.saveButton}
                        onPress={saveSellerName}
                    >
                        <Text style={[styles.buttonText, { color: backgroundColor }]}>
                            Salvar
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
            <TouchableOpacity style={styles.button} onPress={
                () => {
                    setIsCreatingDatabase(true);
                    showConfirmationModal();
                }
            }>
                <Text style={[styles.buttonText, { color: textColor }]}>
                    Criar banco de dados
                </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={
                () => {
                    setIsDeletingDatabase(true);
                    showConfirmationModal();
                }
            }>
                <Text style={[styles.buttonText, { color: textColor }]}>
                    Excluir banco de dados
                </Text>
            </TouchableOpacity>

            {/* Modal de Confirmação */}
            <Modal
                visible={confirmationModalVisible}
                transparent={true}
                animationType="slide"
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalText}>
                            Tem certeza que deseja realizar esta ação?
                        </Text>
                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.modalButtonCancel]}
                                onPress={hideConfirmationModal}
                            >
                                <Text style={styles.modalButtonText}>Não</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.modalButtonConfirm]}
                                onPress={confirmAction}
                            >
                                <Text style={styles.modalButtonText}>Sim</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    )
}

export default Configurations

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        backgroundColor: '#ffffff1d',
        padding: 10,
        borderWidth: 1,
        borderRadius: 5,
        marginVertical: 10,
        width: '70%',
        justifyContent: 'center',
        textAlign: 'center'
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
        justifyContent: 'center',
        textAlign: 'center'
    },
    inputContainer: {
        marginVertical: 20,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        width: '80%',
    },
    label: {
        fontSize: 18,
        marginBottom: 10,
        fontWeight: 'bold'
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '70%'
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        marginRight: 10,
    },
    cardTypeText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginRight: 10,
    },
    cardTypeButton: {
        backgroundColor: '#212121',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 5,
    },
    cardTypeButtonText: {
        color: '#fff',
        fontSize: 16,
    },

    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    checkboxLabel: {
        fontSize: 16,
    },
    checkbox: {
        width: 24,
        height: 24,
        borderWidth: 2,
        borderColor: '#fff813',
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkboxInner: {
        width: 12,
        height: 12,
        borderRadius: 3,
    },
    saveButton: {
        backgroundColor: '#fff813',
        padding: 10,
        borderRadius: 5,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
    },
    modalText: {
        fontSize: 18,
        marginBottom: 20,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    modalButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginHorizontal: 10,
    },
    modalButtonCancel: {
        backgroundColor: 'red',
    },
    modalButtonConfirm: {
        backgroundColor: 'green',
    },
    modalButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
    },
});