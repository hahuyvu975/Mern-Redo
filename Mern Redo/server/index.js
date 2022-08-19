require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const authRouter = require('./routers/auth');
const postRouter = require('./routers/post');

const connectDB = async  () => {
    try {
        await mongoose.connect(
          `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@mern-learnit.zv2qjk1.mongodb.net/?retryWrites=true&w=majority`, {
            useNewUrlParser: true,
            useUnifiedTopology: true,  
        })
        console.log('Connected to Mongo DB');
    } catch (error) {
        console.log(error.message);
        process.exit(1);
    }
}

connectDB();

const app = express();
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/post', postRouter);


const port = 3001;

app.listen(port, () => {
    console.log(`Example app listening on port port! ${port}`);
});

//Run app, then load http://localhost:port in a browser to see the output.