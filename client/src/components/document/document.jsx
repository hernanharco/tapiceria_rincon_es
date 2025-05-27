
import useCompany from '../../hooks/useCompany';
import useClients from '../../hooks/useClients';

export function Document() {

    const { empresas, loading, error } = useCompany();
    const { clientes } = useClients();

    if (loading) return <p>Cargando empresas...</p>;
    if (error) return <p>Error cargando datos</p>;

    // console.log("Datos desde useDataCompany:", empresas);
    // console.log("Datos desde Clientes:", clientes);

    return (
        <div>
            {/* Datos del cliente */}
            {empresas.length > 0 && (
                <>
                    <p>{empresas[0].name}</p>
                    <p>{empresas[0].address}</p>
                    <p>{empresas[0].zip_code} {empresas[0].city}</p>
                    <p>TFNO. {empresas[0].number}</p>
                    <p>N.I.E: {empresas[0].cif}</p>
                    <p>e-mail: {empresas[0].email}</p>
                </>
            )}
            <p>&nbsp;</p>
            <p>FACTURA</p>
            <p>&nbsp;</p>

            {/* Tabla principal */}
            <table style={{ borderCollapse: 'collapse', width: '100%' }} border="1">
                <tbody>
                    <tr>
                        <td style={{ width: '40.5376%' }}>
                            <p>Num. Factura 23-0033</p>
                            <p>Fecha Factura 02/10/203</p>
                            <p>Cod. Cliente</p>
                            <p>Observaciones</p>
                        </td>
                        {/* Tabla de cliente */}
                        <td style={{ width: '7.79569%' }}>&nbsp;</td>
                        <td style={{ width: '51.6667%' }}>
                            {clientes.length > 0 && (
                                <>
                                    <p>{clientes[0].name}</p>
                                    <p>{clientes[0].address}</p>
                                    <p>{clientes[0].zip_code} {clientes[0].city}</p>
                                    <p>TFNO. {clientes[0].number}</p>                                                                      
                                </>
                            )}                            

                            {/* Subtabla dentro de la celda */}
                            <table style={{ borderCollapse: 'collapse', width: '100%' }} border="1">
                                <tbody>
                                    <tr>
                                        <td style={{ width: '33.3333%' }}>Asturias</td>
                                        <td style={{ width: '33.3333%' }}>NIF-CIF</td>
                                        <td style={{ width: '33.3333%' }}>{clientes[0].cif}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </td> {/*termina tabla del cliente*/}
                    </tr>
                </tbody>
            </table>

            <p>&nbsp;</p>

            {/* Tabla de detalles de productos */}
            <table style={{ borderCollapse: 'collapse', width: '100%' }} border="1">
                <tbody>
                    <tr>
                        <td style={{ width: '16.6667%', textAlign: 'center' }}>
                            <strong>Referencia</strong>
                        </td>
                        <td style={{ width: '16.6667%', textAlign: 'center' }}>
                            <strong>Descripcion</strong>
                        </td>
                        <td style={{ width: '16.6667%', textAlign: 'center' }}>
                            <strong>Cantidad</strong>
                        </td>
                        <td style={{ width: '16.6667%', textAlign: 'center' }}>
                            <strong>Precio&nbsp;</strong>
                        </td>
                        <td style={{ width: '16.6667%', textAlign: 'center' }}>
                            <strong>Dto.&nbsp;</strong>
                        </td>
                        <td style={{ width: '16.6667%', textAlign: 'center' }}>
                            <strong>Importe</strong>
                        </td>
                    </tr>
                    <tr>
                        <td style={{ width: '16.6667%' }}>&nbsp;</td>
                        <td style={{ width: '16.6667%' }}>&nbsp;</td>
                        <td style={{ width: '16.6667%' }}>&nbsp;</td>
                        <td style={{ width: '16.6667%' }}>&nbsp;</td>
                        <td style={{ width: '16.6667%' }}>&nbsp;</td>
                        <td style={{ width: '16.6667%' }}>&nbsp;</td>
                    </tr>
                </tbody>
            </table>

            <p>&nbsp;</p>

            {/* Tabla de totales */}
            <table style={{ borderCollapse: 'collapse', width: '100%' }} border="1">
                <tbody>
                    <tr>
                        <td style={{ width: '25%', textAlign: 'center' }}>
                            <em>Subtotal</em>
                        </td>
                        <td style={{ width: '25%', textAlign: 'center' }}>
                            <em>Base Imponible</em>
                        </td>
                        <td style={{ width: '25%', textAlign: 'center' }}>
                            <em>Iva 21%&nbsp;</em>
                        </td>
                        <td style={{ width: '25%', textAlign: 'center' }}>
                            <em>Total</em>
                        </td>
                    </tr>
                    <tr>
                        <td style={{ width: '25%' }}>&nbsp;</td>
                        <td style={{ width: '25%' }}>&nbsp;</td>
                        <td style={{ width: '25%' }}>&nbsp;</td>
                        <td style={{ width: '25%' }}>&nbsp;</td>
                    </tr>
                </tbody>
            </table>

            <p>&nbsp;</p>

            {/* Tabla de forma de pago */}
            <table style={{ borderCollapse: 'collapse', width: '25.4398%' }} border="1">
                <tbody>
                    <tr>
                        <td style={{ width: '100%' }}>Forma de Pago.</td>
                    </tr>
                    <tr>
                        <td style={{ width: '100%' }}>
                            Transferencia<br />
                            BBVA ES980
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}