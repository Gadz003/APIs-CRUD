import express from "express";
import { 
    getJogos, getJogo, createJogo, deleteJogo, attJogo, comprarJogo 
} from "../controller/jogos.js";
import { autenticarToken, autorizarAdmin } from "../middlewares/auth.js";

export const routerJogos = express.Router()

routerJogos.get('/', getJogos);

routerJogos.get('/:id', getJogo);

routerJogos.post('/', autorizarAdmin, createJogo);

routerJogos.delete('/:id', autorizarAdmin, deleteJogo);

routerJogos.put('/:id', autorizarAdmin, attJogo);

routerJogos.post('/:id/comprar', autenticarToken, comprarJogo);
