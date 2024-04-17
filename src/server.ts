import express from 'express';
import users from './routes/users';
import login from './routes/login';
import signup from './routes/signup';
import profile from './routes/profile';

const app = express();
const PORT = 3000;

app.use(express.json());
app.use('/users', users);
app.use('/login', login);
app.use('/signup', signup);
app.use('/profile', profile);

app.get('/', (req, res) => {
  res.send('¡El servidor está en funcionamiento correctamente!');
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
