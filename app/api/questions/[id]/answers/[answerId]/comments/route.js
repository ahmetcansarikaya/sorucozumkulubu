import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import { authOptions } from '../../../../../auth/[...nextauth]/route';

// GET: Yorumları listele
export async function GET(request, { params }) {
  try {
    const comments = await prisma.comment.findMany({
      where: {
        answerId: params.answerId,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    return NextResponse.json(comments);
  } catch (error) {
    console.error('Yorum yükleme hatası:', error);
    return NextResponse.json(
      { error: 'Yorumlar yüklenirken bir hata oluştu' },
      { status: 500 }
    );
  }
}

// POST: Yeni yorum ekle
export async function POST(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Bu işlem için giriş yapmanız gerekiyor' },
        { status: 401 }
      );
    }

    const { content } = await request.json();
    if (!content || !content.trim()) {
      return NextResponse.json(
        { error: 'Yorum içeriği gereklidir' },
        { status: 400 }
      );
    }

    const answer = await prisma.answer.findUnique({
      where: { id: params.answerId },
    });

    if (!answer) {
      return NextResponse.json(
        { error: 'Cevap bulunamadı' },
        { status: 404 }
      );
    }

    const comment = await prisma.comment.create({
      data: {
        content: content.trim(),
        answerId: params.answerId,
        authorId: session.user.id,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    return NextResponse.json(comment);
  } catch (error) {
    console.error('Yorum ekleme hatası:', error);
    return NextResponse.json(
      { error: 'Yorum eklenirken bir hata oluştu' },
      { status: 500 }
    );
  }
} 