import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import express from 'express';
import cors from 'cors';
import route from './routes/route.js';
import blogRouter from './routes/blogRouter.js';




const app= express();
app.use(cors({ origin:[
    "http://localhost:5173",
     "https://real-estate-iul2.vercel.app" 

    ]
    }));
app.use(express.json());


mongoose.connect(process.env.MONGO_URL)
.then(()=>console.log("MongoDB connected"))
.catch((err)=>console.log(err));

app.use("/api/properties",route);
app.use("/api/blog",blogRouter);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  

