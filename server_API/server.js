const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(express.json());
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());

// Conectar ao banco de dados
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "", 
  database: "biblioteca_db", 
});

db.connect((err) => {
  if (err) {
    console.error("❌ Erro ao conectar ao MySQL:", err);
    process.exit(1); // Encerra a aplicação se não conseguir conectar
  } else {
    console.log("✅ Conectado ao MySQL");
  }
});

// 📌 Buscar todas as bibliotecas
app.get("/bibliotecas", (req, res) => {
  db.query("SELECT * FROM bibliotecas", (err, results) => {
    if (err) return res.status(500).json({ error: "Erro ao buscar bibliotecas", details: err });
    res.json(results);
  });
});

app.post('/bibliotecas', (req, res) => {
  let { nome, data_criacao } = req.body;

  console.log("📩 Corpo da requisição recebido:", req.body);

  if (!nome || !data_criacao) {
    return res.status(400).json({ message: "Nome e data de criação são obrigatórios" });
  }


  if (!String(data_criacao).includes('-')) {
    data_criacao = `${data_criacao}-01-01`;
  }

  const query = 'INSERT INTO bibliotecas (nome, data_criacao) VALUES (?, ?)';
  db.query(query, [nome, data_criacao], (err, results) => {
    if (err) {
      console.error("Erro ao criar biblioteca:", err);
      return res.status(500).json({ message: "Erro interno ao criar biblioteca" });
    }
    res.status(201).json({ id: results.insertId, nome, data_criacao });
  });
});

app.get('/bibliotecas/:id/livros', (req, res) => {
  const bibliotecaId = req.params.id;

  const query = 'SELECT * FROM livros WHERE biblioteca_id = ?';
  db.query(query, [bibliotecaId], (err, results) => {
    if (err) {
      console.error('Erro ao buscar livros:', err);
      return res.status(500).json({ message: 'Erro ao buscar livros' });
    }

    res.json(results);
  });
});

// 📌 Deletar uma biblioteca por ID
app.delete('/bibliotecas/:id', (req, res) => {
  const bibliotecaId = req.params.id;

  // Primeiro: deletar os livros associados à biblioteca
  const deleteLivrosQuery = 'DELETE FROM livros WHERE biblioteca_id = ?';

  db.query(deleteLivrosQuery, [bibliotecaId], (livrosErr) => {
    if (livrosErr) {
      console.error('Erro ao deletar livros da biblioteca:', livrosErr);
      return res.status(500).json({ message: 'Erro ao deletar livros da biblioteca' });
    }

    // Segundo: deletar a própria biblioteca
    const deleteBibliotecaQuery = 'DELETE FROM bibliotecas WHERE id = ?';

    db.query(deleteBibliotecaQuery, [bibliotecaId], (bibliotecaErr, result) => {
      if (bibliotecaErr) {
        console.error('Erro ao deletar biblioteca:', bibliotecaErr);
        return res.status(500).json({ message: 'Erro ao deletar biblioteca' });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Biblioteca não encontrada' });
      }

      res.status(200).json({ message: 'Biblioteca deletada com sucesso' });
    });
  });
});

app.put('/bibliotecas/:id', (req, res) => {
  const bibliotecaId = req.params.id;
  let { nome, data_criacao } = req.body;

  if (!nome || !data_criacao) {
    return res.status(400).json({ message: "Nome e data de criação são obrigatórios" });
  }

  
  if (!String(data_criacao).includes('-')) {
    data_criacao = `${data_criacao}-01-01`;
  }

  const query = 'UPDATE bibliotecas SET nome = ?, data_criacao = ? WHERE id = ?';
  db.query(query, [nome, data_criacao, bibliotecaId], (err, results) => {
    if (err) {
      console.error("Erro ao atualizar biblioteca:", err);
      return res.status(500).json({ message: "Erro interno ao atualizar biblioteca" });
    }
    res.status(200).json({ message: "Biblioteca atualizada com sucesso" });
  });
});


app.post('/livros', (req, res) => {
  const { titulo, autor, ano_publicacao, biblioteca_id } = req.body;

  if (!titulo || !autor || !ano_publicacao || !biblioteca_id) {
    return res.status(400).json({ message: 'Título, autor, ano de publicação e biblioteca_id são obrigatórios' });
  }

  const query = 'INSERT INTO livros (nome, autor, data_criacao, biblioteca_id) VALUES (?, ?, ?, ?)';
  db.query(query, [titulo, autor, ano_publicacao, biblioteca_id], (err, result) => {
    if (err) {
      console.error('Erro ao inserir livro:', err);
      return res.status(500).json({ message: 'Erro ao inserir livro' });
    }

    res.status(201).json({ message: 'Livro adicionado com sucesso' });
  });
});

// 📌 Atualizar um livro existente
app.put('/livros/:id', (req, res) => {
  const livroId = req.params.id;
  const { titulo, autor, ano_publicacao, biblioteca_id } = req.body;

  if (!titulo || !autor || !ano_publicacao || !biblioteca_id) {
    return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
  }

  const query = `
    UPDATE livros
    SET nome = ?, autor = ?, data_criacao = ?, biblioteca_id = ?
    WHERE id = ?
  `;

  db.query(query, [titulo, autor, ano_publicacao, biblioteca_id, livroId], (err, result) => {
    if (err) {
      console.error('Erro ao atualizar livro:', err);
      return res.status(500).json({ message: 'Erro ao atualizar livro' });
    }

    res.status(200).json({ message: 'Livro atualizado com sucesso' });
  });
});

// 📌 Deletar um livro por ID
app.delete('/livros/:id', (req, res) => {
  const livroId = req.params.id;

  const query = 'DELETE FROM livros WHERE id = ?';

  db.query(query, [livroId], (err, result) => {
    if (err) {
      console.error('Erro ao deletar livro:', err);
      return res.status(500).json({ message: 'Erro ao deletar livro' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Livro não encontrado' });
    }

    res.status(200).json({ message: 'Livro deletado com sucesso' });
  });
});



// 📌 Buscar todos os livros
app.get('/livros', (req, res) => {
  db.query('SELECT * FROM livros', (err, results) => {
    if (err) {
      console.error('Erro ao buscar livros:', err);
      return res.status(500).json({ message: 'Erro ao buscar livros', details: err });
    }

    res.json(results);
  });
});

app.get('/bibliotecas/:id/livros/quantidade', (req, res) => {
  const bibliotecaId = req.params.id;

  const query = 'SELECT COUNT(*) AS total FROM livros WHERE biblioteca_id = ?';
  db.query(query, [bibliotecaId], (err, result) => {
    if (err) {
      console.error('Erro ao contar livros:', err);
      return res.status(500).json({ message: 'Erro ao contar livros' });
    }

    res.json({ biblioteca_id: bibliotecaId, total_livros: result[0].total });
  });
});

// 📌 Buscar todas as bibliotecas com a quantidade de livros
app.get("/bibliotecas/com-quantidade", (req, res) => {
  const query = `SELECT b.id, b.nome, b.data_criacao,COUNT(l.id) AS total_livros
    FROM bibliotecas b
    LEFT JOIN livros l ON b.id = l.biblioteca_id
    GROUP BY b.id, b.nome, b.data_criacao
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Erro ao buscar bibliotecas com quantidade de livros:", err);
      return res.status(500).json({ message: "Erro ao buscar dados", details: err });
    }

    res.json(results);
  });
});




// 📌 Iniciar o servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});