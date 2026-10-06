import { ObjectId } from "mongodb";
import 'dotenv/config';

const getJogos = async (con) => await con.db("Cluster0").collection("Jogos").find({}).toArray();
const getJogo = async (con, user) => await con.db("Cluster0").collection("Jogos").findOne({_id: new ObjectId(user.id)});

const createJogo = async (con, user) => {
    await con.db("Cluster0").collection("Jogos").insertOne(user);

    // throw new Error("tentando errar");
    return `Jogo ${user.nome} adicionado ao MongoDB!`;
}

const deleteJogo = async (con, user) => await con.db("Cluster0").collection("Jogos").findOneAndDelete({_id: new ObjectId(user.id)});

const attJogo = async (con, user) => {
    const _id = new ObjectId(user.id);
    delete user.id;
    await con.db("Cluster0").collection("Jogos").replaceOne({ _id }, user);

    return `Jogo ${user.nome} atualizado no MongoDB!`;
}

const mongo = { getJogos, getJogo, createJogo, deleteJogo, attJogo };
export default mongo;