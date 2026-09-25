import express from 'express';

const app = express();

app.use(express.json());

app.get('/healthz', (req, res) => {
  res.status(200).json({
    status: 'ok',
  });
});

export default app;
