import express from 'express';
import type { Request, Response } from 'express';

export const app = express();
const PORT = process.env.PORT || 3101;

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('farewell-service is awake!');
});

export const run = (): void => {
  app.listen(PORT, () => {
    console.info(`Server is running on http://localhost:${PORT}`);
  });
};
