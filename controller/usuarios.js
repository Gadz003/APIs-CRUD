import bcrypt from "bcryptjs";
import mongo from "../db/mongoDB.js";
import { manipularDB } from "../db.js";
import 'dotenv/config';

export const getUsuarios = async (req, res) => {
    try {
        const usuarios = await manipularDB({}, mongo.getUsuarios);

        if (!usuarios || !usuarios[0]){
            return res.status(404).json('Nenhum usuário encontrado no banco de dados!');
        } else {
            return res.status(200).json(usuarios);
        }

    } catch (e) {
        console.error(e.message)
    } 
};

export const getUsuario = async (req, res) => {
    const id = req.params.id;

    try {
        const usuario = await manipularDB({ id }, mongo.getUsuario);
        
        if (usuario == null) {
            return res.status(404).json('Usuário não encontrado no banco de dados!');
        } else {
            return res.status(200).json(usuario)
        }
    } catch (e) {
        console.error(e.message)
    } 
};

export const deleteUsuario = async (req, res) => {
    try {
        const id = req.params.id;
        const resposta = await manipularDB({ id }, mongo.deleteUsuario);
    
        if (resposta == null) {
            return res.status(404).json('Usuário não encontrado no banco de dados!');
        } else {
            return res.status(200).json(`Usuário ${id} deletado do banco de dados!`);
        }
    } catch (e) {
        console.error(e.message)
    }
};

export const attUsuario = async (req, res) => {
    const id = req.params.id;
    const usuario = req.body.usuario;

    try {
        const usuarioExistente = await manipularDB({ id }, mongo.getUsuario);
    
        if (usuarioExistente == null) {
           return res.status(404).json('Usuário não encontrado no banco de dados!');
        }

        if (usuario.email) {
            const emailExistente = await manipularDB({ email: usuario.email }, mongo.getUsuarioEmail);
            if (emailExistente) {
                return res.status(400).json("Este email já está cadastrado no banco de dados!");
            }
        }
        
        for (let [chave, valor] of Object.entries(usuario)){
            if (valor == ''){
                delete usuarioExistente[chave];
            } else {
                usuarioExistente[chave] = valor;
            }
        }

        delete usuarioExistente._id;
        usuarioExistente.id = id;

        const resposta = await manipularDB(usuarioExistente, mongo.attUsuario)
        return res.status(200).json(resposta);
    } catch (e) {
        console.error(e)
    }
};

export const createUsuario = async (req, res) => {
    const { email, senha, admin } = req.body.usuario;

    try {
        const usuarioExiste = await manipularDB({ email }, mongo.getUsuarioEmail)

        if (usuarioExiste) {
            return res.status(400).json("Este email já está cadastrado no banco de dados!");
        }

        const salt = await bcrypt.genSalt();
        const senhaCrypt = await bcrypt.hash(senha, salt)

        const resultado = await manipularDB(
            {email, senha: senhaCrypt, admin, ativo: true}, mongo.createUsuario
        );

        res.status(201).json(resultado)
    } catch (e) {
        console.log(e)
        res.status(500).json(e.message);
    }
};

export const desativarUsuario = async (req, res) => {
    const id = req.params.id;

    try {
        const usuarioExistente = await manipularDB({ id }, mongo.getUsuario);
        
        if (usuarioExistente == null) {
            return res.status(404).json('Usuário não encontrado no banco de dados!');
        }
        
        if (!usuarioExistente.ativo) {
            return res.status(404).json('O usuário já foi desativado anteriormente!');
        }

        usuarioExistente.ativo = false;
        delete usuarioExistente._id;
        usuarioExistente.id = id;
        await manipularDB(usuarioExistente, mongo.attUsuario)
        return res.status(200).json(`Usuário ${usuarioExistente.email} foi desativado no mongoDB!`);
    } catch (e) {
        console.error(e);
    }
};

export const ativarUsuario = async (req, res) => {
    const id = req.params.id;

    try {
        const usuarioExistente = await manipularDB({ id }, mongo.getUsuario);
        
        if (usuarioExistente == null) {
            return res.status(404).json('Usuário não encontrado no banco de dados!');
        }

        if (usuarioExistente.ativo) {
            return res.status(404).json('O usuário já está ativo!');
        }

        usuarioExistente.ativo = true;
        delete usuarioExistente._id;
        usuarioExistente.id = id;
        await manipularDB(usuarioExistente, mongo.attUsuario)
        return res.status(200).json(`Usuário ${usuarioExistente.email} foi reativado no mongoDB!`);
    } catch (e) {
        console.error(e);
    }
};
