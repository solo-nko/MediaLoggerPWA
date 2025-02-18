import Log from '../database/models/Log.ts';

/* eslint-disable no-unused-vars */
export default interface IHeaderItem {
	title: string;
	value: string;
	key?: string;
	sortable?: boolean;
	sortRaw?: (a: Log, b: Log) => number;
}
