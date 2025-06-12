import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import { authOptions } from '../../auth/[...nextauth]/route';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.role === 'admin') {
      return NextResponse.json(
        { error: 'Bu işlem için admin yetkisi gerekiyor' },
        { status: 403 }
      );
    }

    const [totalQuestions, totalUsers, totalAnswers, pendingQuestions] = await Promise.all([
      prisma.question.count(),
      prisma.user.count(),
      prisma.answer.count(),
      prisma.question.count({
        where: {
          status: 'pending'
        }
      })
    ]);

    return NextResponse.json({
      totalQuestions,
      totalUsers,
      totalAnswers,
      pendingQuestions
    });
  } catch (error) {
    console.error('Admin istatistikleri hatası:', error);
    return NextResponse.json(
      { error: 'İstatistikler yüklenirken bir hata oluştu' },
      { status: 500 }
    );
  }
} 