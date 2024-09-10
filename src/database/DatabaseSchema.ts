import Dexie, { type EntityTable } from 'dexie';
import GameLog from '../../types/GameLog.ts';

export default class DatabaseSchema extends Dexie {
	games!: EntityTable<GameLog, 'id'>;

	constructor() {
		// name of the database
		super('AppDatabase');
		this.version(1).stores({
			games: '++id, title, platform'
		});
		this.games.mapToClass(GameLog);
	}
}