import { prisma } from '../config/prisma';
import { AuthenticatedRequest, BasicResponse } from '../types';
import { Response } from 'express';
import { GetBankInfoResponse } from '../types/bank';

export const getBankInfo = async (req: AuthenticatedRequest, res: Response<GetBankInfoResponse | BasicResponse>) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({
        message: '토큰 검증 실패'
      });
    }

    const bank = await prisma.bank.findUnique({ where: { userId: userId } });
    if (!bank) {
      return res.status(404).json({
        message: '존재하지 않는 계좌 정보'
      });
    }

    return res.status(200).json({
      bankName: bank.bankName,
      bankNumber: bank.bankNumber || bank.bankNumberMasked
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: '서버 오류 발생'
    });
  }
};
