import { TVStatus } from "../database/models/TVStatus.ts";
import ILog from "./ILog.ts";

export default interface ITVLog extends ILog {
	season: number;
	episode: number;
	status: TVStatus;
}
