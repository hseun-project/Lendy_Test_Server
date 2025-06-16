import { prisma } from '../config/prisma';
import { AuthenticatedRequest, BasicResponse } from '../types';
import { Response } from 'express';

export const modifyBankNumber = async (req: AuthenticatedRequest, res: Response<BasicResponse>) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({
        message: '토큰 검증 실패'
      });
    }
    const { bankName, bankNumber } = req.body;
    if (!bankName || !bankNumber) {
      return res.status(400).json({
        message: '올바르지 않은 입력값'
      });
    }

    const bank = await prisma.bank.findUnique({ where: { userId: userId } });
    if (!bank) {
      return res.status(404).json({
        message: '존재하지 않는 계좌'
      });
    }

    const bankNumberMasked = String(bankNumber).replace(/^(\d{6})(\d+)$/, '$1********');

    await prisma.bank.update({
      where: { id: bank.id },
      data: {
        bankName: bankName,
        bankNumber: bankNumber,
        bankNumberMasked: bankNumberMasked
      }
    });

    return res.status(200).json({
      message: '계좌 수정 성공'
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: '서버 오류 발생'
    });
  }
};
