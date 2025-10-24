import {
  registerUser,
  loginUser,
  logoutUser,
  refreshUsersSession,
  requestResetToken,
  resetPswrd,
} from '../services/auth.js';
import { RT_TERM } from '../constants/index.js';

// контроллер реєстрації користувача
export const registerUserController = async (req, res) => {
  const user = await registerUser(req.body);

  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data: user,
  });
};

// контроллер входу в систему
export const loginUserController = async (req, res) => {
  const session = await loginUser(req.body);

  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + RT_TERM),
  });

  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: new Date(Date.now() + RT_TERM),
  });

  res.json({
    status: 200,
    message: 'Successfully logged in an user!',
    data: { accessToken: session.accessToken },
  });
};

// контроллер виходу з системи
export const logoutUserController = async (req, res) => {
  if (req.cookies.sessionId) {
    await logoutUser(req.cookies.sessionId);
  }

  res.clearCookie('sessionId');
  res.clearCookie('refreshToken');

  res.status(204).send();
};

//контроллер рефреш токену
const setupSession = (res, session) => {
  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + RT_TERM),
  });
  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: new Date(Date.now() + RT_TERM),
  });
};

// контролер оновлення сесії користувача
export const refreshUserSessionController = async (req, res) => {
  const session = await refreshUsersSession({
    sessionId: req.cookies.sessionId,
    refreshToken: req.cookies.refreshToken,
  });

  setupSession(res, session);

  res.json({
    status: 200,
    message: 'Successfully refreshed a session!',
    data: {
      accessToken: session.accessToken,
    },
  });
};

// контролер скидання email
export const requestResetEmailController = async (req, res) => {
  await requestResetToken(req.body.email);
  res.json({
    status: 200,
    message: 'Reset password email has been successfully sent.',
    data: {},
  });
};

// контролер зміни паролю
export const resetPswrdController = async (req, res) => {
  await resetPswrd(req.body);

  res.json({
    status: 200,
    message: 'Password was successfully reset!',
    data: {},
  });
};
