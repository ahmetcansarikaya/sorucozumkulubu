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
    const answers = await prisma.answer.findMany({
      where: { authorId: session.user.id },
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: {
        question: {
          select: {
            id: true,
            title: true
          }
        },
        _count: {
          select: { comments: true }
        }
      }
    });

    return NextResponse.json(answers);
  } catch (error) {
    console.error('Recent answers error:', error);
    return NextResponse.json(
      { error: 'Cevaplar yüklenirken bir hata oluştu' },
      { status: 500 }
    );
  }
} 