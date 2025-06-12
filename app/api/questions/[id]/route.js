import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import { authOptions } from '../../auth/[...nextauth]/route';
import { writeFile } from 'fs/promises';

// GET /api/questions/[id] - Soru detayını getir
export async function GET(request, { params }) {
  try {
    const question = await prisma.question.findUnique({
      where: {
        id: params.id,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        answers: {
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
        },
      },
    });

    if (!question) {
      return NextResponse.json(
        { error: 'Soru bulunamadı' },
        { status: 404 }
      );
    }

    // Görüntülenme sayısını artır
    await prisma.question.update({
      where: { id: params.id },
      data: { views: { increment: 1 } },
    });

    return NextResponse.json(question);
  } catch (error) {
    console.error('Soru detayı hatası:', error);
    return NextResponse.json(
      { error: 'Soru yüklenirken bir hata oluştu' },
      { status: 500 }
    );
  }
}

// POST /api/questions/[id]/answers - Soruya cevap ekle
export async function POST(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Bu işlem için giriş yapmanız gerekiyor' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const content = formData.get('content');
    const imageFile = formData.get('image');

    if (!content) {
      return NextResponse.json(
        { error: 'Cevap içeriği gereklidir' },
        { status: 400 }
      );
    }

    const question = await prisma.question.findUnique({
      where: { id: params.id },
    });

    if (!question) {
      return NextResponse.json(
        { error: 'Soru bulunamadı' },
        { status: 404 }
      );
    }

    let imageUrl = null;
    if (imageFile) {
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Dosya adını oluştur
      const timestamp = Date.now();
      const filename = `${timestamp}-${imageFile.name}`;
      const path = `public/uploads/answers/${filename}`;

      // Dosyayı kaydet
      await writeFile(path, buffer);
      imageUrl = `/uploads/answers/${filename}`;
    }

    const answer = await prisma.answer.create({
      data: {
        content,
        image: imageUrl,
        questionId: params.id,
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

    return NextResponse.json(answer);
  } catch (error) {
    console.error('Cevap ekleme hatası:', error);
    return NextResponse.json(
      { error: 'Cevap eklenirken bir hata oluştu' },
      { status: 500 }
    );
  }
}

// Yorumlar için alt endpoint yönlendirmesi (örnek, gerçek handler ayrı dosyada olacak)
// export async function GET(request, { params }) {
//   // ...
// }
// export async function POST(request, { params }) {
//   // ...
// } 