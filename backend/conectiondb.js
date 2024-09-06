import mongoose from "mongoose";
import "dotenv/config";
import { start as createUserAdmin } from "./seeds/createUserAdmin.js";

mongoose.connect(process.env.DATABASE_URL).then(() => {
    console.log('Connected to MongoDB');
    createUserAdmin();
}).catch(err => console.error('Error connecting to MongoDB:', err));