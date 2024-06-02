const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const port = 5173;

app.use(cors());
app.use(bodyParser.json());

let articles = [
  {
    id: "1",
    title: "judul",
    content: "Ini Content"
  },
  {
    id: "2",
    title: "judul 2",
    content: "Ini Content 2"
  },
  {
    id: "3",
    title: "judul 3",
    content: "Ini Content 3"
  }
];

// Mendapatkan semua artikel
app.get('/articles', (req, res) => {
  res.json(articles);
});

// Menambahkan artikel baru
app.post('/articles', (req, res) => {
  const newArticle = { id: `${articles.length + 1}`, ...req.body };
  articles.push(newArticle);
  res.json(newArticle);
});

// Memperbarui artikel
app.put('/articles/:id', (req, res) => {
  const articleId = req.params.id;
  const index = articles.findIndex(article => article.id === articleId);
  if (index !== -1) {
    articles[index] = { ...articles[index], ...req.body };
    res.json(articles[index]);
  } else {
    res.status(404).send('Artikel tidak ditemukan');
  }
});

// Menghapus artikel
app.delete('/articles/:id', (req, res) => {
  const articleId = req.params.id;
  articles = articles.filter(article => article.id !== articleId);
  res.status(204).send();
});

app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:5174/:${port}`);
});
