import { prisma } from '../config/prisma';
import { AuthenticatedRequest, BasicResponse } from '../types';
import { Response } from 'express';

export const accountBankNumber = async (req: AuthenticatedRequest, res: Response<BasicResponse>) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({
        message: '토큰 검증 실패'
      });
    }

    const { bankName, bankNumber, bankNumberMasked, apiTranId, alias } = req.body;
    if (!bankName || !bankNumber || !bankNumberMasked || !apiTranId || !alias) {
      return res.status(400).json({
        message: '올바르지 않은 입력값'
      });
    }

    const bank = await prisma.bank.findUnique({ where: { userId: userId } });
    if (bank) {
      return res.status(409).json({
        message: '이미 등록된 계좌 존재'
      });
    }

    await prisma.bank.create({
      data: {
        userId: userId,
        bankName: bankName,
        bankNumber: bankNumber,
        bankNumberMasked: bankNumberMasked,
        apiTranId: apiTranId
      }
    });

    return res.status(201).json({
      message: '계좌 등록 성공'
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: '서버 오류 발생'
    });
  }
};
