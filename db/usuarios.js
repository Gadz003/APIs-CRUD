import { ObjectId } from "mongodb";

export const getUsuarios = async (con, filtro = {}) => await con.db("LojaGames").collection("usuarios").find(filtro).toArray();
export const getUsuario = async (con, filtro) => await con.db("LojaGames").collection("usuarios").findOne({ _id: new ObjectId(filtro.id) });
export const getUsuarioEmail = async (con, filtro) => await con.db("LojaGames").collection("usuarios").findOne({ email: filtro.email });
export const createUsuario = async (con, usuario) => {
    await con.db("LojaGames").collection("usuarios").insertOne(usuario);
    return `Usuário ${usuario.email} criado com sucesso no MongoDB!`;
};
export const deleteUsuario = async (con, filtro) => await con.db("LojaGames").collection("usuarios").findOneAndDelete({ _id: new ObjectId(filtro.id) });
export const attUsuario = async (con, usuario) => {
    const _id = new ObjectId(usuario.id);
    delete usuario._id;
    delete usuario.id;
    await con.db("LojaGames").collection("usuarios").replaceOne({ _id }, usuario);
    return `Usuário ${usuario.email} atualizado com sucesso no MongoDB!`;
};
