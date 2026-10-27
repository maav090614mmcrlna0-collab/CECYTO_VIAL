const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());


function sanitizarTexto(texto) {
  if (typeof texto !== 'string') return '';
  return texto.replace(/[<>]/g, '');
}


app.post('/api/registro', (req, res) => {
  let { nombre, correo, edad, automovil } = req.body;

  nombre = sanitizarTexto(nombre);
  correo = sanitizarTexto(correo);

  if (!nombre || !correo || !edad || parseInt(edad) < 18) {
    return res.status(400).json({ estatus: 'error', mensaje: 'Datos inválidos o edad menor a 18 años.' });
  }


  const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let folio = '';
  for (let i = 0; i < 5; i++) {
    folio += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
  }

  return res.json({
    estatus: 'success',
    mensaje: 'Registro completado con éxito',
    folio: folio,
    usuario: { nombre, correo, edad, automovil }
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor CECyTo Vial corriendo en http://localhost:${PORT}`);
});