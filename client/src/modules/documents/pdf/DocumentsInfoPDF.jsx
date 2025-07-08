import React from 'react';
import { View, Text, StyleSheet } from '@react-pdf/renderer';

// Estilos del PDF
const styles = StyleSheet.create({
    container: {
        marginBottom: 20,
        padding: 10,
        backgroundColor: '#f9f9f9',
        border: '1px solid #eaeaea',
        borderRadius: 4
    },
    title: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 6
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 6
    },
    label: {
        fontSize: 9,
        fontWeight: 'bold',
        color: '#555'
    },
    value: {
        fontSize: 9,
        color: '#333'
    }
});

export const DocumentInfoPDF = ({ document, client, dateShow }) => (
    <View style={styles.container}>            

        {/* Número de presupuesto */}
        <View style={styles.row}>
            <Text style={styles.label}>Num. Presupuesto:</Text>
            <Text style={styles.value}>{document.num_presupuesto || '-'}</Text>
        </View>

        {/* Fecha */}
        <View style={styles.row}>
            <Text style={styles.label}>Fecha:</Text>
            <Text style={styles.value}>{dateShow || '-'}</Text>
        </View>

        {/* Codigo del Cliente */}
        <View style={styles.row}>
            <Text style={styles.label}>Cod. Cliente:</Text>
            <Text style={styles.value}>{client || '-'}</Text>
        </View>

        {/* Observaciones */}
        <View style={styles.row}>
            <Text style={styles.label}>Observaciones:</Text>
            <Text style={styles.value}>{document.observaciones || 'Sin observaciones'}</Text>
        </View>
    </View>
);