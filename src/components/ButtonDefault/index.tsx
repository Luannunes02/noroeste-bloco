import { StyleSheet, View, Text, TouchableOpacity } from 'react-native'
import React from 'react'

interface ButtonProps {
    text: String,
    action?: any
}

const ButtonDefault = (props: ButtonProps) => {
    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.button} onPress={props.action}>
                <Text style={styles.title}>{props.text}</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    button: {
        width: '90%',
        height: 50,
        backgroundColor: '#fff813',
        borderRadius: 5,
        marginVertical: '5%',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: "#fff",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.36,
        shadowRadius: 6.68,
        elevation: 13,
    },
    title: {
        fontSize: 17,
        color: '#000',
        fontWeight: 'bold'
    }
})

export default ButtonDefault