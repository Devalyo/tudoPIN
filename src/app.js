import express from 'express';
import session from 'express-session';
import path from 'path';
import getRoutes from './routes/getRoutes.js';
import authRoutes from './routes/authRoutes.js';
import postRoutes from './routes/postRoutes.js';
import { fileURLToPath } from 'url';
import { logger } from './middlewares/logMiddleware.js';

const app = express();
const PORT = 3000;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(express.urlencoded({ extended: false }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));

app.use(session({
  secret: '123',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 2, httpOnly: true }
}));

app.use((req, res, next) => {
  res.locals.userId = req.session.userId;
  next();
});


app.use(logger);

app.use('/', getRoutes);
app.use('/', authRoutes);
app.use('/', postRoutes);

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
