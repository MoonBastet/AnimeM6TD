const express = require('express');
const fs = require('fs');
const app = express();
const path = './anime.json'; // Ruta al archivo JSON que contiene los animes

// Middleware
app.use(express.json());

// Función para leer datos json
const leerDatos = () => {
  const datos = fs.readFileSync(path, 'utf8');
  return JSON.parse(datos);
};

// Función para escribir en json
const escribirDatos = (datos) => {
  fs.writeFileSync(path, JSON.stringify(datos, null, 2), 'utf8');
};

// Obtener todos los animes
app.get('/animes', (req, res) => {
  const animes = leerDatos();
  res.json(animes);
});

// Obtener anime por ID
app.get('/animes/:id', (req, res) => {
  const { id } = req.params;
  const animes = leerDatos();
  const anime = animes[id];
  
  if (!anime) {
    return res.status(404).json({ error: 'Anime no encontrado' });
  }
  
  res.json(anime);
});

// Crear nuevo anime
app.post('/animes', (req, res) => {
  const { id, nombre, genero, año, autor } = req.body;

  if (!id || !nombre || !genero || !año || !autor) {
    return res.status(400).json({ error: 'Faltan datos para crear el anime' });
  }

  const animes = leerDatos();

  if (animes[id]) {
    return res.status(400).json({ error: 'Ya existe un anime con este ID' });
  }

  animes[id] = { nombre, genero, año, autor };
  escribirDatos(animes);

  res.status(201).json(animes[id]);
});

// Actualizar un anime por ID
app.put('/animes/:id', (req, res) => {
  const { id } = req.params;
  const { nombre, genero, año, autor } = req.body;
  
  const animes = leerDatos();
  const anime = animes[id];
  
  if (!anime) {
    return res.status(404).json({ error: 'Anime no encontrado' });
  }

  animes[id] = { nombre: nombre || anime.nombre, genero: genero || anime.genero, año: año || anime.año, autor: autor || anime.autor };
  escribirDatos(animes);

  res.json(animes[id]);
});

// Eliminar un anime por ID
app.delete('/animes/:id', (req, res) => {
  const { id } = req.params;
  
  const animes = leerDatos();

  if (!animes[id]) {
    return res.status(404).json({ error: 'Anime no encontrado' });
  }

  delete animes[id];
  escribirDatos(animes);

  res.json({ message: 'Anime eliminado' });
});

// Iniciar el servidor 
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
