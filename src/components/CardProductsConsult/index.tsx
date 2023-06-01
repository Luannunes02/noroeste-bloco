import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';

interface CardProps {
    capa: string,
    name: string,
    embalagens_tamanho: string,
    description: string,
    id: any,
    action?: any
}

const CardProductsConsult = (props: CardProps) => {
    const navigation = useNavigation();
    const product = props.id;

    return (
        <View style={styles.container}>
            <Image
                style={styles.capa}
                source={{ uri: props.capa }}
            />
            <View style={styles.rightContent}>
                <View style={styles.nomeEEmgalagensContainer}>
                    <Text style={styles.title}>{props.name}</Text>
                    <Text style={styles.embalagens}>{props.embalagens_tamanho}</Text>
                </View>
                <Text style={styles.descricao}>{props.description}</Text>
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Detalhes" as never, { product } as never)}>
                    <Text style={styles.buttonText}>SABER MAIS</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default CardProductsConsult

const styles = StyleSheet.create({
    container: {
        justifyContent: 'space-around',
        flexDirection: 'row',
        backgroundColor: '#fff813',
        borderRadius: 20,
        padding: 15,
        height: 240,
        marginTop: 20
    },
    capa: {
        flex: 1
    },
    rightContent: {
        width: '60%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    nomeEEmgalagensContainer: {
        backgroundColor: '#212121',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 10
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: "#fff813"
    },
    embalagens: {
        marginTop: 5,
        color: "#fff813"
    },
    descricao: {
        marginTop: 15
    },
    button: {
        backgroundColor: "#212121",
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginTop: 15,
        justifyContent: 'flex-end',
        borderRadius: 5
    },
    buttonText: {
        fontWeight: 'bold',
        fontSize: 16,
        color: "#fff813"
    }
})