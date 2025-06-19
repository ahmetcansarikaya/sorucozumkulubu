import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import prisma from '@/lib/prisma';
import { authOptions } from '../auth/[...nextauth]/route';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { name: true }
    });
    const profile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
      select: {
        bio: true,
        location: true,
        website: true,
      },
    });

    return NextResponse.json({
      name: user?.name || '',
      bio: profile?.bio || '',
      location: profile?.location || '',
      website: profile?.website || ''
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json(
      { error: 'Error fetching profile' },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { name, bio, location, website } = await request.json();

    if (name) {
      await prisma.user.update({
        where: { id: session.user.id },
        data: { name }
      });
    }

    const profile = await prisma.profile.upsert({
      where: { userId: session.user.id },
      update: {
        bio,
        location,
        website,
      },
      create: {
        userId: session.user.id,
        bio,
        location,
        website,
      },
    });

    return NextResponse.json({
      name,
      bio,
      location,
      website
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { error: 'Error updating profile' },
      { status: 500 }
    );
  }
} 