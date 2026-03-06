import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Player } from '../entities/Player';
import { Game } from '../entities/Game';
import path from 'path';

const dbPath = process.env.DATABASE_PATH
  ? path.resolve(process.cwd(), process.env.DATABASE_PATH)
  : path.resolve(process.cwd(), 'database.sqlite');

let dataSource: DataSource | null = null;

export async function getDataSource(): Promise<DataSource> {
  if (dataSource && dataSource.isInitialized) {
    return dataSource;
  }

  dataSource = new DataSource({
    type: 'better-sqlite3',
    database: dbPath,
    entities: [Player, Game],
    synchronize: true,
    logging: false,
  });

  await dataSource.initialize();
  return dataSource;
}
