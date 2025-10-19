import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';

import { UsersCollection } from '../db/models/user.js';
import { SessionsCollection } from '../db/models/session.js';
import { AT_TERM, RT_TERM } from '../constants/index.js';

import createHttpError from 'http-errors';

// реєстрація користувача
export const registerUser = async (newUser) => {
  const user = await UsersCollection.findOne({ email: newUser.email });
  if (user) throw createHttpError(409, 'Email in use.');

  const encrptPassword = await bcrypt.hash(newUser.password, 10);

  return await UsersCollection.create({ ...newUser, password: encrptPassword });
};

// вхід в систему
export const loginUser = async (payLoad) => {
  const user = await UsersCollection.findOne({ email: payLoad.email });

  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  const isEqual = await bcrypt.compare(payLoad.password, user.password);

  if (!isEqual) {
    throw createHttpError(401, 'Unauthorized');
  }

  await SessionsCollection.deleteOne({ userId: user._id });

  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');

  return await SessionsCollection.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + AT_TERM),
    refreshTokenValidUntil: new Date(Date.now() + RT_TERM),
  });
};

// вихід із системи
export const logoutUser = async (sessionId) => {
  await SessionsCollection.deleteOne({ _id: sessionId });
};

//створення сесії
const createSession = () => {
  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');

  return {
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + AT_TERM),
    refreshTokenValidUntil: new Date(Date.now() + RT_TERM),
  };
};

// оновлення сесії користувача
export const refreshUsersSession = async ({ sessionId, refreshToken }) => {
  const session = await SessionsCollection.findOne({
    _id: sessionId,
    refreshToken,
  });

  if (!session) {
    throw createHttpError(401, 'Session not found');
  }

  const isSessionTokenExpired =
    new Date() > new Date(session.refreshTokenValidUntil);

  if (isSessionTokenExpired) {
    throw createHttpError(401, 'Session token expired');
  }

  const newSession = createSession();

  await SessionsCollection.deleteOne({ _id: sessionId, refreshToken });

  return await SessionsCollection.create({
    userId: session.userId,
    ...newSession,
  });
};
