import formidable from 'formidable';
import { prisma } from '../../prisma/db.js';

export function publish(req, res) {
  const form = formidable({
    uploadDir: './public/uploads',
    createDirsFromUploads: true,
    keepExtensions: true
  });

  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(400).send(err.message);

    const title = Array.isArray(fields.title) ? fields.title[0] : fields.title;
    const description = Array.isArray(fields.description) ? fields.description[0] : fields.description;
    if (!title || title.trim() === '') return res.status(400).send('Deve ter Título');

    const file = Array.isArray(files.imagem) ? files.imagem[0] : files.imagem;

    try {
      await prisma.image.create({
        data: {
          title,
          filename: file.newFilename,
          description,
          user: { connect: { id: req.session.userId } }
        }
      });
      res.redirect('/');
    } catch (err) {
      res.status(500).send(err.message);
    }
  });
}

export async function toggleLike(req, res) {
  const imageId = parseInt(req.params.id);
  const userId = req.session.userId;

  try {
    const existingLike = await prisma.like.findUnique({
      where: { userId_imageId: { userId, imageId } }
    });

    if (existingLike) {
      await prisma.like.delete({ where: { userId_imageId: { userId, imageId } } });
    } else {
      await prisma.like.create({ data: { userId, imageId } });
    }

    const totalLikes = await prisma.like.count({ where: { imageId } });
    res.json({ liked: !existingLike, totalLikes });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao atualizar like.' });
  }
}

export async function loadMoreImages (req, res) {
  const skip = parseInt(req.query.skip) || 0;
  const take = parseInt(req.query.take) || 10;
  const sort = req.query.sort || 'date';

  const orderBy = sort === 'likes'
    ? { likes: { _count: 'desc' } }
    : { createdAt: 'desc' };

  const images = await prisma.image.findMany({
    skip,
    take,
    orderBy,
    include: { likes: true, user: true },
  });

  const userId = req.session?.userId;
  const mapped = images.map(img => ({
    id: img.id,
    title: img.title,
    filename: img.filename,
    description: img.description,
    likedByUser: userId ? img.likes.some(like => like.userId === userId) : false,
    totalLikes: img.likes.length,
  }));

  res.json(mapped);
};

