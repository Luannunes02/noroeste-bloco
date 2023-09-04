import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';

interface CardProps {
    valor?: string,
    name: string,
    embalagens_tamanho: string,
    description: string,
    id: any,
    action?: any
}

const CardProductsConsultSimple = (props: CardProps) => {
    const navigation = useNavigation();
    const product = props.id;

    return (
        <View style={styles.container}>
            <View style={styles.leftContainer}>
                <Text style={styles.title}>{props.name}</Text>
                {
                    props.valor !== '' ?
                        <Text style={styles.value}>Valor: <Text style={{ color: '#79ff44' }}>{props.valor} R$</Text></Text>
                        :
                        <Text></Text>
                }
            </View>
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
    );
};

export default CardProductsConsultSimple;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: '#3f3f3f', // Cor de fundo
        borderRadius: 10, // Borda arredondada
        paddingVertical: 20, // Espaçamento interno
        paddingHorizontal: 10,
        marginVertical: 10, // Espaçamento vertical entre cartões
        elevation: 3, // Elevação para sombra (Android)
    },
    leftContainer: {
        flex: 1, // Expandir para preencher espaço disponível
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#ffffff', // Cor do texto
    },
    value: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
    },
    description: {
        marginTop: 8,
        fontSize: 14,
        color: '#ccc', // Cor do texto de descrição
    },
    button: {
        backgroundColor: '#fbff07', // Cor do botão
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        alignSelf: 'flex-start', // Alinhar o botão à esquerda
    },
    buttonText: {
        fontWeight: 'bold',
        fontSize: 16,
        color: '#212121', // Cor do texto do botão
    },
});