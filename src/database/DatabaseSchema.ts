import Dexie, { type EntityTable } from 'dexie';
import GameLog from '../types/GameLog.ts';
import TVLog from '../types/TVLog.ts';

export default class DatabaseSchema extends Dexie {
	games!: EntityTable<GameLog, 'id'>;
	television!: EntityTable<TVLog, 'id'>;

	constructor() {
		// name of the database
		super('AppDatabase');
		// add new stores (tables) here I think
		this.version(1).stores({
			games:
				'++id, title, platform, status, progress, impression, rating, dateCreated, dateModified',
			television:
				'++id, title, season, episode, status, impression, rating, dateCreated, dateModified',
			movies: '++id, title, impression, rating, dateCreated, dateModified',
			books: '++id, title, type, progress, status, impression, rating, dateCreated, dateModified'
		});
		this.games.mapToClass(GameLog);
	}
}
