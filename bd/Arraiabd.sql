CREATE DATABASE IF NOT EXISTS arraia_show;
USE arraia_show;

CREATE TABLE IF NOT EXISTS usuarios (
   id INT AUTO_INCREMENT PRIMARY KEY,
   nome VARCHAR(100) NOT NULL,
   email VARCHAR(100) UNIQUE NOT NULL,
   senha_hash VARCHAR(255) NOT NULL,
   tipo ENUM('admin', 'organizador', 'barraqueiro', 'participante') DEFAULT 'participante',
   criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS eventos (
   id INT AUTO_INCREMENT PRIMARY KEY,
   nome VARCHAR(100) NOT NULL,
   data_evento DATE,
   endereco VARCHAR(255),
   horario TIME,
   descricao TEXT,
   ativo BOOLEAN DEFAULT TRUE,
   criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS barracas (
   id INT AUTO_INCREMENT PRIMARY KEY,
   nome VARCHAR(100) NOT NULL,
   responsavel_id INT,
   evento_id INT,
   FOREIGN KEY (evento_id) REFERENCES eventos(id),
   FOREIGN KEY (responsavel_id) REFERENCES usuarios(id)
);

CREATE TABLE IF NOT EXISTS produtos (
   id INT AUTO_INCREMENT PRIMARY KEY,
   barraca_id INT NOT NULL,
   nome VARCHAR(100) NOT NULL,
   preco DECIMAL(10, 2) NOT NULL,
   estoque INT NOT NULL DEFAULT 0,
   FOREIGN KEY (barraca_id) REFERENCES barracas(id)
);

CREATE TABLE IF NOT EXISTS pedidos (
   id INT AUTO_INCREMENT PRIMARY KEY,
   usuario_id INT NOT NULL,
   barraca_id INT,
   total DECIMAL(10, 2) NOT NULL,
   status ENUM('pendente', 'pago', 'cancelado', 'entregue') DEFAULT 'pendente',
   pix_copia_cola TEXT,
   criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
   FOREIGN KEY (barraca_id) REFERENCES barracas(id)
);

CREATE TABLE IF NOT EXISTS itens_pedido (
   id INT AUTO_INCREMENT PRIMARY KEY,
   pedido_id INT NOT NULL,
   produto_id INT NOT NULL,
   quantidade INT NOT NULL,
   subtotal DECIMAL(10, 2) NOT NULL,
   FOREIGN KEY (pedido_id) REFERENCES pedidos(id),
   FOREIGN KEY (produto_id) REFERENCES produtos(id)
);

INSERT IGNORE INTO usuarios (id, nome, email, senha_hash, tipo) VALUES
(1, 'Administrador', 'admin@evento.com', '123456', 'admin'),
(2, 'Joao Barraqueiro', 'joao@barraca.com', '123456', 'barraqueiro'),
(3, 'Maria Participante', 'maria@cliente.com', '123456', 'participante'),
(4, 'Organizador', 'organizador@evento.com', '123456', 'organizador');

INSERT IGNORE INTO eventos (id, nome, data_evento, ativo) VALUES
(1, 'Festa Junina 2026', '2026-06-24', TRUE);

INSERT IGNORE INTO barracas (id, evento_id, nome, responsavel_id) VALUES
(1, 1, 'Barraca do Milho', 2),
(2, 1, 'Doces da Maria', 2);

INSERT IGNORE INTO produtos (id, barraca_id, nome, preco, estoque) VALUES
(1, 1, 'Milho Cozido', 5.00, 100),
(2, 1, 'Pamonha', 8.00, 50),
(3, 2, 'Bolo de Milho', 6.00, 40),
(4, 2, 'Quentao', 7.00, 30);

INSERT IGNORE INTO pedidos (id, usuario_id, barraca_id, total, status, pix_copia_cola) VALUES
(1, 3, 1, 13.00, 'pago', '0002010102112644...');

INSERT IGNORE INTO itens_pedido (id, pedido_id, produto_id, quantidade, subtotal) VALUES
(1, 1, 1, 1, 5.00),
(2, 1, 2, 1, 8.00);
