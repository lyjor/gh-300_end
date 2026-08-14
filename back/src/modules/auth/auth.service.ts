import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../../config/prisma';
import { env } from '../../config/env';
import { HttpError } from '../../middlewares/error-handler';
import { loginSchema } from './auth.schema';

export async function login(payload: unknown) {
  const credentials = loginSchema.parse(payload);
  const user = await prisma.usuario.findUnique({
    where: { email: credentials.email }
  });

  if (!user || !user.ativo) {
    throw new HttpError(401, 'Credenciais inválidas.');
  }

  // Alguns seeds antigos usam prefixo $2y$; bcryptjs valida com $2a$/$2b$.
  const normalizedHash = user.senhaHash.startsWith('$2y$')
    ? `$2a$${user.senhaHash.slice(4)}`
    : user.senhaHash;

  const passwordMatches = await bcrypt.compare(credentials.password, normalizedHash);

  if (!passwordMatches) {
    throw new HttpError(401, 'Credenciais inválidas.');
  }

  const token = jwt.sign(
    {
      sub: String(user.idUsuario),
      email: user.email,
      role: user.papel
    },
    env.JWT_SECRET,
    { expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'] }
  );

  return {
    token,
    user: {
      id: user.idUsuario,
      nome: user.nome,
      email: user.email,
      role: user.papel
    }
  };
}