// server.js - Punto de entrada principal
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const authMiddleware = require('./src/middleware/auth');
const userRoutes = require('./src/routes/userRoutes');
const callRoutes = require('./src/routes/callRoutes');
const webhookRoutes = require('./src/routes/webhookRoutes');

// Cargar variables de entorno
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Rutas públicas
app.use('/api/auth', require('./src/routes/authRoutes'));

// Rutas de webhook (deben ser públicas pero verificadas internamente)
app.use('/api/webhook', webhookRoutes);

// Rutas protegidas
app.use('/api/users', authMiddleware, userRoutes);
app.use('/api/calls', authMiddleware, callRoutes);

// Servir la aplicación React en producción
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));