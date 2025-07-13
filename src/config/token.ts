import { sign, verify } from 'jsonwebtoken';
import process from 'node:process';
import { CustomJwt } from '../../@types/jwt';

const decodeToken = (
  token: string,
  isRefreshToken: boolean = false
): Promise<CustomJwt> => {
  return new Promise((resolve, reject) => {
    const jwtSecret = isRefreshToken
      ? process.env.JWT_REFRESH!
      : process.env.JWT_SECRET!;
    verify(token, jwtSecret, (err, decoded) => {
      if (err) {
        console.log(err);
        reject(err);
      } else resolve(decoded as CustomJwt);
    });
  });
};

const accessToken = (name: string, userId: number) => {
  const jwtSercet = process.env.JWT_SECRET!;
  const token = sign(
    {
      index: userId,
      userName: name
    },
    jwtSercet,
    {
      issuer: name,
      expiresIn: '6h'
    }
  );
  return token;
};

const refreshToken = (name: string, userId: number) => {
  const jwtRefresh = process.env.JWT_REFRESH!;
  const token = sign(
    {
      index: userId,
      userName: name
    },
    jwtRefresh,
    {
      issuer: name,
      expiresIn: '365d'
    }
  );
  return token;
};

export { accessToken, decodeToken, refreshToken };
