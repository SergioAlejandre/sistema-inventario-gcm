// src/components/FormularioMovimiento.jsx
import { useState } from 'react';

export function FormularioMovimiento({ productos, cerrarModal, onMovimientoGuardado }) {
  const [formulario, setFormulario] = useState({
    id_producto: '',
    tipo_movimiento: 'Entrada',
    cantidad: 1,
    observaciones: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormulario({ ...formulario, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validación: Obligar a seleccionar un producto
    if (formulario.id_producto === '') {
      alert("Por favor, selecciona un producto.");
      return;
    }

    fetch('http://localhost:3000/api/movimientos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formulario)
    })
    .then(response => response.json())
    .then(() => {
      alert("¡Movimiento registrado correctamente!");
      onMovimientoGuardado();
      cerrarModal();
    })
    .catch(error => console.error("Error al guardar movimiento:", error));
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
      <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '8px', width: '400px', position: 'relative' }}>
        
        <button onClick={cerrarModal} style={{ position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer' }}>✖</button>

        <h3 style={{ marginTop: 0, color: '#0056b3' }}>Registrar Movimiento</h3>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          
          <div>
            <label>Seleccionar Insumo:</label><br/>
            <select name="id_producto" value={formulario.id_producto} onChange={handleChange} required style={{width: '100%', padding: '8px', marginTop: '5px'}}>
              <option value="">-- Elige un producto --</option>
              {/* Iteramos los productos para llenar las opciones */}
              {productos.map(p => (
                <option key={p.id_producto} value={p.id_producto}>
                  {p.codigo} - {p.producto}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', gap: '15px' }}>
            <div style={{ flex: 1 }}>
              <label>Tipo de Acción:</label><br/>
              <select name="tipo_movimiento" value={formulario.tipo_movimiento} onChange={handleChange} style={{width: '100%', padding: '8px', marginTop: '5px', fontWeight: 'bold', color: formulario.tipo_movimiento === 'Entrada' ? '#28a745' : '#dc3545'}}>
                <option value="Entrada">Entrada (+)</option>
                <option value="Salida">Salida (-)</option>
              </select>
            </div>
            <div style={{ width: '80px' }}>
              <label>Cantidad:</label><br/>
              <input type="number" name="cantidad" value={formulario.cantidad} onChange={handleChange} min="1" required style={{width: '100%', padding: '8px', marginTop: '5px'}} />
            </div>
          </div>

          <div>
            <label>Observaciones / Motivo:</label><br/>
            <textarea name="observaciones" value={formulario.observaciones} onChange={handleChange} placeholder="Ej. Compra, Ajuste por daño, Uso en taller..." rows="3" style={{width: '100%', padding: '8px', marginTop: '5px', resize: 'none'}}></textarea>
          </div>

          <div style={{ textAlign: 'right', marginTop: '10px' }}>
            <button type="button" onClick={cerrarModal} style={{ padding: '10px 15px', backgroundColor: '#ccc', border: 'none', borderRadius: '5px', cursor: 'pointer', marginRight: '10px' }}>Cancelar</button>
            <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#0056b3', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Procesar Stock</button>
          </div>
        </form>
      </div>
    </div>
  );
}