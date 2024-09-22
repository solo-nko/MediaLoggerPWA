import Log from './Log.ts';
import { GameStatus } from './GameStatus.ts';

export default class GameLog extends Log {
	platform: string;
	progress: string;
	status: GameStatus | undefined;
	rating: number | null;
}
