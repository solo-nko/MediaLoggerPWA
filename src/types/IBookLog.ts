import { BookStatus } from "../database/models/BookStatus.ts";
import ILog from "./ILog.ts";

export default interface IBookLog extends ILog {
	audiobook: boolean;
	status: BookStatus;
	series: string;
}
