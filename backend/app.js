import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/authRoutes.js';
import barracasRoutes from './routes/barracasRoutes.js';
import eventosRoutes, { listarEventos } from './routes/eventosRoutes.js';
import pedidosRoutes from './routes/pedidosRoutes.js';
import produtosRoutes from './routes/produtosRoutes.js';
import usuariosRoutes from './routes/usuariosRoutes.js';
import { verificarToken } from './controllers/authController.js';
import { jsxMiddleware } from './middleware/jsxMiddleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontPath = path.join(__dirname, '..', 'front');
const frontIndex = path.join(frontPath, 'index.html');

const app = express();

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
});

app.get('/favicon.ico', (req, res) => res.sendStatus(204));

app.get('/api/status', (req, res) => {
    res.json({ status: 'ok', message: 'Backend funcionando' });
});

app.use('/auth', authRoutes);
app.get('/eventos', listarEventos);
app.use('/barracas', verificarToken, barracasRoutes);
app.use('/eventos', verificarToken, eventosRoutes);
app.use('/pedidos', verificarToken, pedidosRoutes);
app.use('/produtos', verificarToken, produtosRoutes);
app.use('/usuarios', verificarToken, usuariosRoutes);

app.use(jsxMiddleware);
app.use(express.static(frontPath));

app.get('/', (req, res) => {
    res.type('html').sendFile(frontIndex);
});

app.get(/^\/(?!api|auth|barracas|eventos|pedidos|produtos|usuarios|favicon|src)/, (req, res) => {
    res.type('html').sendFile(frontIndex);
});

export default app;
