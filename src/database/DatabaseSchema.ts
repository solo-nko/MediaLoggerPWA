import dexie, { type EntityTable } from "dexie";
import GameLog from "./models/GameLog.ts";
import TVLog from "./models/TVLog.ts";
import BookLog from "./models/BookLog.ts";
import MovieLog from "./models/MovieLog.ts";

export default class DatabaseSchema extends dexie {
	games!: EntityTable<GameLog, "id">;
	television!: EntityTable<TVLog, "id">;
	books!: EntityTable<BookLog, "id">;
	movies!: EntityTable<MovieLog, "id">;

	constructor() {
		// name of the database
		super("AppDatabase");
		// add new stores (tables) here I think
		this.version(1).stores({
			games:
				"++id, title, platform, status, progress, impression, rating, dateCreated, dateModified",
			television:
				"++id, title, season, episode, status, impression, rating, dateCreated, dateModified",
			movies: "++id, title, series, impression, rating, dateCreated, dateModified",
			books:
				"++id, title, audiobook, series, progress, status, impression, rating, dateCreated, dateModified"
		});
		this.games.mapToClass(GameLog);
		this.television.mapToClass(TVLog);
		this.books.mapToClass(BookLog);
		this.movies.mapToClass(MovieLog);
	}
}
