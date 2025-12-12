// app.js
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import logger from "morgan";
import routes from "./routes/routes.js";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from './config/dbs.js'; 
import cors from 'cors'
import fs from 'fs'
import multer from "multer";
dotenv.config();
connectDB(); 

// Setup __dirname for ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) =>
    cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });


const app = express();

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Middlewares
app.use(cookieParser('dev'));
app.use(express.json());
app.use(logger('dev'));


// Routes
app.use("/user", routes);

// View engine setup



app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Root route
app.get('/', (req, res) => {
  res.render('index', { title: 'Home Page' });
});


// Server listen
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
