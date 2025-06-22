import Log from "./Log.ts";
import { TVStatus } from "./TVStatus.ts";

export default class TVLog extends Log {
	season: number | null;
	episode: number | null;
	status: TVStatus | undefined;
}
