import mongoose from 'mongoose';
import { getEnvVar } from '../utils/getEnvVar.js';

export const initMongoConnection = async () => {
  try {
    console.log('Mongo connection successfully established!');
  } catch (err) {
    console.log('Error while setting up mongo connection', err);
    throw err;
  }
};
