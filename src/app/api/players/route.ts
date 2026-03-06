import { NextRequest, NextResponse } from 'next/server';
import { getDataSource } from '@/lib/database';
import { Player } from '@/entities/Player';

export async function GET() {
  try {
    const ds = await getDataSource();
    const repo = ds.getRepository(Player);
    const players = await repo.find({ order: { wins: 'DESC' } });
    return NextResponse.json(players);
  } catch (error: any) {
    console.error('GET /api/players error:', error);
    return NextResponse.json({ error: 'Failed to fetch players' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name } = body;

    if (!name || typeof name !== 'string' || !name.trim()) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const trimmedName = name.trim();

    const ds = await getDataSource();
    const repo = ds.getRepository(Player);

    // Check for existing player (case-insensitive)
    const existing = await repo
      .createQueryBuilder('player')
      .where('LOWER(player.name) = LOWER(:name)', { name: trimmedName })
      .getOne();

    if (existing) {
      return NextResponse.json(existing);
    }

    const player = repo.create({ name: trimmedName });
    await repo.save(player);
    return NextResponse.json(player, { status: 201 });
  } catch (error: any) {
    console.error('POST /api/players error:', error);
    if (error.code === 'SQLITE_CONSTRAINT' || (error.message && error.message.includes('UNIQUE'))) {
      return NextResponse.json({ error: 'Player name already exists' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to create player' }, { status: 500 });
  }
}
