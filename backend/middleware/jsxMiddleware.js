import fs from 'fs';
import path from 'path';
import babel from '@babel/core';
import { fileURLToPath } from 'url';

const CACHE = new Map();

export const jsxMiddleware = (req, res, next) => {
    if (!req.path.startsWith('/src/') || !req.path.endsWith('.js')) {
        return next();
    }

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    // Para chegar na pasta front a partir de backend/middleware, precisamos subir dois níveis
    const frontPath = path.join(__dirname, '..', '..', 'front');
    const filePath = path.join(frontPath, req.path);

    if (!fs.existsSync(filePath)) {
        console.log(`❌ JSX Middleware: arquivo não encontrado em ${filePath}`);
        return next();
    }

    const fileStats = fs.statSync(filePath);
    const cacheKey = `${filePath}-${fileStats.mtimeMs}`;
    if (CACHE.has(cacheKey)) {
        res.set('Content-Type', 'application/javascript; charset=utf-8');
        return res.send(CACHE.get(cacheKey));
    }

    try {
        const code = fs.readFileSync(filePath, 'utf8');

        const result = babel.transformSync(code, {
            presets: [
                ['@babel/preset-react', { runtime: 'automatic' }],
            ],
            filename: filePath,
            sourceType: 'module',
        });

        CACHE.set(cacheKey, result.code);
        res.set('Content-Type', 'application/javascript; charset=utf-8');
        res.send(result.code);
    } catch (err) {
        console.error(`❌ Erro ao transpilar ${req.path}:`, err.message);
        res.status(500).send(`// Erro ao transpilar: ${err.message}`);
    }
};