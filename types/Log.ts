import { DateTime } from "luxon"
import DatabaseSchema from '../src/database/DatabaseSchema';
import { Entity } from 'dexie';

export default class Log extends Entity<DatabaseSchema> {
	id!: number | null
	title: string
	dateCreated: string | null
	dateModified: string | null
}