import { manipularDB } from "../db.js";
import mongo from "../mongoDB.js";
import { autenticarToken } from "../middlewares/auth.js";

// Qualquer usuário (admin ou usuário comum) pode visualizar os jogos
export const getJogos = async (req, res) => {
    try {
        const jogos = await manipularDB({}, mongo.getJogos);

        if (!jogos || !jogos[0]) {
            return res.status(404).json('Nenhum jogo encontrado no banco de dados!');
        }

        return res.status(200).json(jogos);
    } catch (e) {
        console.error(e.message);
        return res.status(500).json('Erro interno! Tente novamente em alguns instantes!');
    }
};

export const getJogo = async (req, res) => {
    const id = req.params.id;

    try {
        const jogo = await manipularDB({ id }, mongo.getJogo);
        
        if (jogo == null) {
            return res.status(404).json('Jogo não encontrado no banco de dados!');
        }

        return res.status(200).json(jogo);
    } catch (e) {
        console.error(e.message);
        return res.status(500).json('Erro interno! Tente novamente em alguns instantes!');
    }
};

// Admin pode criar jogos
export const createJogo = async (req, res) => {
    try {
        const jogo = req.body.jogo;
        const todosOsJogos = await manipularDB({}, mongo.getJogos);
        let valido = true;

        for (let j of todosOsJogos) {
            if (j.nome == jogo.nome) {
                valido = false;
            }
        }

        if (!valido) {
            return res.status(409).json(`O nome ${jogo.nome} já está registrado no banco de dados!`);
        }

        const jogoAdicionado = await manipularDB(jogo, mongo.createJogo);

        if (jogoAdicionado == null) {
            return res.status(404).json('Não foi possível adicionar o jogo no banco de dados!');
        }

        return res.status(201).json(jogoAdicionado);
    } catch (e) {
        console.error(e);
        return res.status(500).json('Erro interno! Tente novamente em alguns instantes!');
    }
};

// Admin pode atualizar o nome e o preço (preco) do jogo
export const attJogo = async (req, res) => {
    const id = req.params.id;
    const jogo = req.body.jogo;

    try {
        const jogoExistente = await manipularDB({ id }, mongo.getJogo);

        if (jogoExistente == null) {
            return res.status(404).json('Jogo não encontrado no banco de dados!');
        }

        // A atualização de nome e preco é permitida apenas para o admin
        const novosDados = {};

        if (jogo.nome) {
            novosDados.nome = jogo.nome;
        }

        if (jogo.preco !== undefined && jogo.preco !== null) {
            novosDados.preco = jogo.preco;
        }

        const jogoAtualizado = { ...jogoExistente, ...novosDados };

        delete jogoAtualizado._id;
        jogoAtualizado.id = id;

        const resposta = await manipularDB(jogoAtualizado, mongo.attJogo);
        return res.status(200).json(resposta);
    } catch (e) {
        console.error(e);
        return res.status(500).json('Erro interno! Tente novamente em alguns instantes!');
    }
};

export const deleteJogo = async (req, res) => {
    try {
        const id = req.params.id;
        const resposta = await manipularDB({ id }, mongo.deleteJogo);
    
        if (resposta == null) {
            return res.status(404).json('Jogo não encontrado no banco de dados!');
        }

        return res.status(200).json(`Jogo ${id} deletado do banco de dados!`);
    } catch (e) {
        console.error(e.message);
        return res.status(500).json('Erro interno! Tente novamente em alguns instantes!');
    }
};

// Usuário (comum ou admin) pode visualizar e comprar o jogo
export const comprarJogo = async (req, res) => {
    const id = req.params.id;
    const usuario = req.usuario;

    try {
        const jogo = await manipularDB({ id }, mongo.getJogo);

        if (jogo == null) {
            return res.status(404).json('Jogo não encontrado no banco de dados!');
        }

        const compraExistente = await manipularDB(
            { jogoId: jogo._id, usuarioEmail: usuario.email },
            mongo.getCompra
        );

        if (compraExistente) {
            return res.status(400).json('Você já comprou este jogo!');
        }

        const compra = await manipularDB(
            { jogoId: jogo._id, usuarioEmail: usuario.email, dataCompra: new Date() },
            mongo.createCompra
        );

        return res.status(201).json(`Jogo ${jogo.nome} comprado com sucesso!`);
    } catch (e) {
        console.error(e);
        return res.status(500).json('Erro interno! Tente novamente em alguns instantes!');
    }
};
