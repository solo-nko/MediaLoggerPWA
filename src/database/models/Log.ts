import { DateTime } from 'luxon';
import { Entity } from 'dexie';
import { Delta } from 'quill/core';
import DatabaseSchema from '../DatabaseSchema.ts';

export default class Log extends Entity<DatabaseSchema> {
	id!: number | null;
	title: string | null;
	impression: Delta | string | null; //handled as Delta internally, stored as string
	rating: number | null;
	dateCreated: DateTime | string | null; //handled as DateTime internally, stored as string
	dateModified: DateTime | string | null; //handled as DateTime internally, stored as string

	static dateToString(dateObject: DateTime) {
		return dateObject.toISODate();
	}

	// TODO: improve date handling. indexdb can store date objects
	static dateFromString(dateString: string) {
		return DateTime.fromISO(dateString);
	}

	static impressionToString(impressionObject: Delta) {
		return JSON.stringify(impressionObject);
	}

	static impressionFromString(impressionString: string) {
		return new Delta(JSON.parse(impressionString));
	}

	static sortDate(
		inputArray: Log[],
		sortHeader: 'dateCreated' | 'dateModified' = 'dateModified',
		descending = true
	) {
		const workArray = [...inputArray];
		const isStringDate = workArray.every((logItem) => {
			return typeof logItem[sortHeader] === 'string';
		});
		workArray.sort((a, b) => {
			if (isStringDate) {
				const aAsDate = this.dateFromString(<string>a[sortHeader]);
				const bAsDate = this.dateFromString(<string>b[sortHeader]);
				if (descending) return bAsDate.toMillis() - aAsDate.toMillis();
				return aAsDate.toMillis() - bAsDate.toMillis();
			}
		});
		return workArray;
	}
}
