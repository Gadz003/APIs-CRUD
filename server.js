import express from 'express';
import { getJogos, getJogo, createJogo, attJogo, deleteJogo, comprarJogo } from './controller/jogos.js';
import { loginUsuario } from './controller/auth.js';
import { autenticarToken, autorizarDiretor } from './middlewares/auth.js';

const app = express();
app.use(express.json());

app.get('/jogos', getJogos);
app.get('/jogos/:id', getJogo);
app.post('/jogos', autorizarDiretor, createJogo);
app.put('/jogos/:id', autorizarDiretor, attJogo);
app.delete('/jogos/:id', autorizarDiretor, deleteJogo);
app.post('/jogos/:id/comprar', autenticarToken, comprarJogo);

app.post('/login', loginUsuario);

app.listen(3000, async () => {
    console.log(`Servidor rodando em http://localhost:3000`);
});
