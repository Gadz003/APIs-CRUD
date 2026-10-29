import express from "express";
import { 
    getJogos, getJogo, createJogo, deleteJogo, attJogo 
} from "../controller/jogos.js";
import { autorizarAdmin } from "../middlewares/auth.js";

export const routerJogos = express.Router()

routerJogos.get('/', getJogos);

routerJogos.get('/:id', getJogo);

routerJogos.post('/', autorizarAdmin, createJogo);

routerJogos.delete('/:id', autorizarAdmin, deleteJogo)

routerJogos.put('/:id', autorizarAdmin, attJogo);