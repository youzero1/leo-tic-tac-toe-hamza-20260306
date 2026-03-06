import { NextResponse } from 'next/server';
import { getDataSource } from '@/lib/database';
import { Player } from '@/entities/Player';

export async function GET() {
  try {
    const ds = await getDataSource();
    const repo = ds.getRepository(Player);
    const players = await repo.find({
      order: { wins: 'DESC', draws: 'DESC' },
    });
    return NextResponse.json(players);
  } catch (error: any) {
    console.error('GET /api/leaderboard error:', error);
    return NextResponse.json({ error: 'Failed to fetch leaderboard' }, { status: 500 });
  }
}
