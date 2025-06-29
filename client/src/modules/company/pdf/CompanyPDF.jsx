import React from 'react';
import { View, Text, Image, StyleSheet } from '@react-pdf/renderer'; // Importamos Image

// Estilos del componente
const styles = StyleSheet.create({
  container: {
    border: '1px solid #cccccc',
    borderRadius: 4,
    padding: 8,
    marginBottom: 10,
    flexDirection: 'row', // Alineamos imagen y texto horizontalmente
    alignItems: 'center'  // Centramos verticalmente
  },
  image: {
    width: 50,       // Tamaño de la imagen
    height: 50,
    marginRight: 10  // Espacio entre imagen y texto
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
        
    {/* Información de la empresa */}
    <View>
      <Text style={styles.name}>{company.name || ''}</Text>
      <Text style={styles.text}>{company.address || ''}</Text>
      <Text style={styles.text}>{company.zip_code || ''} {company.city || ''}</Text>
      <Text style={styles.text}>TFNO. {company.number || ''}</Text>
      <Text style={styles.text}>N.I.E: {company.cif || ''}</Text>
      <Text style={styles.text}>e-mail: {company.email || ''}</Text>
    </View>

    {/* Imagen */}
    {company.logo && <Image style={styles.image} src="/images/imgtapiceriarincon.jpg" />}
    
  </View>
);