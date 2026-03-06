import 'reflect-metadata';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Player } from './Player';

@Entity()
export class Game {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Player, { eager: true, nullable: false })
  @JoinColumn({ name: 'playerXId' })
  playerX!: Player;

  @ManyToOne(() => Player, { eager: true, nullable: false })
  @JoinColumn({ name: 'playerOId' })
  playerO!: Player;

  @ManyToOne(() => Player, { eager: true, nullable: true })
  @JoinColumn({ name: 'winnerId' })
  winner!: Player | null;

  @Column({ type: 'text' })
  boardState!: string;

  @Column({ default: false })
  isDraw!: boolean;

  @CreateDateColumn()
  createdAt!: Date;
}
