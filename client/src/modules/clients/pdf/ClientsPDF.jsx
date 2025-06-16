
import {
    View,
    Text,    
} from '@react-pdf/renderer';

// Estilos del componente
const styles = {
    container: {
        marginBottom: 20,
        padding: 10,
        backgroundColor: '#f9f9f9',
        border: '1px solid #eaeaea',
        borderRadius: 4
    },
    name: {
        fontSize: 9,
        fontWeight: 'bold',
        color: '#333'
    },
    text: {
        fontSize: 9,
        color: '#555'
    },
    table: {
        marginTop: 6,
        border: '1px solid #cccccc'
    },
    tableRow: {
        flexDirection: 'row'
    },
    tableCell: {
        flex: 1,
        padding: 4,
        fontSize: 8,
        borderBottom: '1px solid #cccccc',
        borderRight: '1px solid #cccccc'
    }
};

export const ClientsPDF = ({ client }) => {
    if (!client) return null;

    return (
        <View style={styles.container}>
            {/* Nombre del cliente */}
            <Text style={styles.text}>{client.name}</Text>

            {/* Dirección */}
            <Text style={styles.text}>{client.address}</Text>

            {/* Código postal y ciudad */}
            <Text style={styles.text}>{client.zip_code} {client.city}</Text>

            {/* Teléfono */}
            <Text style={styles.text}>TFNO. {client.number}</Text>

            {/* Tabla simple */}
            <View style={styles.table}>
                <View style={styles.tableRow}>
                    <Text style={styles.tableCell}>Asturias</Text>
                    <Text style={styles.tableCell}>NIF-CIF</Text>
                    <Text style={styles.tableCell}>{client.cif || '-'}</Text>
                </View>
            </View>
        </View>
    );
};