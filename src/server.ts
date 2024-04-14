import express, { Request, Response } from 'express';

// Crea una instancia de Express
const app = express();
const PORT = 3000;

// Middleware para parsear JSON
app.use(express.json());

// Ruta de ejemplo
app.get('/', (req: Request, res: Response) => {
  res.send({message: '¡Hola, mundo!'});
});

app.get('/users', (req: Request, res: Response) => {
  let users = [{name: 'John'}, {name: 'Jane'}];
  res.send(users);
});

// Escucha en el puerto especificado
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
