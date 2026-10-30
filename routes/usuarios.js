import express from "express";
import { 
    getUsuarios,
    getUsuario,
    createUsuario,
    deleteUsuario,
    attUsuario,
    desativarUsuario,
    ativarUsuario
} from "../controller/usuarios.js";
import { autenticarToken, autorizarAdmin, verificarId } from "../middlewares/auth.js";

export const routerUsuario = express.Router()

routerUsuario.get('/', autenticarToken, autorizarAdmin, getUsuarios);

routerUsuario.get('/:id', autenticarToken, verificarId, getUsuario);

routerUsuario.post('/', autenticarToken, autorizarAdmin, createUsuario);

routerUsuario.delete('/:id', autenticarToken, autorizarAdmin, deleteUsuario);

routerUsuario.put('/:id', autenticarToken, verificarId, attUsuario);

routerUsuario.patch('/desativar/:id', autenticarToken, verificarId, desativarUsuario);

routerUsuario.patch('/ativar/:id', autenticarToken, autorizarAdmin, ativarUsuario);
