import { StyleSheet, Text, View, Image, Dimensions, ScrollView } from 'react-native';
import React from 'react';

import Api from "../../api/products.json";



const Details = ({ route }: any) => {
    const { product } = route.params;
    const screenHeight = Dimensions.get('window').height;

    const produto = Api.Products[product];

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={{ alignItems: 'center' }}>
                <Image
                    style={styles.image}
                    source={{ uri: produto.capa }}
                />
                <View style={{ justifyContent: 'space-around' }}>
                    <Text style={styles.title}>{produto.name}</Text>
                </View>
                <Text style={styles.descricao}>{produto.descricao}</Text>
                <Text style={styles.embalagensTitulo}>Possui embalagens de:</Text>
                <Text style={styles.embalagensText}>{produto.embalagens_tamanho}</Text>
                <Image
                    style={styles.misturaImage}
                    source={{ uri: produto.mistura }}
                />
                <Text style={styles.composicaoMisturaTitle}>Composição da mistura:</Text>
                <Text style={styles.composicaoMisturaText}>{produto.info_nutricional}</Text>
            </ScrollView>
        </View>
    )
}

export default Details

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#212121",
        paddingHorizontal: 15,
        paddingVertical: 20
    },
    title: {
        color: "#fff813",
        fontSize: 25,
        fontWeight: 'bold',
        textAlign: 'center',
        paddingBottom: 10
    },
    scrollViewContainer: {
        flexDirection: 'column'
    },
    image: {
        width: 250,
        height: 380
    },
    descricao: {
        color: "#fff813",
        fontSize: 16,
        fontWeight: '600',
        textTransform: 'lowercase'
    },
    embalagensTitulo: {
        marginTop: 10,
        fontSize: 16,
        color: "#fff"
    },
    embalagensText: {
        color: "#fff"
    },
    misturaImage: {

    },
    composicaoMisturaTitle: {
        color: "#fff"
    },
    composicaoMisturaText: {
        color: "#fff"
    }
})