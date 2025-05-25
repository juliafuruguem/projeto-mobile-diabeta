const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes');
const glicemiaRoutes = require('./routes/glicemiaRoutes');  
const historicoRoutes = require('./routes/historicoRoutes');  
const previsaoRoutes = require('./routes/previsaoRoutes');  
const refeicaoRoutes = require('./routes/refeicaoRoutes');  
const relatorioRoutes = require('./routes/relatorioRoutes');
const alimentosRoutes = require('./routes/alimentosRoutes');
const cadeiraIOTRoutes = require('./routes/cadeiraIOTRoute');
const router = express.Router();

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// CORS público
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Rotas
app.use('/api/users', userRoutes);
app.use('/api/glicemia', glicemiaRoutes);  
app.use('/api/historico', historicoRoutes); 
app.use('/api/previsao', previsaoRoutes);  
app.use('/api/refeicoes', refeicaoRoutes);  
app.use('/api/relatorio', relatorioRoutes);
app.use('/alimentos', alimentosRoutes);
app.use('/cadeiraIOT', cadeiraIOTRoutes);

// Conexão com o MongoDB
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('🟢 Conectado ao MongoDB');
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
  });
})
.catch((error) => {
  console.error('🔴 Erro ao conectar ao MongoDB:', error.message);
});
