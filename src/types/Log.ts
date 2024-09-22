import { DateTime } from "luxon"
import DatabaseSchema from '../database/DatabaseSchema.ts';
import { Entity } from 'dexie';
import { Delta } from 'quill/core';

export default class Log extends Entity<DatabaseSchema> {
	id!: number | null
	title: string
	dateCreated: DateTime | null
	dateModified: DateTime | null
	impression: Delta | string | null

	static dateToString(dateObject: DateTime) {
		return dateObject.toSQL()
	}

	static dateFromString(dateString: string) {
		return DateTime.fromSQL()
	}

	static impressionToString(impressionObject: Delta) {
		return JSON.stringify(impressionObject)
	}

	static impressionFromString(impressionString: string) {
		return JSON.parse(impressionString)
	}

}