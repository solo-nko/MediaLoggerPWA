import Log from './Log.ts';
import { BookStatus } from './BookStatus.ts';

export default class BookLog extends Log {
	audiobook: boolean = false;
	progress: string;
	status: BookStatus | undefined;
	series: string = 'N/A';
}
