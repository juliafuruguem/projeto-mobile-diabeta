import { host } from "./host";
import axios from "axios"; 

export function monitorarUser(usuario:string, toast:any){
  setInterval(async () => {
    try {
      const response = await axios.get(`${host}:5000/cadeiraIOT?usuario=${usuario}`);
      
      console.log(response.data);

    } catch (error) {
      console.error('Erro ao verificar o backend:', error);
    }
  }, 10000); // A cada 10 segundos
}