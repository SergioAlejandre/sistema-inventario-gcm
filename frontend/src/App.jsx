import { useState, useEffect } from 'react';
import { TablaInventario } from './components/TablaInventario';
import { FormularioProducto } from './components/FormularioProducto';
import { FormularioMovimiento } from './components/FormularioMovimiento'; // Asegúrate de tener este archivo creado

function App() {
  const [productos, setProductos] = useState([]);
  
  // Manejo independiente de las ventanas emergentes
  const [mostrarFormProducto, setMostrarFormProducto] = useState(false);
  const [mostrarFormMovimiento, setMostrarFormMovimiento] = useState(false);

  const cargarProductos = () => {
    fetch('http://localhost:3000/api/productos')
      .then(response => response.json())
      .then(data => setProductos(data))
      .catch(error => console.error("Error de conexión:", error));
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '1000px', margin: '0 auto' }}>
      
      {/* CABECERA */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ color: 'white' }}>Inventario GMC CompuMercado</h1>
        
        {/* GRUPO DE BOTONES (Aquí está el azul y el verde) */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            onClick={() => setMostrarFormMovimiento(true)} 
            style={{ padding: '10px 20px', backgroundColor: '#0056b3', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '15px', fontWeight: 'bold' }}>
            ↑↓ Registrar Movimiento
          </button>
          
          <button 
            onClick={() => setMostrarFormProducto(true)} 
            style={{ padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '15px', fontWeight: 'bold' }}>
            + Nuevo Insumo
          </button>
        </div>
      </div>
      
      {/* RENDERIZADO CONDICIONAL DE LOS MODALES */}
      {mostrarFormProducto && (
        <FormularioProducto cerrarModal={() => setMostrarFormProducto(false)} onProductoGuardado={cargarProductos} />
      )}

      {mostrarFormMovimiento && (
        <FormularioMovimiento productos={productos} cerrarModal={() => setMostrarFormMovimiento(false)} onMovimientoGuardado={cargarProductos} />
      )}

      {/* COMPONENTE DE LA TABLA */}
      <TablaInventario productos={productos} />
      
    </div>
  );
}

export default App;