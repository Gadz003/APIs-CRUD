import { MongoClient } from "mongodb";
import 'dotenv/config';

const conexao = async () => {
    const URI = process.env.MONGO;
    if (!URI) {
        throw new Error("Variável MONGO não definida no .env");
    }
    const client = new MongoClient(URI);
    await client.connect();

    return client;
}

export const manipularDB = async (jogo, callback) => {
    let con;
    try {
        con = await conexao();
        return await callback(con, jogo);
    } catch (e) {
        console.error(e.message);
        return null;
    } finally {
        if (con) await con.close().catch(() => {});
    }
}