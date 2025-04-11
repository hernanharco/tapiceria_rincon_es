import React from 'react';
import './App.css'; // You'll need to create this CSS file

const Invoice = () => {
  return (
    <div className="invoice-container">
      {/* Header Section */}
      <div className="header-section">
        <div className="company-info">
          <h1>JENNY KATERINE OSORIO RUEDA - Rome comfy</h1>
          <p>GONZALES ABARCA Nº 24 – Código 535</p>
          <p>33400 AVILES 2.1ª - Cod. 1 city</p>
          <p>TFNO. 602573781nomba</p>
          <p>N.I.E V9509223W N.C.- ClF- Jnl</p>
          <p>e-mail: tapiceriarincon2@gmail.com e-mail</p>
        </div>
      </div>

      {/* Invoice Title */}
      <div className="invoice-title">
        <h2>FACTURA</h2>
        <p>name-document</p>
      </div>

      {/* Client Info */}
      <div className="client-info">
        <div className="client-header">
          <h3>Jata-climi</h3>
        </div>
        <div className="invoice-meta">
          <div className="meta-row">
            <span>Noim:</span>
            <span>23-0033</span>
          </div>
          <div className="meta-row">
            <span>Fecha factura</span>
            <span>02/10/2023</span>
          </div>
        </div>
        <div className="client-details">
          <h4>HOSPITAL DE SAN AGUSTIN</h4>
          <p>SERVICIO DE SALUD DEL PRINCIPADO DE ASTURIAS</p>
          <p>CAMINO DE HEROS S/N</p>
          <p>Observaciones</p>
          <p>33400 AVILES</p>
          <p>ASTURIAS</p>
          <div className="client-id">
            <span>NIF. - CIF</span>
            <span>Q-8350064-E</span>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div className="items-table">
        <div className="table-header">
          <span>Referencia</span>
          <span>Descripción</span>
          <span>Cantidad</span>
          <span>Precio</span>
          <span>Dto.</span>
          <span>Importe</span>
        </div>
        
        <div className="table-row">
          <span>ALBARAN 25-0023-FECHA 28/09/2023</span>
          <span>TAPIZADO DE ASIENTO BUTACA - PEDIATRIA</span>
          <span>2</span>
          <span>€32,00</span>
          <span></span>
          <span>€64,00</span>
        </div>
        
        <div className="table-row">
          <span></span>
          <span>ARMAZON DE HIERRO COLOR GRANATE</span>
          <span>2</span>
          <span>€57,00</span>
          <span></span>
          <span>€114,00</span>
        </div>
        
        <div className="table-row">
          <span></span>
          <span>MATERIALES</span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
        
        <div className="table-row">
          <span></span>
          <span>MANO DE OBRA</span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
        
        {/* Additional rows... */}
        <div className="table-row">
          <span></span>
          <span>TAPIZADO RESPALDO BUTACA - PEDIATRIA</span>
          <span>1</span>
          <span>€32,00</span>
          <span></span>
          <span>€32,00</span>
        </div>
        
        <div className="table-row">
          <span></span>
          <span>ARMAZON DE HIERRO COLOR GRANATE</span>
          <span>1</span>
          <span>€57,00</span>
          <span></span>
          <span>€57,00</span>
        </div>
        
        {/* More rows... */}
        <div className="table-row">
          <span></span>
          <span>TAPIZADO SILLON NEGRO</span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
        
        <div className="table-row">
          <span></span>
          <span>MATERIAL ESPECIAL GERIATRICO</span>
          <span>1</span>
          <span>€21,00</span>
          <span></span>
          <span>€21,00</span>
        </div>
        
        {/* Continue with all the rows from the invoice... */}
      </div>

      {/* Totals Section */}
      <div className="totals-section">
        <div className="totals-row">
          <span>Subtotal</span>
          <span>Base imponible</span>
        </div>
        <div className="totals-row">
          <span>€358,00</span>
          <span>€358,00</span>
          <span>Iva 21 %</span>
          <span>Total</span>
        </div>
        <div className="totals-row">
          <span>Forma de pago:</span>
          <span></span>
          <span>€75,18</span>
          <span>€433,18</span>
        </div>
      </div>

      {/* Payment Info */}
      <div className="payment-info">
        <p>TRANSFERENCIA</p>
        <p>BBVA E59801820606870201760037</p>
      </div>
    </div>
  );
};

export default Invoice;