export function Document() {
    return (
        <div>
            {/* Datos del cliente */}
            <p>Jenny Katerine Osorio Rueda</p>
            <p>Gonzalez Abarca N 24</p>
            <p>33400 Aviles</p>
            <p>Tfno. 602573781</p>
            <p>N.I.E. Y9509223W</p>
            <p>
                e-mail:{" "}
                <a href="mailto:tapiceriarincon2@gmail.com">tapiceriarincon2@gmail.com</a>
            </p>
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
                        <td style={{ width: '7.79569%' }}>&nbsp;</td>
                        <td style={{ width: '51.6667%' }}>
                            <p>Hospital de San Agustin</p>
                            <p>Servicio de Salud del Principado de Asturias</p>
                            <p>Camino de Heroes S/N</p>
                            <p>33400 Aviles</p>

                            {/* Subtabla dentro de la celda */}
                            <table style={{ borderCollapse: 'collapse', width: '100%' }} border="1">
                                <tbody>
                                    <tr>
                                        <td style={{ width: '33.3333%' }}>Asturias</td>
                                        <td style={{ width: '33.3333%' }}>NIF-CIF</td>
                                        <td style={{ width: '33.3333%' }}>Q-8350064-E</td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
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