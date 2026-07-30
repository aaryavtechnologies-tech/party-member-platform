import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json(
    {
      status: 'pong',
      timestamp: new Date().toISOString(),
      service: 'party-member-platform',
      message: 'Server is active and healthy',
    },
    { status: 200 }
  );
}
