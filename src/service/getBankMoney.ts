import { AuthenticatedRequest, BasicResponse } from '../types';
import { Response } from 'express';
import { GetBankMoneyResponse } from '../types/bank';
import { prisma } from '../config/prisma';

export const getBankMoney = async (req: AuthenticatedRequest, res: Response<GetBankMoneyResponse | BasicResponse>) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({
        message: '토큰 검증 실패'
      });
    }

    const bank = await prisma.bank.findUnique({
      select: { money: true },
      where: { userId: userId }
    });
    if (!bank) {
      return res.status(404).json({
        message: '존재하지 않는 계좌'
      });
    }

    return res.status(200).json({
      money: bank.money
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: '서버 오류 발생'
    });
  }
};
