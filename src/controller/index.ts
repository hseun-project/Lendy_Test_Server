import express, { Response } from 'express';
import { getApiLimit } from '../middleware/limit';
import { verifyJWT } from '../middleware/jwt';
import { AuthenticatedRequest } from '../types';
import service from '../service';

const app = express();

app.get('/', getApiLimit, verifyJWT, (req: AuthenticatedRequest, res: Response) => {
  service.getBankInfo(req, res);
});
app.get('/money', getApiLimit, verifyJWT, (req: AuthenticatedRequest, res: Response) => {
  service.getBankMoney(req, res);
});

export default app;
