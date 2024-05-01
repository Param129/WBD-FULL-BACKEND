import morgan from 'morgan';
import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
import rfs from 'rotating-file-stream';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logDirectory = path.join(__dirname, 'logs');

// Create the log directory if it doesn't exist
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory);
}

// Create a rotating write stream
const accessLogStream = rfs.createStream('access.log', {
  interval: '1d', // rotate daily
  path: logDirectory,
});

// Morgan middleware setup
export const loggerMiddleware = morgan('combined', { stream: accessLogStream });
