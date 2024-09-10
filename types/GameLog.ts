import { Entity } from 'dexie';
import type DatabaseSchema from '../src/database/DatabaseSchema.ts';

export default class GameLog extends Entity<DatabaseSchema> {
	id!: number
	title: string
	platform: string
}