import { useState, useEffect } from 'react'

function App() {
  // Aquí guardaremos los productos que lleguen de la base de datos
  const [productos, setProductos] = useState([])

  // useEffect hace que esta función se ejecute automáticamente al abrir la página
  useEffect(() => {
    fetch('http://localhost:3000/api/productos')
      .then(response => response.json())
      .then(data => {
        setProductos(data) // Guardamos los datos en el estado de React
      })
      .catch(error => console.error("Error de conexión:", error))
  }, [])

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Inventario GMC CompuMercado</h1>
      
      <table border="1" cellPadding="10" style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead style={{ backgroundColor: '#f2f2f2' }}>
          <tr>
            <th>Código</th>
            <th>Descripción</th>
            <th>Categoría</th>
            <th>Almacén</th>
            <th>Stock Actual</th>
          </tr>
        </thead>
        <tbody>
          {/* Aquí recorremos el arreglo de productos para crear las filas dinámicamente */}
          {productos.map(producto => (
            <tr key={producto.id_producto}>
              <td>{producto.codigo}</td>
              <td>{producto.producto}</td>
              <td>{producto.categoria}</td>
              <td>{producto.almacen}</td>
              <td>{producto.inventario}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default App
