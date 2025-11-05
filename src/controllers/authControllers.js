import bcrypt from 'bcrypt';
import { prisma } from '../../prisma/db.js';

export async function login(req, res) {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).send('Usuário não encontrado.');

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).send('Senha incorreta.');

    req.session.userId = user.id;
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro no servidor.');
  }
}

export async function register(req, res) {
  const { name, email, password } = req.body;
  if (!email || !password) return res.status(400).send('Campos obrigatórios ausentes.');

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword }
    });
    req.session.userId = user.id;
    res.redirect('/');
  } catch (err) {
    res.status(500).send(err.message);
  }
}

export function logout(req, res) {
  req.session.destroy(() => res.redirect('/'));
}
