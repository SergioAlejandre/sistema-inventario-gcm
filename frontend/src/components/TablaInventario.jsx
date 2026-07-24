// src/components/TablaInventario.jsx

export function TablaInventario({ productos, onEditar }) {
  return (
    <div style={{ overflowX: 'auto', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <table style={{ borderCollapse: 'collapse', width: '100%', textAlign: 'left' }}>
        <thead style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #dee2e6' }}>
          <tr>
            <th style={{ padding: '12px 15px', color: '#333' }}>Código</th>
            <th style={{ padding: '12px 15px', color: '#333' }}>Descripción</th>
            <th style={{ padding: '12px 15px', color: '#333' }}>Presentación</th> {/* NUEVA COLUMNA */}
            <th style={{ padding: '12px 15px', color: '#333' }}>Categoría</th>
            <th style={{ padding: '12px 15px', color: '#333' }}>Almacén</th>
            <th style={{ padding: '12px 15px', color: '#333' }}>Stock</th>
            <th style={{ padding: '12px 15px', textAlign: 'center', color: '#333' }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.map(producto => (
            <tr key={producto.id_producto} style={{ borderBottom: '1px solid #dee2e6' }}>
              <td style={{ padding: '12px 15px', color: '#555' }}>{producto.codigo}</td>
              <td style={{ padding: '12px 15px', color: '#555' }}>{producto.producto}</td>
              <td style={{ padding: '12px 15px', color: '#555' }}>{producto.presentacion}</td> {/* NUEVO DATO */}
              <td style={{ padding: '12px 15px', color: '#555' }}>{producto.categoria}</td>
              <td style={{ padding: '12px 15px', color: '#555' }}>{producto.almacen}</td>
              <td style={{ padding: '12px 15px', fontWeight: 'bold', color: producto.inventario <= producto.stock_minimo ? '#dc3545' : '#28a745' }}>
                {producto.inventario}
              </td>
              <td style={{ padding: '12px 15px', textAlign: 'center' }}>
                <button 
                  onClick={() => onEditar(producto)} 
                  style={{ backgroundColor: 'transparent', border: 'none', cursor: 'pointer', fontSize: '18px' }}
                  title="Editar Insumo"
                >
                  ✏️
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}