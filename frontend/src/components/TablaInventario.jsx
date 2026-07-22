// src/components/TablaInventario.jsx

export function TablaInventario({ productos }) {
  return (
    <div style={{ overflowX: 'auto', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <table style={{ borderCollapse: 'collapse', width: '100%', textAlign: 'left' }}>
        <thead style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #dee2e6' }}>
          <tr>
            <th style={{ padding: '12px 15px' }}>Código</th>
            <th style={{ padding: '12px 15px' }}>Descripción</th>
            <th style={{ padding: '12px 15px' }}>Categoría</th>
            <th style={{ padding: '12px 15px' }}>Almacén</th>
            <th style={{ padding: '12px 15px' }}>Stock Actual</th>
          </tr>
        </thead>
        <tbody>
          {productos.map(producto => (
            <tr key={producto.id_producto} style={{ borderBottom: '1px solid #dee2e6' }}>
              <td style={{ padding: '12px 15px' }}>{producto.codigo}</td>
              <td style={{ padding: '12px 15px' }}>{producto.producto}</td>
              <td style={{ padding: '12px 15px' }}>{producto.categoria}</td>
              <td style={{ padding: '12px 15px' }}>{producto.almacen}</td>
              <td style={{ padding: '12px 15px', fontWeight: 'bold', color: producto.inventario <= producto.stock_minimo ? '#dc3545' : '#28a745' }}>
                {producto.inventario}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}