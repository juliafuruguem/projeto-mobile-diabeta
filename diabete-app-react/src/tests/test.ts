import { connectToDatabase } from '../services/mongo';

async function testConnection() {
  try {
    const db = await connectToDatabase();
    console.log("Conexão bem-sucedida ao MongoDB!");
  } catch (error) {
    console.error("Erro ao conectar ao MongoDB:", error);
  }
}

testConnection();