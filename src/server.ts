import express, { Request, Response, response } from 'express';
const sqlite3 = require('sqlite3').verbose();

// Crea una instancia de Express
const app = express();
const PORT = 3000;

// Middleware para parsear JSON
app.use(express.json());

// Todo esto probablemente tenga que ir en una clase que gestione la DB
let db = new sqlite3.Database('./db/users.db', (err: { message: any; }) => {
  if(err) {
    return console.error(err.message);
  }
  console.log('SQLite DB connected');
})

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users(id, firstname, lastname, email, password)`);
  console.log('Users table created (or already exists)');
});

// Ruta de ejemplo
app.get('/', (req: Request, res: Response) => {
  res.send({message: '¡Hola, mundo!'});
});

// Esto tambien en su propia clase
let get_users_sql = `SELECT * FROM users`
app.get('/users', (req: Request, res: Response) => {
  db.all(get_users_sql, (err: any, rows: any) => {
    if(!err) {
      res.send(rows)
    }
  })
});

// Y esto tambien
const insert_user = `INSERT INTO users (id, firstname, lastname, email, password) VALUES(?, ?, ?, ?, ?)`
app.post('/signup', (req: Request, res: Response) => {
  let body = req.body;
  db.run(insert_user, [1, body.firstName, body.lastName, body.email, body.password]);
  res.send('User succesfully created');
}); 

// Escucha en el puerto especificado
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
