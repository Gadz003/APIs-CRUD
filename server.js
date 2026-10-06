import express from 'express';
import { manipularDB } from './db.js';
import mongo from './mongoDB.js';

const app = express();
app.use(express.json());

app.get('/jogos', async (req, res) => {
    try {
        const jogos = await manipularDB({}, mongo.getJogos);

        if (!jogos[0]){
            res.status(404).json('Nenhum jogo encontrado no banco de dados!');
        } else {
            res.status(200).json(jogos);
        }

    } catch (e) {
        console.error(e.message)
    } 
});

app.get('/jogos/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const jogo = await manipularDB({ id }, mongo.getJogo);
        
        if (jogo == null) {
            res.status(404).json('Jogo não encontrado no banco de dados!');
        } else {
            res.status(200).json(jogo)
        }
    } catch (e) {
        console.error(e.message)
    } 
});

app.post('/jogos', async (req, res) => {
    try {
        const jogo = req.body.jogo;
        const todosOsJogos = await manipularDB({}, mongo.getJogos);
        let valido = true;

        for (let j of todosOsJogos) {
            if (j.nome == jogo.nome) {
                valido = false;
            }
        }

        if (valido) {
            const jogoAdicionado = await manipularDB(jogo, mongo.createJogo)
    
            if (jogoAdicionado == null) {
                res.status(404).json('Não foi possível adicionar o jogo no banco de dados!');
            } else {
                res.status(201).json(jogoAdicionado);
            }
        } else {
            res.status(409).json(`O nome ${jogo.nome} já está registrado no banco de dados!`);
        }
    } catch (e) {
        console.error(e);
    }
});

app.delete('/jogos/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const resposta = await manipularDB({ id }, mongo.deleteJogo);
    
        if (resposta == null) {
            res.status(404).json('Jogo não encontrado no banco de dados!');
        } else {
            res.status(200).json(`Jogo ${id} deletado do banco de dados!`);
        }
    } catch (e) {
        console.error(e.message)
    }
});

app.put('/jogos/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const jogo = req.body.jogo;
        const jogoExistente = await manipularDB({ id }, mongo.getJogo)

        if (jogoExistente == null) {
            res.status(404).json('Jogo não encontrado no banco de dados!');
        } else {
            for (let [chave, valor] of Object.entries(jogo)){
                if (valor == ''){
                    delete jogoExistente[chave];
                } else {
                    jogoExistente[chave] = valor;
                }
            }
    
            delete jogoExistente._id;
            jogoExistente.id = id;
    
            const resposta = await manipularDB(jogoExistente, mongo.attJogo)
            res.status(200).json(resposta);
        } 
    } catch (e) {
        console.error(e.message)
    }
});

app.listen(3000, async () => {
    console.log(`Servidor rodando em http://localhost:3000`);
});