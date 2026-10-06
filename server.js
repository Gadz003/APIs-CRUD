import express from 'express';
import { manipularDB } from './db.js';
import mongo from './mongodb.js';

const app = express();
app.use(express.json());

app.get('/alunos', async (req, res) => {
    try {
        const alunos = await manipularDB({}, mongo.getUsuarios);

        if (!alunos[0]){
            res.status(404).json('Nenhum aluno encontrado no banco de dados!');
        } else {
            res.status(200).json(alunos);
        }

    } catch (e) {
        console.error(e.message)
    } 
});

app.get('/alunos/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const aluno = await manipularDB({ id }, mongo.getUsuario);
        
        if (aluno == null) {
            res.status(404).json('Aluno não encontrado no banco de dados!');
        } else {
            res.status(200).json(aluno)
        }
    } catch (e) {
        console.error(e.message)
    } 
});

app.post('/alunos', async (req, res) => {
    try {
        const aluno = req.body.aluno;
        const todosOsAlunos = await manipularDB({}, mongo.getUsuarios);
        let valido = true;

        for (let a of todosOsAlunos) {
            if (a.email == aluno.email) {
                valido = false;
            }
        }

        if (valido) {
            const alunoAdicionado = await manipularDB(aluno, mongo.createUsuario)
    
            if (alunoAdicionado == null) {
                res.status(404).json('Não foi possível adicionar o aluno no banco de dados!');
            } else {
                res.status(201).json(alunoAdicionado);
            }
        } else {
            res.status(409).json(`O email ${aluno.email} já está registrado no banco de dados!`);
        }
    } catch (e) {
        console.error(e);
    }
});

app.delete('/alunos/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const resposta = await manipularDB({ id }, mongo.deleteUsuario);
    
        if (resposta == null) {
            res.status(404).json('Aluno não encontrado no banco de dados!');
        } else {
            res.status(200).json(`Aluno ${id} deletado do banco de dados!`);
        }
    } catch (e) {
        console.error(e.message)
    }
})

app.put('/alunos/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const aluno = req.body.aluno;
        const alunoExistente = await manipularDB({ id }, mongo.getUsuario)
    
        if (alunoExistente == null) {
            res.status(404).json('Aluno não encontrado no banco de dados!');
        } else {
            for (let [chave, valor] of Object.entries(aluno)){
                if (valor == ''){
                    delete alunoExistente[chave];
                } else {
                    alunoExistente[chave] = valor;
                }
            }
    
            delete alunoExistente._id;
            alunoExistente.id = id;
    
            const resposta = await manipularDB(alunoExistente, mongo.attUsuario)
            res.status(200).json(resposta);
        } 
    } catch (e) {
        console.error(e.message)
    }
});

app.listen(3000, async () => {
    console.log(`Servidor rodando em http://localhost:3000`);
});