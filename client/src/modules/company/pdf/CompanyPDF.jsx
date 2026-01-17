import React from 'react';
import { View, Text, Image, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  container: {
    border: '1px solid #cccccc',
    borderRadius: 4,
    padding: 8,
    marginBottom: 10,
    flexDirection: 'row', // Alineamos imagen y texto horizontalmente
    alignItems: 'center', // Centramos verticalmente
    justifyContent: 'space-between', // Opcional: para espaciar entre View e Image
    marginLeft: 15, // 👈 Margen izquierdo externo
    marginRight: 25, // 👈 Margen derecho externo
    paddingLeft: 15, // 👈 Margen interno izquierdo
    paddingRight: 50, // 👈 Margen interno derecho
  },
  image: {
    width: 80, // Tamaño de la imagen
    height: 80,
    marginRight: 10, // Espacio entre imagen y texto
    resizeMode: 'contain', // Ajusta el modo de redimensionamiento
  },
  name: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  text: {
    fontSize: 9,
    marginBottom: 2,
    color: '#555',
  },
});

export const CompanyPDF = ({ company }) => (
  <View style={styles.container}>
    {/* Información de la empresa */}
    <View>
      <Text style={styles.name}>{company.name || ''}</Text>
      <Text style={styles.text}>{company.address || ''}</Text>
      <Text style={styles.text}>
        {company.zip_code || ''} {company.city || ''}
      </Text>
      <Text style={styles.text}>TFNO. {company.number || ''}</Text>
      <Text style={styles.text}>N.I.E: {company.cif || ''}</Text>
      <Text style={styles.text}>e-mail: {company.email || ''}</Text>
    </View>
    {/* Imagen - Usamos el logo dinámico de la empresa */}
    {company.logo && <Image style={styles.image} src={company.logo} />}
  </View>
);
