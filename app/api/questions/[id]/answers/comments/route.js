import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import { authOptions } from '../../../../auth/[...nextauth]/route';

// GET: Yorumları listele
export async function GET(request, { params }) {
  const { id, answerId } = params;
  try {
    const comments = await prisma.comment.findMany({
      where: { answerId },
      include: {
        author: {
          select: { id: true, name: true, image: true },
        },
      },
      orderBy: { createdAt: 'asc' },
    });
    return NextResponse.json(comments);
  } catch (error) {
    return NextResponse.json({ error: 'Yorumlar yüklenemedi' }, { status: 500 });
  }
}

// POST: Yorum ekle
export async function POST(request, { params }) {
  const { id, answerId } = params;
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Giriş yapmalısınız' }, { status: 401 });
  }
  const { content } = await request.json();
  if (!content) {
    return NextResponse.json({ error: 'Yorum içeriği boş olamaz' }, { status: 400 });
  }
  try {
    const comment = await prisma.comment.create({
      data: {
        content,
        answerId,
        authorId: session.user.id,
      },
      include: {
        author: { select: { id: true, name: true, image: true } },
      },
    });
    return NextResponse.json(comment);
  } catch (error) {
    return NextResponse.json({ error: 'Yorum eklenemedi' }, { status: 500 });
  }
} 