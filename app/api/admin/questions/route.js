import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import { authOptions } from '../../auth/[...nextauth]/route';

// GET /api/admin/questions - Tüm soruları listele
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.role === 'admin') {
      return NextResponse.json(
        { error: 'Bu işlem için admin yetkisi gerekiyor' },
        { status: 403 }
      );
    }

    const questions = await prisma.question.findMany({
      include: {
        author: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(questions);
  } catch (error) {
    console.error('Admin soru listeleme hatası:', error);
    return NextResponse.json(
      { error: 'Sorular yüklenirken bir hata oluştu' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/questions - Soru durumunu güncelle
export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.role === 'admin') {
      return NextResponse.json(
        { error: 'Bu işlem için admin yetkisi gerekiyor' },
        { status: 403 }
      );
    }

    const { id, status } = await request.json();

    if (!id || !status) {
      return NextResponse.json(
        { error: 'Soru ID ve durum gereklidir' },
        { status: 400 }
      );
    }

    const question = await prisma.question.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json(question);
  } catch (error) {
    console.error('Admin soru güncelleme hatası:', error);
    return NextResponse.json(
      { error: 'Soru güncellenirken bir hata oluştu' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/questions - Soruyu sil
export async function DELETE(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.role === 'admin') {
      return NextResponse.json(
        { error: 'Bu işlem için admin yetkisi gerekiyor' },
        { status: 403 }
      );
    }

    const { id } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'Soru ID gereklidir' },
        { status: 400 }
      );
    }

    // Önce soruya ait tüm cevapları ve yorumları sil
    await prisma.$transaction([
      prisma.comment.deleteMany({
        where: {
          answer: {
            questionId: id
          }
        }
      }),
      prisma.answer.deleteMany({
        where: {
          questionId: id
        }
      }),
      prisma.question.delete({
        where: { id }
      })
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Admin soru silme hatası:', error);
    return NextResponse.json(
      { error: 'Soru silinirken bir hata oluştu' },
      { status: 500 }
    );
  }
} 