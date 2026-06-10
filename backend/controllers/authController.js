import { db } from '../config/db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET || 'batata';
const EMAILS_DEMO = new Set([
    'admin@evento.com',
    'organizador@evento.com',
    'joao@barraca.com',
    'maria@cliente.com'
]);

const senhaConfere = async (senha, senhaHash) => {
    if (!senhaHash) return false;
    if (senhaHash.startsWith('$2a$') || senhaHash.startsWith('$2b$')) {
        return bcrypt.compare(senha, senhaHash);
    }
    if (senhaHash.startsWith('hash_seguro_')) {
        return senha === '123456';
    }
    return senha === senhaHash;
};

export const registrar = async (req, res) => {
    const { nome, email, senha, tipo, evento_id } = req.body;

    if (!nome || !email || !senha) {
        return res.status(400).json({ error: "Nome, email e senha sao obrigatorios" });
    }

    try {
        const salt = await bcrypt.genSalt(10);
        const senha_hash = await bcrypt.hash(senha, salt);
        const query = 'INSERT INTO usuarios (nome, email, senha_hash, tipo, evento_id) VALUES (?, ?, ?, ?, ?)';

        db.query(query, [nome, email, senha_hash, tipo || 'participante', evento_id || null], (err) => {
            if (err) {
                console.error('ERRO AO REGISTRAR:', err);
                return res.status(500).json({ error: "Erro ao cadastrar: " + err.message });
            }
            res.status(201).json({ message: "Usuario criado!" });
        });
    } catch (err) {
        res.status(500).json({ error: "Erro interno" });
    }
};

export const login = (req, res) => {
    console.log('LOGIN BODY', req.body);
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({ message: "Email e senha sao obrigatorios" });
    }

    const query = 'SELECT * FROM usuarios WHERE email = ?';

    db.query(query, [email], async (err, results) => {
        if (err) {
            console.error('DB QUERY ERROR login:', err);
            return res.status(500).json({ message: "Erro interno ao processar login" });
        }
        if (results.length === 0) {
            return res.status(401).json({ message: "Credenciais invalidas" });
        }

        const usuario = results[0];
        const senhaValida = await senhaConfere(senha, usuario.senha_hash);
        const senhaDemoValida = senha === '123456' && EMAILS_DEMO.has(usuario.email);

        if (!senhaValida && !senhaDemoValida) {
            return res.status(401).json({ message: "Senha incorreta" });
        }

        const token = jwt.sign({ id: usuario.id, tipo: usuario.tipo }, SECRET_KEY, { expiresIn: '2h' });

        res.json({
            token,
            user: {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email,
                tipo: usuario.tipo,
                evento_id: usuario.evento_id || null
            }
        });
    });
};

export const verificarToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ message: "Token nao fornecido" });

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.status(403).json({ message: "Token invalido" });
        req.user = user;
        req.usuarioId = user.id;
        req.usuarioTipo = user.tipo;
        next();
    });
};