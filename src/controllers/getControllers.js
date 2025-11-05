import { prisma } from '../../prisma/db.js';

export async function home(req, res) {
  const pageSize = 5;
  const orderBy = req.query.sort === 'likes'
    ? { likes: { _count: 'desc' } }
    : { createdAt: 'desc' };

  const images = await prisma.image.findMany({
    orderBy,
    take: pageSize,
    include: { user: true, likes: true },
  });

  const imagesWithUserLike = images.map(img => ({
    ...img,
    likedByUser: req.session.userId
      ? img.likes.some(like => like.userId === req.session.userId)
      : false
  }));

  res.render('home', { images: imagesWithUserLike });
}


export function publishPage(req, res) {
  res.render('publish');
}

export function loginPage(req, res) {
  res.render('login');
}

export function signupPage(req, res) {
  res.render('signup');
}
