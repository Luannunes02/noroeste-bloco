import { StyleSheet, Text, View, Image, Dimensions, ScrollView } from 'react-native';
import React, { useState, useEffect } from 'react';

import LoadingIndicator from '../../components/LoadingIndicator';

const Details = ({ route }: any) => {
    const { product } = route.params;
    const [produto, setProduto] = useState<any>();
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        fetchData();
    }, [])

    const fetchData = async () => {
        try {
            // Substitua a URL abaixo pela URL da sua API
            const response = await fetch('https://api.jsonbin.io/v3/b/64bdb5689d312622a3839e04/latest', {
                method: 'GET',
                headers: {
                    'X-Master-Key': '$2b$10$fTCsCYniOvsCifPdd6ZhG.5X1tU6f8dUnGi0YHNuIVveLDGZvJIjC',
                },
            });

            if (response.status === 200) {
                console.log('zerou')
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

    return (
        <View style={styles.container}>
            {loading ? (
                <View style={styles.loadingContainer}>
                    <LoadingIndicator />
                </View>
            ) : (
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    <Text style={styles.title}>{produto.nome}</Text>
                    <View style={styles.imageContainer}>
                        <Image style={styles.image} source={{ uri: produto.capa }} resizeMode='contain' />
                    </View>
                    <View style={{ backgroundColor: "#212121", borderRadius: 20, paddingHorizontal: 15, paddingVertical: 10 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                            <Text style={styles.valorText}>Preço: R$ {produto.valor.toFixed(2).replace('.', ',')}</Text>
                            <Image style={styles.marcaLogoSmall} source={{ uri: produto.marca_logo }} resizeMode='contain' />
                        </View>

                        <Text style={styles.descricao}>{produto.descricao}</Text>
                    </View>
                    <Text style={{ color: '#000', fontSize: 20, fontWeight: 'bold', marginTop: 20 }}>Foto do Produto:</Text>
                    {
                        produto.marca === 'Biotron' ?
                            <Image style={styles.misturaImageBiotron} source={{ uri: produto.mistura }} />
                            :
                            <Image style={styles.misturaImage} source={{ uri: produto.mistura }} resizeMode='contain' />
                    }
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
});