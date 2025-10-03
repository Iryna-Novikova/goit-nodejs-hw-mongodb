import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import contactsRouter from './routers/contacts.js';
import { errorHandler } from './middlewares/errorHandler.js';

import { getEnvVar } from './utils/getEnvVar.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';

// отримуємо значення змінної PORT
const PORT = Number(getEnvVar('PORT', '3000'));

if (Number.isNaN(PORT)) {
  throw new Error(`Invalid PORT value: "${PORT}"`);
}

export const setupServer = () => {
  const app = express();

  app.use(express.json());
  app.use(cors());

  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  app.use(contactsRouter);

  app.use('/', notFoundHandler);

  app.use(errorHandler);

  app.listen(PORT, (error) => {
    if (error) {
      throw error;
    }
    console.log(`Server is running on port: ${PORT}`);
  });
};
