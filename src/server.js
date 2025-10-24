import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import router from './routers/index.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { UPLOAD_DIR } from './constants/index.js';

import { getEnvVar } from './utils/getEnvVar.js';

// отримуємо значення змінної PORT
const PORT = Number(getEnvVar('PORT', '3000'));

if (Number.isNaN(PORT)) {
  throw new Error(`Invalid PORT value: "${PORT}"`);
}

export const setupServer = () => {
  const app = express();

  app.use('/uploads', express.static(UPLOAD_DIR));

  app.use(express.json());
  app.use(cors());
  app.use(cookieParser());

  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  app.use('/', router);

  app.use(notFoundHandler);

  app.use(errorHandler);

  app.listen(PORT, (error) => {
    if (error) {
      throw error;
    }
    console.log(`Server is running on port: ${PORT}`);
  });
};
