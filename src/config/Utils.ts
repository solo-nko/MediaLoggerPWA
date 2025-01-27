import axios from 'axios';
import { peakImportFile } from 'dexie-export-import';
import { appDatabase } from '../database/db.ts';

const itemsPerPageOptions = { type: Number, default: 10 };
// TODO change to production URL
const serverURL = 'https://medialoggerapiexpress-bra0h0atbybshucr.japanwest-01.azurewebsites.net';

/**
 * axios object with the base URL preconfigured
 */
const axiosInstance = axios.create({
	baseURL: serverURL
});

/**
 * Receives a media log database as a blob parameter and replaces the current one in the browser's IndexedDB with it.
 * @param dbToImport Incoming media log database
 */
async function overwriteDatabase(dbToImport: Blob) {
	try {
		const importMetadata = await peakImportFile(dbToImport);
		if (importMetadata.formatName != 'dexie') {
			console.log('function overwriteDatabase: Invalid format.');
			return;
		}
		console.log('Database name:', importMetadata.data.databaseName);
		console.log('Database version:', importMetadata.data.databaseVersion);
		console.log(
			'Tables:',
			importMetadata.data.tables.map((t) => `${t.name} (${t.rowCount} rows)`).join('\n\t')
		);
		await appDatabase.import(dbToImport, { clearTablesBeforeImport: true });
		return true;
	} catch (error) {
		console.error(`function importDatabase: ${error}`);
		return false;
	}
}

/**
 * Logs database write progress
 * @param totalRows
 * @param completedRows
 */
function progressCallback({ totalRows, completedRows }): boolean {
	try {
		console.log(`Progress: ${completedRows} / ${totalRows} rows completed`);
		return true;
	} catch (error) {
		console.log(error);
		return false;
	}
}

export { itemsPerPageOptions, axiosInstance, overwriteDatabase, progressCallback };
