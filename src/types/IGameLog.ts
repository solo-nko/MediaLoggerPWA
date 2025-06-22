import { GameStatus } from '../database/models/GameStatus.ts';
import ILog from './ILog.ts';

export default interface IGameLog extends ILog {
	platform: string;
	status: GameStatus;
}
