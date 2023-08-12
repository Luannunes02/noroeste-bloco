import React, { useState, useRef } from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { Table, Row, Rows } from 'react-native-table-component';
import { useNavigation } from '@react-navigation/native';
import { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import { ScrollView } from 'react-native-gesture-handler';

import {
    updateTodosPedidos,
    updatePedido,
} from "../../store/slices/localizationSlice";
import { useSelector, useDispatch } from "react-redux";

import ButtonDefault from '../../components/ButtonDefault';

export default function VisualizarPedido() {
    const pedidoSelector = useSelector((state: any) => state.pedido);
    const [scrollViewHeight, setScrollViewHeight] = useState(0);
    const [haveData, setHaveData] = useState(false);

    const [tableData, setTableData] = useState([
        ['Razão Social', `${pedidoSelector.inputClient}`],
        ['Nome Fantasia', `${pedidoSelector.inputFantasyName}`],
        ['CNPJ', `${pedidoSelector.inputCNPJ}`],
        ['Cidade', `${pedidoSelector.inputCity}`],
        ['Bairro', `${pedidoSelector.inputDistrict}`],
        ['Endereço', `${pedidoSelector.inputAdress}`],
        ['Nome do Contato', `${pedidoSelector.inputContactName}`],
        ['Condição de Pagamento', `${pedidoSelector.inputCondiPG}`],
        ['Prazo de Pagamento', `${pedidoSelector.inputPrazo}`]
    ]);

    const tableHeader = ['Produto', 'Quantidade', 'Valor'];

    const renderTableRows = () => {
        const rows = pedidoSelector.produtos.map((product: any, index: any) => {
            return [`${product.product}`, `${product.inputQuantity}`, `R$ ${product.value.toFixed(2).replace('.', ',')}`,]
        });
        return rows;
    };

    const calculateTotal = () => {
        const total = pedidoSelector.produtos.reduce((sum: number, product: any) => {
            return sum + product.value * product.inputQuantity;
        }, 0);
        return `Total: R$ ${total.toFixed(2).replace('.', ',')}`;
    };

    const tableRef = useRef(null);

    const handleLayout = (event: any) => {
        const { height } = event.nativeEvent.layout;
        setScrollViewHeight(height);
    };

    const handleShare = async () => {
        try {
            const uri = await captureRef(tableRef, {
                format: 'png',
                quality: 0.9,
                height: scrollViewHeight,
            });

            await Sharing.shareAsync(uri);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView ref={tableRef} onLayout={handleLayout} style={styles.scrollViewContainer}>
                <View style={styles.header}>
                    <Image
                        style={styles.logo}
                        source={require('../../assets/noroeste-logo.png')}
                    />
                    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={styles.headText}>Noroeste Nutrição Animal LTDA</Text>
                        <Text style={styles.headText}>SHVP - Rua 10 CH 147 LT 19</Text>
                        <Text style={styles.headText}>Brasília - DF</Text>
                        <Text style={styles.headText}>(61) 3597-6322</Text>
                    </View>
                </View>
                <Table borderStyle={{ borderWidth: 1, borderColor: '#C1C0B9' }}>
                    <Rows data={tableData} textStyle={{ ...styles.text }} flexArr={[1, 2]} />
                </Table>
                <Table style={{ marginTop: 50, marginBottom: 50 }} borderStyle={{ borderWidth: 1, borderColor: '#C1C0B9' }}>
                    <Row data={tableHeader} textStyle={[{ ...styles.text }, { fontWeight: 'bold' }]} flexArr={[1, 2]} />
                    <Rows data={renderTableRows()} textStyle={{ ...styles.text }} flexArr={[1, 2]} />
                    <Row data={[calculateTotal()]} textStyle={[{ ...styles.text }, { fontWeight: 'bold' }]} flexArr={[1, 2]} />
                </Table>
            </ScrollView>
            <ButtonDefault
                text="Compartilhar Pedido"
                action={handleShare}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    scrollViewContainer: { flex: 1, padding: 16 },
    header: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: '#000',
        borderWidth: 1,
        paddingVertical: 10,
        marginBottom: 30,
        marginTop: 20
    },
    headText: {
        fontSize: 13,
        fontWeight: 'bold',
        opacity: 0.8
    },
    logo: {
        width: 190,
        height: 100
    },
    text: { margin: 6, textAlign: 'center', backgroundColor: '#fff' },
    total: { alignSelf: 'flex-end', marginTop: 20, fontSize: 16, fontWeight: 'bold', color: 'green', paddingBottom: 200 }
});
