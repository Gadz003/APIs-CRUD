import { ObjectId } from "mongodb";
import 'dotenv/config';

const getUsuarios = async (con) => await con.db("4INFO3").collection("Alunos").find({}).toArray();
const getUsuario = async (con, user) => await con.db("4INFO3").collection("Alunos").findOne({_id: new ObjectId(user.id)});

const createUsuario = async (con, user) => {
    await con.db("4INFO3").collection("Alunos").insertOne(user);

    // throw new Error("tentando errar");
    return `Aluno ${user.nome} adicionado ao MongoDB!`;
}

const deleteUsuario = async (con, user) => await con.db("4INFO3").collection("Alunos").findOneAndDelete({_id: new ObjectId(user.id)});

const attUsuario = async (con, user) => {
    const _id = new ObjectId(user.id);
    delete user.id;
    await con.db("4INFO3").collection("Alunos").replaceOne({ _id }, user);

    return `Aluno ${user.nome} atualizado no MongoDB!`;
}

const mongo = { getUsuarios, getUsuario, createUsuario, deleteUsuario, attUsuario };
export default mongo;