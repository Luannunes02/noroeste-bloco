import { StyleSheet, Text, View, Image, Dimensions, ScrollView, TouchableOpacity, Share } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import ViewShot, { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

import LoadingIndicator from '../../components/LoadingIndicator';

const Details = ({ route }: any) => {
    const { product } = route.params;
    const [produto, setProduto] = useState<any>();
    const [loading, setLoading] = useState<boolean>(true);
    const [mostrarValor, setMostrarValor] = useState<any>();
    const viewShotRef = useRef(null);

    useEffect(() => {
        fetchData();
        getData('mostrarValor');
    }, []);

    const getData = async (key: string) => {
        switch (key) {
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

    const fetchData = async () => {
        try {
            // Substitua a URL abaixo pela URL da sua API
            const response = await fetch('https://api.jsonbin.io/v3/b/6503a094d972192679c400fc', {
                method: 'GET',
                headers: {
                    'X-Master-Key': '$2b$10$n65OH.qy/q2QSKLBL2eLDeYF2LdnMh3RnpNzLHeV3i5mALn.HsiOW',
                },
            });

            if (response.status === 200) {
                const jsonData = await response.json();
                setProduto(jsonData.record.Products[product]);
                setLoading(false);
            } else {
                console.error('Erro ao buscar dados da API:', response.status);
            }
        } catch (error) {
            console.error('Erro ao buscar dados da API:', error);
        }
    };

    const shareImage = async () => {
        try {
            if (viewShotRef.current) {
                // Capture a screenshot of the ScrollView
                const uri = await captureRef(viewShotRef, {
                    format: 'jpg', // Use 'jpg' ou 'png', dependendo da sua preferência
                    quality: 1, // Qualidade da imagem (0 a 1)
                    snapshotContentContainer: true,
                });

                // Compartilhe a imagem capturada
                await Sharing.shareAsync(uri);
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <View style={styles.container}>
            {loading ? (
                <View style={styles.loadingContainer}>
                    <LoadingIndicator color='black' />
                </View>
            ) : (
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    <Text style={styles.title}>{produto.nome}</Text>
                    <View style={styles.imageContainer}>
                        <Image style={styles.image} source={{ uri: produto.capa }} resizeMode='contain' />
                    </View>
                    <View style={{ backgroundColor: "#212121", borderRadius: 20, paddingHorizontal: 15, paddingVertical: 10 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                            {
                                mostrarValor == 'false' ?
                                    <></>
                                    :
                                    <Text style={styles.valorText}>Preço: R$ {produto.valor.toFixed(2).replace('.', ',')}</Text>
                            }

                            {
                                produto.marca === 'Biotron' ?
                                    <Image style={styles.marcaLogoSmall} source={require('../../assets/biotron_logo.png')} resizeMode='contain' />
                                    :
                                    <Image style={styles.marcaLogoSmall} source={require('../../assets/nutrari_logo_largue.png')} resizeMode='contain' />
                            }
                        </View>

                        <Text style={styles.descricao}>{produto.descricao}</Text>
                    </View>
                    <Text style={{ color: '#000', fontSize: 20, fontWeight: 'bold', marginTop: 20 }}>Foto do Produto:</Text>
                    {
                        produto.marca === 'Biotron' ?
                            <ScrollView ref={viewShotRef} style={{ backgroundColor: "#fff" }}>
                                <Image style={styles.misturaImageBiotron} source={{ uri: produto.mistura }} resizeMode='contain' />
                            </ScrollView>
                            :
                            <ScrollView ref={viewShotRef} style={{ backgroundColor: "#fff" }}>
                                <Image style={styles.misturaImage} source={{ uri: produto.mistura }} resizeMode='cover' />
                            </ScrollView>

                    }
                    <TouchableOpacity
                        style={styles.shareButton}
                        onPress={shareImage}
                    >
                        <FontAwesome name="share-alt-square" size={50} color="#212121" />
                    </TouchableOpacity>
                </ScrollView>
            )}
        </View>
    );
};

export default Details;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        paddingHorizontal: 15,
        paddingVertical: 20,
    },
    loadingContainer: {
        flex: 1,
        backgroundColor: "#ffffff",
        justifyContent: "center",
        alignItems: "center",
    },
    scrollContainer: {
        alignItems: 'center',
    },
    title: {
        color: "#fff813",
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        backgroundColor: "#212121",
        paddingHorizontal: 40,
        paddingVertical: 10,
        borderRadius: 15,
        textShadowColor: "#000",
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
    imageContainer: {
        alignItems: 'center',
    },
    image: {
        width: 250,
        height: 380,
    },
    productImageText: {
        color: "#fff813",
        fontSize: 16,
        fontWeight: '600',
    },
    valorText: {
        color: "#79ff44",
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 20,
    },
    descricao: {
        color: "#fff",
        fontSize: 16,
        fontWeight: '600',
        marginTop: 20,
    },
    infoContainer: {
        marginTop: 20,
        alignItems: 'center',
        backgroundColor: "#fff",
        borderRadius: 200,
        paddingVertical: 25,
        paddingHorizontal: 30
    },
    marcaText: {
        color: "#002505",
        fontSize: 20,
        fontWeight: 'bold',
    },
    marcaLogo: {
        width: 100,
        height: 100,
    },
    marcaLogoSmall: {
        width: 45,
        height: 45,
        padding: 7,
        backgroundColor: '#fff',
        borderRadius: 30,
        marginTop: 10
    },
    misturaImageBiotron: {
        width: 250,
        height: 250,
        marginTop: 20,
    },
    misturaImage: {
        width: 250,
        height: 250,
        marginTop: 20,
        borderRadius: 200
    },
    shareButton: {
        backgroundColor: '#ffffff', // Cor de destaque
        borderRadius: 5,
        alignItems: 'center',
        margin: 10,
    },
    shareButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});