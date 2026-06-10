// Hierarquia de tipos no banco: participante | barraqueiro | organizador | admin

export const verificarAdmin = (req, res, next) => {
    if (req.usuarioTipo !== 'admin' && req.usuarioTipo !== 'organizador') {
        return res.status(403).json({ message: 'Acesso negado: apenas administradores' });
    }
    next();
};

export const verificarOrganizador = (req, res, next) => {
    // Organizador OU administrador têm acesso
    if (req.usuarioTipo !== 'organizador' && req.usuarioTipo !== 'admin') {
        return res.status(403).json({ message: 'Acesso negado: apenas organizadores' });
    }
    next();
};

export const verificarBarraca = (req, res, next) => {
    // Barraqueiro, organizador ou administrador têm acesso
    const permitidos = ['barraqueiro', 'organizador', 'admin'];
    if (!permitidos.includes(req.usuarioTipo)) {
        return res.status(403).json({ message: 'Acesso negado: apenas barraqueiros' });
    }
    next();
};

export const verificarParticipante = (req, res, next) => {
    if (req.usuarioTipo !== 'participante') {
        return res.status(403).json({ message: 'Acesso negado: apenas participantes' });
    }
    next();
};