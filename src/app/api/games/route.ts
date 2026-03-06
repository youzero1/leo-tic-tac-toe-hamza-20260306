import { NextRequest, NextResponse } from 'next/server';
import { getDataSource } from '@/lib/database';
import { Game } from '@/entities/Game';
import { Player } from '@/entities/Player';

export async function GET() {
  try {
    const ds = await getDataSource();
    const repo = ds.getRepository(Game);
    const games = await repo.find({
      order: { createdAt: 'DESC' },
      take: 20,
    });
    return NextResponse.json(games);
  } catch (error: any) {
    console.error('GET /api/games error:', error);
    return NextResponse.json({ error: 'Failed to fetch games' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { playerXId, playerOId, winnerId, boardState, isDraw } = body;

    if (!playerXId || !playerOId) {
      return NextResponse.json({ error: 'playerXId and playerOId are required' }, { status: 400 });
    }

    const ds = await getDataSource();
    const playerRepo = ds.getRepository(Player);
    const gameRepo = ds.getRepository(Game);

    const playerX = await playerRepo.findOneBy({ id: playerXId });
    const playerO = await playerRepo.findOneBy({ id: playerOId });

    if (!playerX || !playerO) {
      return NextResponse.json({ error: 'Players not found' }, { status: 404 });
    }

    let winner: Player | null = null;
    if (winnerId) {
      winner = await playerRepo.findOneBy({ id: winnerId });
    }

    // Update player stats
    if (isDraw) {
      playerX.draws += 1;
      playerO.draws += 1;
    } else if (winner) {
      if (winner.id === playerX.id) {
        playerX.wins += 1;
        playerO.losses += 1;
      } else {
        playerO.wins += 1;
        playerX.losses += 1;
      }
    }

    await playerRepo.save([playerX, playerO]);

    const game = gameRepo.create({
      playerX,
      playerO,
      winner,
      boardState,
      isDraw: !!isDraw,
    });

    await gameRepo.save(game);

    return NextResponse.json(game, { status: 201 });
  } catch (error: any) {
    console.error('POST /api/games error:', error);
    return NextResponse.json({ error: 'Failed to save game' }, { status: 500 });
  }
}
