import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cors from 'cors';

import userRoutes from './routes/user.ts';

const app = express();
dotenv.config();

console.log(process.env.MONGO_URL)

mongoose.connect(process.env.MONGO_URL as string)
.then(() => {console.log("connected to Mongo")})
.catch((err: Error) => {console.log(err)})

app.use(express.json());
app.use(bodyParser.json());
app.use(cors({origin: true, credentials: true}));

app.use('/api/user', userRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log("server is running on port " + port);
})
