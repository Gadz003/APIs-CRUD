import jwt from 'jsonwebtoken';
import 'dotenv/config';

const SECRET = process.env.JWT_SECRET;

export const autenticarToken = (req, res, next) => {
    const reqHeader = req.headers['authorization'];
    const token = reqHeader?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ 
            erro: "Acesso negado! O token não foi fornecido!" 
        });
    }

    try {
        const userDecoded = jwt.verify(token, SECRET);
        req.usuario = userDecoded;
        next();
    } catch (e) {
        return res.status(403).json({
            erro: "Acesso negado! Token inválido ou expirado!" 
        })
    }
};

export const autorizarDiretor = (req, res, next) => {
    if (!req.usuario || !req.usuario.admin) {
        return res.status(403).json({ erro: "Usuário não autorizado para realizar esta operação!" });
    }
    next();
};

export const verificarId = (req, res, next) => {
    if (
        !req.usuario ||
        (String(req.usuario.id) !== String(req.params.id) && !req.usuario.admin)
    ) {
        return res.status(403).json("Usuário não autorizado para realizar esta operação!");
    }
    next();
};
