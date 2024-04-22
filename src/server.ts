import express from 'express';
import users from './routes/users';
import login from './routes/login';
import signup from './routes/signup';
import profile from './routes/profile';

const app = express();
const PORT = 3000;

app.use(express.json());
app.use('/api/v1/users', users);
app.use('/api/v1/login', login);
app.use('/api/v1/signup', signup);
app.use('/api/v1/profile', profile);

app.get('/', (req, res) => {
  res.send('¡El servidor está en funcionamiento correctamente!');
});

app.get('/api/v1', (req, res) => {
  res.send('This is the version 1 of the API');
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
