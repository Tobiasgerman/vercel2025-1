import dotenv from 'dotenv';
dotenv.config();

// services/dbService.js
import pkg from 'pg';
import { config } from '../dbconfig.js';
const { Pool } = pkg;
const pool = new Pool(config);

export default {
  query: (text, params) => pool.query(text, params),
  pool
};
