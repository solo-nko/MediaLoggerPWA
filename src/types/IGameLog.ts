import ILog from './ILog.ts';
import { GameStatus } from '../database/models/GameStatus.ts';

export default interface IGameLog extends ILog {
	platform: string;
	status: GameStatus;
}
