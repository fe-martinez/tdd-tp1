import express from 'express';
import users from './routes/userRoutes/users';
import login from './routes/login';

const app = express();
const PORT = 3000;

app.use(express.json());
app.use('/users', users);
app.use('/login', login);

app.get('/', (req, res) => {
  res.send('¡El servidor está en funcionamiento correctamente!');
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
