import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { authOptions } from '../auth/[...nextauth]/route';
import fs from 'fs';

// Uploads klasörünü oluştur
const uploadDir = join(process.cwd(), 'public', 'uploads');
try {
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
} catch (error) {
  console.error('Uploads klasörü oluşturma hatası:', error);
}

// GET /api/questions - Soruları listele
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const subject = searchParams.get('subject');
    const grade = searchParams.get('grade');
    const tag = searchParams.get('tag');

    const where = {};
    if (subject) where.subject = subject;
    if (grade) where.grade = grade;
    if (tag) where.tags = { contains: tag };

    const questions = await prisma.question.findMany({
      where,
      include: {
        author: {
          select: {
            name: true,
            image: true,
          },
        },
        _count: {
          select: {
            answers: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(questions);
  } catch (error) {
    console.error('Soru listeleme hatası:', error);
    return NextResponse.json(
      { error: 'Sorular yüklenirken bir hata oluştu' },
      { status: 500 }
    );
  }
}

// POST /api/questions - Yeni soru oluştur
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json(
        { error: 'Bu işlem için giriş yapmanız gerekiyor' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const title = formData.get('title');
    const content = formData.get('content');
    const subject = formData.get('subject');
    const grade = formData.get('grade');
    const tags = formData.get('tags');
    const image = formData.get('image');

    if (!title || !content || !subject || !grade) {
      return NextResponse.json(
        { error: 'Tüm alanları doldurun' },
        { status: 400 }
      );
    }

    let imagePath = null;
    if (image && image.size > 0) {
      try {
        // Dosya tipi kontrolü
        if (!image.type.startsWith('image/')) {
          return NextResponse.json(
            { error: 'Lütfen geçerli bir resim dosyası yükleyin' },
            { status: 400 }
          );
        }

        // Dosya boyutu kontrolü (5MB)
        if (image.size > 5 * 1024 * 1024) {
          return NextResponse.json(
            { error: 'Dosya boyutu 5MB\'dan küçük olmalıdır' },
            { status: 400 }
          );
        }

        const bytes = await image.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Dosya adını oluştur
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
        const filename = `${uniqueSuffix}-${image.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
        const filepath = join(uploadDir, filename);

        // Dosyayı kaydet
        await writeFile(filepath, buffer);
        imagePath = `/uploads/${filename}`;
      } catch (error) {
        console.error('Fotoğraf yükleme hatası:', error);
        return NextResponse.json(
          { error: 'Fotoğraf yüklenirken bir hata oluştu' },
          { status: 500 }
        );
      }
    }

    try {
      const question = await prisma.question.create({
        data: {
          title,
          content,
          subject,
          grade,
          tags,
          image: imagePath,
          authorId: session.user.id
        }
      });

      return NextResponse.json(question);
    } catch (dbError) {
      console.error('Veritabanı hatası:', dbError);
      return NextResponse.json(
        { error: 'Veritabanı hatası: ' + dbError.message },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Soru oluşturma hatası:', error);
    return NextResponse.json(
      { error: 'Soru oluşturulurken bir hata oluştu' },
      { status: 500 }
    );
  }
} 