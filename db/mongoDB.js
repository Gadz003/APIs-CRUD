import { ObjectId } from "mongodb";
import 'dotenv/config';

const getJogos = async (con) => await con.db("LojaGames").collection("jogos").find({}).toArray();
const getJogo = async (con, jogo) => await con.db("LojaGames").collection("jogos").findOne({_id: new ObjectId(jogo.id)});

const createJogo = async (con, jogo) => {
    await con.db("LojaGames").collection("jogos").insertOne(jogo);
    return `Jogo ${jogo.nome} adicionado ao MongoDB!`;
}

const deleteJogo = async (con, jogo) => await con.db("LojaGames").collection("jogos").findOneAndDelete({_id: new ObjectId(jogo.id)});

const attJogo = async (con, jogo) => {
    const _id = new ObjectId(jogo.id);
    delete jogo.id;
    await con.db("LojaGames").collection("jogos").replaceOne({ _id }, jogo);

    return `Jogo ${jogo.nome} atualizado no MongoDB!`;
}

const getCompra = async (con, compra) => await con.db("LojaGames").collection("compras").findOne(compra);

const createCompra = async (con, compra) => await con.db("LojaGames").collection("compras").insertOne(compra);

const getCompras = async (con, compra) => await con.db("LojaGames").collection("compras").find(compra).toArray();

const getUsuarios = async (con, filtro = {}) => await con.db("LojaGames").collection("usuarios").find(filtro).toArray();

const getUsuario = async (con, filtro = {}) => await con.db("LojaGames").collection("usuarios").findOne({ _id: new ObjectId(filtro.id) });

const getUsuarioEmail = async (con, filtro = {}) => await con.db("LojaGames").collection("usuarios").findOne({ email: filtro.email });

const createUsuario = async (con, usuario) => {
    await con.db("LojaGames").collection("usuarios").insertOne(usuario);
    return `Usuário ${usuario.email} criado com sucesso no MongoDB!`;
};

const deleteUsuario = async (con, filtro = {}) => await con.db("LojaGames").collection("usuarios").findOneAndDelete({ _id: new ObjectId(filtro.id) });

const attUsuario = async (con, usuario) => {
    const _id = new ObjectId(usuario.id);
    const dadosAtualizados = { ...usuario };
    delete dadosAtualizados.id;
    dadosAtualizados._id = _id;
    await con.db("LojaGames").collection("usuarios").replaceOne({ _id }, dadosAtualizados);
    return `Usuário ${usuario.email} atualizado com sucesso no MongoDB!`;
};

const mongo = { getJogos, getJogo, createJogo, deleteJogo, attJogo, getCompra, createCompra, getCompras, getUsuarios, getUsuario, getUsuarioEmail, createUsuario, deleteUsuario, attUsuario };
export default mongo;
