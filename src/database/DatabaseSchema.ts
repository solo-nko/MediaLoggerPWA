import Dexie, { type EntityTable } from 'dexie';
import GameLog from '../../types/GameLog.ts';
import TVLog from '../../types/TVLog.ts';

export default class DatabaseSchema extends Dexie {
	games!: EntityTable<GameLog, 'id'>;
	television!: EntityTable<TVLog, 'id'>;

	constructor() {
		// name of the database
		super('AppDatabase');
		// add new stores (tables) here i think
		this.version(1).stores({
			games: '++id, title, platform, status, dateCreated, dateModified',
			television: '++id, title, season, episode, dateCreated, dateModified'
		});
		this.games.mapToClass(GameLog);
	}
}
