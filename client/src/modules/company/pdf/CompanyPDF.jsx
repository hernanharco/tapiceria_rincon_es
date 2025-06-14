import React from 'react';
import { View, Text, StyleSheet } from '@react-pdf/renderer';

// Estilos del componente
const styles = StyleSheet.create({
  container: {
    border: '1px solid #cccccc',
    borderRadius: 4,
    padding: 8,
    marginBottom: 10
  },
  name: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4
  },
  text: {
    fontSize: 9,
    marginBottom: 2,
    color: '#555'
  }
});

// Componente
export const CompanyPDF = ({ company }) => (
  <View style={styles.container}>
    <Text style={styles.text}>{company.name || ''}</Text>
    <Text style={styles.text}>{company.address || ''}</Text>
    <Text style={styles.text}>{company.zip_code || ''} {company.city || ''}</Text>
    <Text style={styles.text}>TFNO. {company.number || ''}</Text>
    <Text style={styles.text}>N.I.E: {company.cif || ''}</Text>
    <Text style={styles.text}>e-mail: {company.email || ''}</Text>
  </View>
);