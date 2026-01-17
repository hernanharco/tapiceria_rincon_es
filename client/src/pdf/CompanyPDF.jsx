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
    justifyContent: 'space-between', 
    marginLeft: 15,
    marginRight: 25,
    paddingLeft: 15,
    paddingRight: 50,
  },
  image: {
    width: 80, 
    height: 80,
    marginRight: 10, 
    resizeMode: 'contain', 
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

export const CompanyPDF = ({ company }) => {
  // Generamos un timestamp para evitar que el PDF use el logo antiguo de la caché
  const logoUrl = company?.logo 
    ? `${company.logo}${company.logo.includes('?') ? '&' : '?'}t=${new Date().getTime()}`
    : null;

  return (
    <View style={styles.container}>
      {/* Información de la empresa */}
      <View>
        <Text style={styles.name}>{company?.name || ''}</Text>
        <Text style={styles.text}>{company?.address || ''}</Text>
        <Text style={styles.text}>
          {company?.zip_code || ''} {company?.city || ''}
        </Text>
        <Text style={styles.text}>TFNO. {company?.number || ''}</Text>
        <Text style={styles.text}>N.I.E: {company?.cif || ''}</Text>
        <Text style={styles.text}>e-mail: {company?.email || ''}</Text>
        {/* Mostramos el IVA si existe en los datos maestros */}
        {company?.iva_comp && (
          <Text style={styles.text}>I.V.A.: {company.iva_comp}%</Text>
        )}
      </View>

      {/* Imagen - Usamos la URL con anti-cache */}
      {logoUrl && (
        <Image 
          style={styles.image} 
          src={logoUrl} 
        />
      )}
    </View>
  );
};