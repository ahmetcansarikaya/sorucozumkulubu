import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import prisma from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const [questions, answers, comments] = await Promise.all([
      prisma.question.count({
        where: { authorId: session.user.id }
      }),
      prisma.answer.count({
        where: { authorId: session.user.id }
      }),
      prisma.comment.count({
        where: { authorId: session.user.id }
      })
    ]);

    return NextResponse.json({
      questions,
      answers,
      comments
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    return NextResponse.json(
      { error: 'İstatistikler yüklenirken bir hata oluştu' },
      { status: 500 }
    );
  }
} 