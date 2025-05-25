import { MongoClient } from "mongodb";

const uri = '<conexão com o mongo db>';

const client = new MongoClient(uri);

export async function connectToDatabase() {
  try {
    await client.connect();
    console.log("🛜 Conectado ao MongoDB com sucesso!");

    const db = client.db('diabeta');
    return db;
  } catch (error) {
    console.error("Erro ao conectar ao MongoDB:", error);
    throw error;
  }
}
