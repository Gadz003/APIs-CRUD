import express from 'express';
import { routerJogos } from './routes/jogos.js';
import { routerUsuario } from './routes/usuarios.js';
import { loginUsuario } from './controller/auth.js';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors());

app.use('/jogos', routerJogos);
app.use('/usuarios', routerUsuario);

app.post('/login', loginUsuario);

app.listen(3000, async () => {
    console.log(`Servidor rodando em http://localhost:3000`);
});
