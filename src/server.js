import express from 'express';
import pino from 'pino-http';
import cors from 'cors';

import { getEnvVar } from './utils/getEnvVar.js';

// отримуємо значення змінної PORT
const PORT = Number(getEnvVar('PORT', '3000'));

if (Number.isNaN(PORT)) {
  throw new Error(`Invalid PORT value: "${PORT}"`);
}

export const setupServer = () => {
  const app = express();

  console.log('PORT is:', PORT);

  app.use(express.json());
  app.use(cors());

  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  // app.use('*', (req, res, next) => {
  //   res.status(404).json({
  //     message: 'Not found',
  //   });
  // });

  // app.use((err, req, res, next) => {
  //   res.status(500).json({
  //     message: 'Something went wrong',
  //     error: err.message,
  //   });
  // });

  app.listen(PORT, (error) => {
    if (error) {
      throw error;
    }
    console.log(`Server is running on port: ${PORT}`);
  });
};
