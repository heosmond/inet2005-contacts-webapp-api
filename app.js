import express from 'express';
import contactsRouter from './routes/contacts.js';
import cors from 'cors';

const port = process.env.PORT || 3000;
const app = express();

// Middleware

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/api/contacts', contactsRouter);
app.use(cors());

// Routes

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
