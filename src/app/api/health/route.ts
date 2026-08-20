import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Check Database Connection
    await prisma.$queryRaw`SELECT 1`;

    return NextResponse.json(
      {
        status: 'ok',
        timestamp: new Date().toISOString(),
        // SECURITY: Removed environment disclosure — don't leak NODE_ENV publicly
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Health Check Failed:', error);

    return NextResponse.json(
      {
        status: 'error',
        timestamp: new Date().toISOString(),
        // SECURITY: No internal error details returned to client
      },
      { status: 503 }
    );
  }
}
