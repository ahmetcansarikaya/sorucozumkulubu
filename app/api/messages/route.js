import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import { authOptions } from '../auth/[...nextauth]/route';

// GET: Kullanıcının mesajlarını getir (gelen ve giden)
export async function GET(request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Giriş yapmalısınız' }, { status: 401 });
  }
  try {
    const received = await prisma.message.findMany({
      where: { receiverId: session.user.id },
      include: {
        sender: { select: { id: true, name: true, image: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    const sent = await prisma.message.findMany({
      where: { senderId: session.user.id },
      include: {
        receiver: { select: { id: true, name: true, image: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ received, sent });
  } catch (error) {
    return NextResponse.json({ error: 'Mesajlar yüklenemedi' }, { status: 500 });
  }
}

// POST: Yeni mesaj gönder
export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Giriş yapmalısınız' }, { status: 401 });
  }
  const { receiverId, content } = await request.json();
  if (!receiverId || !content) {
    return NextResponse.json({ error: 'Alıcı ve mesaj içeriği zorunlu' }, { status: 400 });
  }
  try {
    const message = await prisma.message.create({
      data: {
        senderId: session.user.id,
        receiverId,
        content,
      },
      include: {
        receiver: { select: { id: true, name: true, image: true } },
        sender: { select: { id: true, name: true, image: true } },
      },
    });
    return NextResponse.json(message);
  } catch (error) {
    return NextResponse.json({ error: 'Mesaj gönderilemedi' }, { status: 500 });
  }
} 