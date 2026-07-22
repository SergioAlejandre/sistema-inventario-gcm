// src/components/FormularioProducto.jsx
import { useState } from 'react';

export function FormularioProducto({ cerrarModal, onProductoGuardado }) {
  const [formulario, setFormulario] = useState({
    codigo: '',
    producto: '',
    presentacion: 'Caja',
    categoria: 'Toner',
    almacen: 'Almacén 1',
    stock_minimo: 1,
    inventario: 0, // Siempre inicia en 0 por seguridad
    solicitar: 0
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormulario({ ...formulario, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch('http://localhost:3000/api/productos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formulario)
    })
    .then(response => response.json())
    .then(() => {
      alert("¡Producto creado! Recuerda registrar su entrada para agregar stock.");
      onProductoGuardado(); 
      cerrarModal(); 
    })
    .catch(error => console.error("Error al guardar:", error));
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', 
      backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', 
      alignItems: 'center', zIndex: 1000
    }}>
      <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '8px', width: '500px', position: 'relative' }}>
        
        <button onClick={cerrarModal} style={{ position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer' }}>✖</button>

        <h3 style={{ marginTop: 0 }}>Ficha de Nuevo Insumo</h3>
        <p style={{ fontSize: '13px', color: '#666', marginTop: '-10px', marginBottom: '20px' }}>
          *El stock inicial será 0. Registre una entrada en el panel principal.
        </p>
        
        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          <div><label>Código:</label><br/><input type="text" name="codigo" value={formulario.codigo} onChange={handleChange} required style={{width: '90%', padding: '6px'}} /></div>
          <div><label>Producto:</label><br/><input type="text" name="producto" value={formulario.producto} onChange={handleChange} required style={{width: '90%', padding: '6px'}} /></div>
          
          <div>
            <label>Presentación:</label><br/>
            <select name="presentacion" value={formulario.presentacion} onChange={handleChange} style={{width: '95%', padding: '6px'}}>
              <option value="Caja">Caja</option>
              <option value="Pieza">Pieza</option>
            </select>
          </div>
          <div>
            <label>Categoría:</label><br/>
            <select name="categoria" value={formulario.categoria} onChange={handleChange} style={{width: '95%', padding: '6px'}}>
              <option value="Toner">Toner</option>
              <option value="DRUM">DRUM</option>
              <option value="Tinta">Tinta</option>
              <option value="Refacción">Refacción</option>
            </select>
          </div>
          
          <div>
            <label>Almacén:</label><br/>
            <select name="almacen" value={formulario.almacen} onChange={handleChange} style={{width: '95%', padding: '6px'}}>
              <option value="Almacén 1">Almacén 1</option>
              <option value="Almacén 2">Almacén 2</option>
            </select>
          </div>
          <div>
            <label>Stock Mínimo (Alerta):</label><br/>
            <input type="number" name="stock_minimo" value={formulario.stock_minimo} onChange={handleChange} min="1" required style={{width: '90%', padding: '6px'}} />
          </div>

          <div style={{ gridColumn: 'span 2', textAlign: 'right', marginTop: '20px' }}>
            <button type="button" onClick={cerrarModal} style={{ padding: '10px 15px', backgroundColor: '#ccc', border: 'none', borderRadius: '5px', cursor: 'pointer', marginRight: '10px' }}>Cancelar</button>
            <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#0056b3', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Guardar Ficha</button>
          </div>
        </form>
      </div>
    </div>
  );
}