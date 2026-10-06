import { ObjectId } from "mongodb";
import 'dotenv/config';

const getJogos = async (con) => await con.db("Cluster0").collection("Jogos").find({}).toArray();
const getJogo = async (con, jogo) => await con.db("Cluster0").collection("Jogos").findOne({_id: new ObjectId(jogo.id)});

const createJogo = async (con, jogo) => {
    await con.db("Cluster0").collection("Jogos").insertOne(jogo);

    // throw new Error("tentando errar");
    return `Jogo ${jogo.nome} adicionado ao MongoDB!`;
}

const deleteJogo = async (con, jogo) => await con.db("Cluster0").collection("Jogos").findOneAndDelete({_id: new ObjectId(jogo.id)});

const attJogo = async (con, jogo) => {
    const _id = new ObjectId(jogo.id);
    delete jogo.id;
    await con.db("Cluster0").collection("Jogos").replaceOne({ _id }, jogo);

    return `Jogo ${jogo.nome} atualizado no MongoDB!`;
}

const mongo = { getJogos, getJogo, createJogo, deleteJogo, attJogo };
export default mongo;