// src/App.jsx
import { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; // Herramienta para dibujar tablas en el PDF

import { TablaInventario } from './components/TablaInventario.jsx';
import { FormularioProducto } from './components/FormularioProducto.jsx';
import { FormularioMovimiento } from './components/FormularioMovimiento.jsx';
import { FormularioEdicion } from './components/FormularioEdicion.jsx';
import { TablaMovimientos } from './components/TablaMovimientos.jsx';
import { CATEGORIAS, ALMACENES } from './utils/catalogos.js';

function App() {
  const [productos, setProductos] = useState([]);
  const [movimientos, setMovimientos] = useState([]); 

  const [vistaActiva, setVistaActiva] = useState('inventario'); 

  // Modales
  const [mostrarFormProducto, setMostrarFormProducto] = useState(false);
  const [mostrarFormMovimiento, setMostrarFormMovimiento] = useState(false);
  const [mostrarFormEdicion, setMostrarFormEdicion] = useState(false);
  const [productoAEditar, setProductoAEditar] = useState(null);

  // Estados de Búsqueda y Filtros (Inventario)
  const [busqueda, setBusqueda] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('');
  const [filtroAlmacen, setFiltroAlmacen] = useState('');

  // NUEVO: Estados de Filtros de Fecha (Historial)
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');

  const cargarProductos = () => {
    fetch('http://localhost:3000/api/productos')
      .then(response => response.json())
      .then(data => setProductos(data))
      .catch(error => console.error("Error al cargar productos:", error));
  };

  const cargarMovimientos = () => {
    fetch('http://localhost:3000/api/movimientos')
      .then(response => response.json())
      .then(data => setMovimientos(data))
      .catch(error => console.error("Error al cargar movimientos:", error));
  };

  useEffect(() => {
    cargarProductos();
    cargarMovimientos();
  }, []);

  const handleAbrirEdicion = (producto) => {
    setProductoAEditar(producto);
    setMostrarFormEdicion(true);
  };

  // Filtro de Inventario
  const productosFiltrados = productos.filter(producto => {
    const termino = busqueda.toLowerCase();
    const coincideTexto = producto.codigo.toLowerCase().includes(termino) || 
                          producto.producto.toLowerCase().includes(termino);
    const coincideCategoria = filtroCategoria === '' || producto.categoria === filtroCategoria;
    const coincideAlmacen = filtroAlmacen === '' || producto.almacen === filtroAlmacen;
    return coincideTexto && coincideCategoria && coincideAlmacen;
  });

  // NUEVO: Filtro de Fechas para Movimientos
  const movimientosFiltrados = movimientos.filter(mov => {
    // Si no hay fechas seleccionadas, mostramos todo
    if (!fechaInicio && !fechaFin) return true;

    // Extraemos solo la parte de la fecha (YYYY-MM-DD) del registro de MySQL
    const fechaMov = new Date(mov.fecha_movimiento).toISOString().split('T')[0];

    if (fechaInicio && !fechaFin) return fechaMov >= fechaInicio;
    if (!fechaInicio && fechaFin) return fechaMov <= fechaFin;
    
    // Si ambas fechas existen, verificamos que esté en el rango
    return fechaMov >= fechaInicio && fechaMov <= fechaFin;
  });

  // Exportar a CSV (Mantenemos la que ya funcionaba, pero ahora usa movimientosFiltrados)
  const exportarHistorialCSV = () => {
    if (movimientosFiltrados.length === 0) {
      alert("No hay movimientos en este rango para exportar.");
      return;
    }
    const cabeceras = ['Fecha y Hora', 'Código', 'Descripción', 'Tipo de Movimiento', 'Cantidad', 'Observaciones'];
    const filas = movimientosFiltrados.map(mov => {
      const fechaFormateada = new Date(mov.fecha_movimiento).toLocaleString('es-MX');
      return [`"${fechaFormateada}"`, `"${mov.codigo}"`, `"${mov.descripcion}"`, `"${mov.tipo_movimiento}"`, `"${mov.cantidad}"`, `"${mov.observaciones}"`].join(',');
    });
    const contenidoCSV = cabeceras.join(',') + '\n' + filas.join('\n');
    const blob = new Blob(["\uFEFF" + contenidoCSV], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Reporte_Kardex_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // NUEVO: Generador de PDF
  const exportarHistorialPDF = () => {
    if (movimientosFiltrados.length === 0) {
      alert("No hay movimientos en este rango para exportar.");
      return;
    }

    const doc = new jsPDF();
    
    // Título del Documento
    doc.setFontSize(18);
    doc.text("Reporte de Movimientos - GMC CompuMercado", 14, 20);
    
    // Subtítulo con las fechas si hay filtros aplicados
    doc.setFontSize(11);
    let subtitulo = "Periodo: Todo el historial";
    if (fechaInicio && fechaFin) subtitulo = `Periodo: ${fechaInicio} al ${fechaFin}`;
    else if (fechaInicio) subtitulo = `Periodo: Desde ${fechaInicio}`;
    else if (fechaFin) subtitulo = `Periodo: Hasta ${fechaFin}`;
    doc.text(subtitulo, 14, 28);

    // Definimos las columnas y extraemos los datos
    const columnas = [["Fecha", "Código", "Descripción", "Tipo", "Cant.", "Observaciones"]];
    const datos = movimientosFiltrados.map(mov => [
      new Date(mov.fecha_movimiento).toLocaleString('es-MX'),
      mov.codigo,
      mov.descripcion,
      mov.tipo_movimiento,
      mov.cantidad,
      mov.observaciones
    ]);

    // Dibujamos la tabla usando el plugin autoTable
    autoTable(doc, {
      head: columnas,
      body: datos,
      startY: 35, // Empezar debajo del título
      styles: { fontSize: 9 },
      headStyles: { fillColor: [0, 86, 179] } // Color azul en el encabezado
    });

    // Guardamos el archivo
    doc.save(`Reporte_Movimientos_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '1000px', margin: '0 auto' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        
        {/* NUEVO: CONTENEDOR DEL LOGO Y TÍTULO */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <img 
            src="/logo.png" 
            alt="Logo GCM CompuMercado" 
            style={{ 
              height: '55px', 
              borderRadius: '8px', 
              backgroundColor: 'white', 
              padding: '5px' 
            }} 
          />
          <h1 style={{ color: 'white', lineHeight: '1.2', margin: 0 }}>Inventario GCM CompuMercado</h1>
        </div>
        
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => setMostrarFormMovimiento(true)} style={{ padding: '10px 20px', backgroundColor: '#0056b3', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '15px', fontWeight: 'bold' }}>
            ↑↓ Registrar Movimiento
          </button>
          <button onClick={() => setMostrarFormProducto(true)} style={{ padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '15px', fontWeight: 'bold' }}>
            + Nuevo Insumo
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', borderBottom: '2px solid #444', paddingBottom: '10px' }}>
        <button onClick={() => setVistaActiva('inventario')} style={{ padding: '10px 20px', backgroundColor: vistaActiva === 'inventario' ? '#fff' : '#333', color: vistaActiva === 'inventario' ? '#000' : '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold', transition: '0.3s' }}>
          📦 Inventario Actual
        </button>
        <button onClick={() => setVistaActiva('movimientos')} style={{ padding: '10px 20px', backgroundColor: vistaActiva === 'movimientos' ? '#fff' : '#333', color: vistaActiva === 'movimientos' ? '#000' : '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold', transition: '0.3s' }}>
          🕒 Historial de Movimientos
        </button>
      </div>
      
      {/* VISTA 1: INVENTARIO */}
      {vistaActiva === 'inventario' && (
        <>
          <div style={{ marginBottom: '20px', display: 'flex', gap: '15px' }}>
            <input type="text" placeholder="🔍 Buscar por código o descripción..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} style={{ flex: 1, padding: '12px', borderRadius: '5px', border: '1px solid #ccc', fontSize: '16px', color: '#333' }} />
            <select value={filtroCategoria} onChange={(e) => setFiltroCategoria(e.target.value)} style={{ padding: '12px', borderRadius: '5px', border: '1px solid #ccc', fontSize: '16px', backgroundColor: 'white', color: '#333', minWidth: '180px' }}>
              <option value="">Todas las Categorías</option>
              {CATEGORIAS.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
            <select value={filtroAlmacen} onChange={(e) => setFiltroAlmacen(e.target.value)} style={{ padding: '12px', borderRadius: '5px', border: '1px solid #ccc', fontSize: '16px', backgroundColor: 'white', color: '#333', minWidth: '180px' }}>
              <option value="">Todos los Almacenes</option>
              {ALMACENES.map(alm => <option key={alm} value={alm}>{alm}</option>)}
            </select>
          </div>
          <TablaInventario productos={productosFiltrados} onEditar={handleAbrirEdicion} />
        </>
      )}

      {/* VISTA 2: HISTORIAL DE MOVIMIENTOS (Ahora con filtros y PDF) */}
      {vistaActiva === 'movimientos' && (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '15px', backgroundColor: '#333', padding: '15px', borderRadius: '8px' }}>
            
            {/* Controles de Fecha */}
            <div style={{ display: 'flex', gap: '15px' }}>
              <div>
                <label style={{ color: '#fff', fontSize: '14px', display: 'block', marginBottom: '5px' }}>Desde:</label>
                <input 
                  type="date" 
                  value={fechaInicio} 
                  onChange={(e) => setFechaInicio(e.target.value)} 
                  style={{ 
                    padding: '8px', 
                    borderRadius: '5px', 
                    border: 'none', 
                    color: '#333', 
                    backgroundColor: 'white', 
                    colorScheme: 'light'
                  }} 
                />
              </div>
              <div>
                <label style={{ color: '#fff', fontSize: '14px', display: 'block', marginBottom: '5px' }}>Hasta:</label>
                <input 
                  type="date" 
                  value={fechaFin} 
                  onChange={(e) => setFechaFin(e.target.value)} 
                  style={{ 
                    padding: '8px', 
                    borderRadius: '5px', 
                    border: 'none', 
                    color: '#333', 
                    backgroundColor: 'white', 
                    colorScheme: 'light' // FUERZA EL ICONO A COLOR NEGRO
                  }} 
                />
              </div>
              
              {/* Botón para limpiar las fechas */}
              {(fechaInicio || fechaFin) && (
                <button onClick={() => { setFechaInicio(''); setFechaFin(''); }} style={{ padding: '8px 12px', alignSelf: 'flex-end', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                  ✖ Limpiar
                </button>
              )}
            </div>

            {/* Botones de Exportación */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={exportarHistorialCSV} style={{ padding: '10px 15px', backgroundColor: '#198754', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
                📊 CSV
              </button>
              <button onClick={exportarHistorialPDF} style={{ padding: '10px 15px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
                📄 PDF
              </button>
            </div>
          </div>
          
          {/* IMPORTANTE: Pasamos movimientosFiltrados en lugar del array completo */}
          <TablaMovimientos movimientos={movimientosFiltrados} />
        </>
      )}
      
      {/* MODALES */}
      {mostrarFormProducto && <FormularioProducto cerrarModal={() => setMostrarFormProducto(false)} onProductoGuardado={cargarProductos} />}
      {mostrarFormMovimiento && <FormularioMovimiento productos={productos} cerrarModal={() => setMostrarFormMovimiento(false)} onMovimientoGuardado={() => { cargarProductos(); cargarMovimientos(); }} />}
      {mostrarFormEdicion && <FormularioEdicion producto={productoAEditar} cerrarModal={() => setMostrarFormEdicion(false)} onProductoEditado={cargarProductos} />}
      
    </div>
  );
}

export default App;