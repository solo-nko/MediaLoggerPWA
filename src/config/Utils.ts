import axios from 'axios';
import { peakImportFile } from 'dexie-export-import';
import { appDatabase } from '../database/db.ts';

const itemsPerPageOptions = { type: Number, default: 10 };
// TODO change to production URL
const serverURL = 'http://localhost:3050';

const axiosInstance = axios.create({
	baseURL: serverURL
});

async function overwriteDatabase(dbToImport: Blob) {
	try {
		const importMetadata = await peakImportFile(dbToImport);
		if (importMetadata.formatName != 'dexie') throw new Error('Invalid format');
		console.log('Database name:', importMetadata.data.databaseName);
		console.log('Database version:', importMetadata.data.databaseVersion);
		console.log(
			'Tables:',
			importMetadata.data.tables.map((t) => `${t.name} (${t.rowCount} rows)`).join('\n\t')
		);
		await appDatabase.import(dbToImport, { clearTablesBeforeImport: true });
		return true
	} catch (error) {
		console.error(`function importDatabase: ${error}`);
		return false
	}
}

function progressCallback({ totalRows, completedRows }): boolean {
	try {
		console.log(`Progress: ${completedRows} / ${totalRows} rows completed`);
		return true;
	} catch (error) {
		return false;
	}
}

export { itemsPerPageOptions, axiosInstance, overwriteDatabase, progressCallback};
