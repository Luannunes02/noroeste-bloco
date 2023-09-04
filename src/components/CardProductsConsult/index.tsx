import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';

interface CardProps {
    capa: string,
    name: string,
    embalagens_tamanho: string,
    description: string,
    id: any,
    action?: any,
    valor?: any
}

const CardProductsConsult = (props: CardProps) => {
    const navigation = useNavigation();
    const product = props.id;

    return (
        <View style={styles.container}>
            <Image style={styles.capa} source={{ uri: props.capa }} />
            <View style={styles.rightContent}>
                <View style={styles.nomeEEmbalagensContainer}>
                    <Text style={styles.title}>{props.name}</Text>
                </View>
                <Text style={styles.descricao}>{props.description}</Text>
                {
                    props.valor !== '' ?
                        <Text style={styles.value}><Text style={{ color: '#fff' }}>Por</Text> {props.valor.toFixed(2).replace('.', ',')} R$</Text>
                        :
                        <View style={{ marginTop: 15 }}></View>
                }
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => {
                        const route = ['Detalhes', { product }];
                        navigation.navigate(...(route as never));
                    }}
                >
                    <Text style={styles.buttonText}>SABER MAIS</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default CardProductsConsult;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: '#fbff07', // Fundo amarelo
        borderRadius: 15,
        padding: 20,
        marginVertical: 20,
        height: 260,
        alignItems: 'center',
    },
    capa: {
        flex: 1,
        height: '100%',
        borderRadius: 15,
    },
    rightContent: {
        flex: 1,
        marginLeft: 20,
    },
    nomeEEmbalagensContainer: {
        backgroundColor: 'rgba(0, 0, 0, 0.6)', // Fundo preto com transparência
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
        marginBottom: 10,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff', // Texto branco
    },
    descricao: {
        fontSize: 14,
        color: '#000',
        textTransform: 'lowercase'
    },
    value: {
        fontSize: 17,
        color: '#79ff44',
        fontWeight: 'bold',
        marginBottom: 10,
        padding: 5,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        borderRadius: 10
    },
    button: {
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        alignSelf: 'flex-start',
    },
    buttonText: {
        fontWeight: 'bold',
        fontSize: 16,
        color: '#fff',
    },
});