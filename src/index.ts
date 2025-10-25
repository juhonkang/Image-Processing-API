//Import express into index.ts
import express from 'express';
//Import imagesRouter into index.ts
import imagesRouter from './routes/images';
//Import middleware
import { requestLogger, errorHandler } from './middleware/logger';

//Create the application object with express()
const app = express();

//Set a port
const port: number = 3000;

// Middleware
app.use(requestLogger);

// Root endpoint
app.get('/', (req, res) => {
  res.send('Server is running!');
  console.log('index.ts loaded');
});

// Routes
app.use('/api/images', imagesRouter);

// Error handling middleware (must be last)
app.use(errorHandler);

//Set the application to listen on the port and output a message to the console with app.listen
app.listen(port, () => {
  console.log(`🚀 Server started at http://localhost:${port}`);
});

export default app;
