// server.js
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
const port = 3000;

// Middlewares
app.use(cors()); // Permite que React (Front-end) se comunique con este servidor sin bloqueos
app.use(express.json()); // Permite al servidor recibir y entender datos en formato JSON

// Configuración de la conexión a MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // Tu usuario de MySQL (por defecto suele ser root)
    password: '120199', // ¡Cambia esto por tu contraseña real!
    database: 'sistema_gcm'
});

// Conectar a la base de datos
db.connect((err) => {
    if (err) {
        console.error('Error conectando a la base de datos:', err);
        return;
    }
    console.log('Conexión exitosa a la base de datos sistema_gcm');
});

// --- AQUÍ IRÁN TUS RUTAS (ENDPOINTS) ---

// Ruta de prueba para obtener todos los productos del inventario
app.get('/api/productos', (req, res) => {
    const sql = 'SELECT * FROM productos';
    
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error en la consulta:', err);
            return res.status(500).json({ error: 'Error al obtener los productos' });
        }
        // Devuelve los resultados de la base de datos en formato JSON
        res.json(results); 
    });
});

// Ruta para AGREGAR un nuevo producto al inventario
app.post('/api/productos', (req, res) => {
    // 1. Extraemos los datos que nos enviará React
    const { codigo, producto, presentacion, categoria, almacen, stock_minimo, inventario, solicitar } = req.body;
    
    // 2. Preparamos la consulta SQL
    const sql = 'INSERT INTO productos (codigo, producto, presentacion, categoria, almacen, stock_minimo, inventario, solicitar) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    
    // 3. Ejecutamos la consulta en MySQL
    db.query(sql, [codigo, producto, presentacion, categoria, almacen, stock_minimo, inventario, solicitar], (err, result) => {
        if (err) {
            console.error('Error al insertar el producto:', err);
            return res.status(500).json({ error: 'Error al registrar el producto en la base de datos' });
        }
        // Si todo sale bien, respondemos con éxito
        res.json({ mensaje: 'Producto registrado con éxito', id_insertado: result.insertId });
    });
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor Back-end corriendo en http://localhost:${port}`);
});