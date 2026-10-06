import { MongoClient } from "mongodb";
import 'dotenv/config';

const conexao = async () => {
    const URI = process.env.MONGO;
    const client = new MongoClient(URI);
    const con = await client.connect();

    return con;
}

export const manipularDB = async (jogo, callback) => {
    let resultado;
    try {
        const con = await conexao();
        resultado = await callback(con, jogo);
        con.close();
    } catch (e) {
        resultado = null;
        console.error(e.message);
    } finally {
        return resultado;
    }
}