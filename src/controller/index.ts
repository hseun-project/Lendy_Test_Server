import express, { Response } from 'express';
import { apiLimit, getApiLimit } from '../middleware/limit';
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
app.post('/', apiLimit, verifyJWT, (req: AuthenticatedRequest, res: Response) => {
  service.accountBankNumber(req, res);
});
app.patch('/', apiLimit, verifyJWT, (req: AuthenticatedRequest, res: Response) => {
  service.modifyBankNumber(req, res);
});
app.post('/send', apiLimit, verifyJWT, (req: AuthenticatedRequest, res: Response) => {
  service.sendMoney(req, res);
});

export default app;
