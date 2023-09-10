import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { StyleSheet, Text, View, Image, Dimensions } from 'react-native';
import { Table, TableWrapper, Row, Rows, Cell } from 'react-native-table-component';
import { useNavigation } from '@react-navigation/native';
import { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import { ScrollView } from 'react-native-gesture-handler';
import ViewShot from 'react-native-view-shot';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

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
    const [sellerName, setSellerName] = useState<string>('');
    const [textSize, setTextSize] = useState(10.5);
    const screenHeight = Dimensions.get('window').height;
    const tableRef = useRef(null);

    const [tableData, setTableData] = useState([
        [`Razão Social: \n${pedidoSelector.inputClient}`, `Nome Fantasia: \n${pedidoSelector.inputFantasyName}`],
        [`CNPJ: \n${formatCnpj(pedidoSelector.inputCNPJ)}`, `Cidade: \n${pedidoSelector.inputCity}`, `Nome do Contato: \n${pedidoSelector.inputContactName}`],
        [`Bairro: \n${pedidoSelector.inputDistrict}`, `Endereço: \n${pedidoSelector.inputAdress}`],
        [`Condição de Pg: ${pedidoSelector.inputCondiPG}`, `Prazo: ${pedidoSelector.inputPrazo}`],
    ]);

    useEffect(() => {
        getData('vendedor');
    }, []);

    const getData = async (key: string) => {
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
    };

    function formatCnpj(cnpj: string) {
        // Remove todos os caracteres não numéricos
        cnpj = cnpj.replace(/\D/g, '');

        // Aplica a formatação desejada
        cnpj = cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');

        return cnpj;
    }

    const tableHeader = ['Produto', 'Qnt.', 'Un.', 'Total'];

    const renderTableRows = () => {
        const rows = pedidoSelector.produtos.map((product: any, index: any) => {
            const total = (parseInt(product.inputQuantity) * parseFloat(product.value)).toFixed(2).replace('.', '.');
            return [`${product.product}`, `${product.inputQuantity}`, `R$ ${product.value.toFixed(2).replace('.', ',')}`, `${total}`]
        });
        return rows;
    };

    const calculateTotal = () => {
        const total = pedidoSelector.produtos.reduce((sum: number, product: any) => {
            return sum + product.value * product.inputQuantity;
        }, 0);
        return `Total: R$ ${total.toFixed(2).replace('.', ',')}`;
    };

    const handleShare = async () => {
        try {
            if (tableRef.current) {
                // Capture a screenshot of the ScrollView
                const uri = await captureRef(tableRef, {
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
            <ScrollView
                ref={tableRef}
                style={styles.scrollViewContainer}
            >
                <View style={styles.header}>
                    <Image
                        style={styles.logo}
                        source={require('../../assets/noroeste-logo.png')}
                        resizeMode='contain'
                    />
                    <View>
                        <Text style={{ ...styles.headText, fontSize: 10.5 }}>Noroeste Nutrição Animal LTDA</Text>
                        <Text style={{ ...styles.headText, fontSize: 10.5 }}>SHVP, Rua 10 CH 147 LT 19, Brasília - DF</Text>
                        <Text style={{ ...styles.headText, fontSize: 10.5 }}>Telefone: (61) 3597-6322</Text>
                    </View>
                </View>
                <Table borderStyle={styles.tableBorder}>
                    {tableData.map((rowData, index) => (
                        <TableWrapper key={index} style={styles.tableWrapper}>
                            {rowData.map((cellData, cellIndex) => (
                                <Cell
                                    key={cellIndex}
                                    data={cellData}
                                    textStyle={{ ...styles.text, fontSize: 10.5 }}
                                />
                            ))}
                        </TableWrapper>
                    ))}
                </Table>
                <Table style={{ marginTop: 10, marginBottom: 10 }} borderStyle={{ borderWidth: 1, borderColor: '#C1C0B9' }}>
                    <Row data={tableHeader} textStyle={[{ ...styles.textInfoCompany }, { fontWeight: 'bold' }]} flexArr={[2, 0.45, 0.6, 0.7]} />
                    <Rows data={renderTableRows()} textStyle={{ ...styles.text, fontSize: 10.5 }} flexArr={[2, 0.45, 0.6, 0.7]} />
                    <Row data={[calculateTotal()]} textStyle={[{ ...styles.totalText }]} flexArr={[1, 2]} />
                </Table>
                {
                    pedidoSelector.observacao !== null ?
                        <Text style={{ fontSize: 10.5 }}>Observação: {pedidoSelector.observacao}</Text>
                        :
                        <View></View>
                }
                <Text style={{ fontSize: 10.5, marginBottom: 30 }}>Vendedor: {sellerName}</Text>
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
    scrollViewContainer: { padding: 16, backgroundColor: '#fff' },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 10,
    },
    headText: {
        fontWeight: 'bold',
        opacity: 0.8,
    },
    logo: {
        width: 100,
        height: 50,
    },
    text: { paddingVertical: 0.5, marginLeft: 4, textAlign: 'left', backgroundColor: '#fff', textTransform: 'capitalize' },
    textInfoCompany: { paddingVertical: 1, marginLeft: 4, textAlign: 'left', backgroundColor: '#fff' },
    headerText: { fontWeight: 'bold', backgroundColor: '#f0f0f0' },
    totalText: { textAlign: 'center', paddingVertical: 3, backgroundColor: '#e0e0e0', fontWeight: 'bold' },
    tableBorder: { borderWidth: 1, borderColor: '#C1C0B9', backgroundColor: "#fff" },
    tableWrapper: { flexDirection: 'row' },
});
