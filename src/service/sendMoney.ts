import { prisma } from '../config/prisma';
import { AuthenticatedRequest, BasicResponse } from '../types';
import { Response } from 'express';

export const sendMoney = async (req: AuthenticatedRequest, res: Response<BasicResponse>) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({
        message: '토큰 검증 실패'
      });
    }

    const { sendUserId, receiveUserId, money } = req.body;
    if (!sendUserId || !receiveUserId || !money) {
      return res.status(400).json({
        message: '올바르지 않은 입력값'
      });
    }

    if (sendUserId !== userId) {
      return res.status(409).json({
        message: '송금 권한 없음'
      });
    }

    const sendUser = await prisma.bank.findUnique({
      select: { id: true, money: true },
      where: { userId: sendUserId }
    });
    if (!sendUser) {
      return res.status(404).json({
        message: '잔액 조회 불가'
      });
    }
    if (sendUser.money < money) {
      return res.status(409).json({
        message: '잔액 부족'
      });
    }

    const receiveUser = await prisma.bank.findUnique({
      select: { id: true, money: true },
      where: { userId: receiveUserId }
    });
    if (!receiveUser) {
      return res.status(404).json({
        message: '수취인 조회 실패'
      });
    }

    await prisma.$transaction(async (tx) => {
      await tx.bank.update({
        where: { id: sendUser.id },
        data: {
          money: sendUser.money - money
        }
      });
      await tx.bank.update({
        where: { id: receiveUser.id },
        data: {
          money: receiveUser.money + money
        }
      });
    });

    return res.status(200).json({
      message: '송금 성공'
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: '서버 오류 발생'
    });
  }
};
