"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//Import express into index.ts
const express_1 = __importDefault(require("express"));
//Import imagesRouter into index.ts
const images_1 = __importDefault(require("./routes/images"));
//Import middleware
const logger_1 = require("./middleware/logger");
//Create the application object with express()
const app = (0, express_1.default)();
//Set a port
const port = 3000;
// Middleware
app.use(logger_1.requestLogger);
// Root endpoint
app.get('/', (req, res) => {
    res.send('Server is running!');
    console.log('index.ts loaded');
});
// Routes
app.use('/api/images', images_1.default);
// Error handling middleware (must be last)
app.use(logger_1.errorHandler);
//Set the application to listen on the port and output a message to the console with app.listen
app.listen(port, () => {
    console.log(`🚀 Server started at http://localhost:${port}`);
});
exports.default = app;
