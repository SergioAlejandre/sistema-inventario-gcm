// src/components/TablaMovimientos.jsx

export function TablaMovimientos({ movimientos }) {
  // Si no hay movimientos aún, mostramos un mensaje limpio
  if (movimientos.length === 0) {
    return (
      <div style={{ padding: '30px', textAlign: 'center', backgroundColor: 'white', borderRadius: '8px', color: '#666' }}>
        No hay movimientos registrados en el historial todavía.
      </div>
    );
  }

  return (
    <div style={{ overflowX: 'auto', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <table style={{ borderCollapse: 'collapse', width: '100%', textAlign: 'left' }}>
        <thead style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #dee2e6' }}>
          <tr>
            <th style={{ padding: '12px 15px', color: '#333' }}>Fecha y Hora</th>
            <th style={{ padding: '12px 15px', color: '#333' }}>Código</th>
            <th style={{ padding: '12px 15px', color: '#333' }}>Descripción</th>
            <th style={{ padding: '12px 15px', color: '#333', textAlign: 'center' }}>Tipo</th>
            <th style={{ padding: '12px 15px', color: '#333', textAlign: 'center' }}>Cant.</th>
            <th style={{ padding: '12px 15px', color: '#333' }}>Observaciones</th>
          </tr>
        </thead>
        <tbody>
          {movimientos.map(mov => {
            // Transformamos la fecha cruda de MySQL a formato local de México
            const fechaFormateada = new Date(mov.fecha_movimiento).toLocaleString('es-MX', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            });

            return (
              <tr key={mov.id_movimiento} style={{ borderBottom: '1px solid #dee2e6' }}>
                <td style={{ padding: '12px 15px', color: '#555', fontSize: '14px' }}>{fechaFormateada}</td>
                <td style={{ padding: '12px 15px', color: '#333', fontWeight: 'bold' }}>{mov.codigo}</td>
                <td style={{ padding: '12px 15px', color: '#555' }}>{mov.descripcion}</td>
                
                {/* Coloreamos dinámicamente si es Entrada (Verde) o Salida (Rojo) */}
                <td style={{ 
                  padding: '12px 15px', 
                  textAlign: 'center',
                  fontWeight: 'bold', 
                  color: mov.tipo_movimiento === 'Entrada' ? '#28a745' : '#dc3545' 
                }}>
                  {mov.tipo_movimiento === 'Entrada' ? '↑ Entrada' : '↓ Salida'}
                </td>
                
                <td style={{ padding: '12px 15px', color: '#333', fontWeight: 'bold', textAlign: 'center' }}>
                  {mov.cantidad}
                </td>
                <td style={{ padding: '12px 15px', color: '#666', fontStyle: 'italic', fontSize: '14px' }}>
                  {mov.observaciones}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}