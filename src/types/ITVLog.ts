import ILog from './ILog.ts';
import { TVStatus } from '../database/models/TVStatus.ts';

export default interface ITVLog extends ILog {
	season: number;
	episode: number;
	status: TVStatus;
}
