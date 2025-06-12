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
    const questions = await prisma.question.findMany({
      where: { authorId: session.user.id },
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: {
        _count: {
          select: { answers: true }
        }
      }
    });

    return NextResponse.json(questions);
  } catch (error) {
    console.error('Recent questions error:', error);
    return NextResponse.json(
      { error: 'Sorular yüklenirken bir hata oluştu' },
      { status: 500 }
    );
  }
} 