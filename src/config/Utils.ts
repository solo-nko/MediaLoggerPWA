import axios from "axios";
import { peakImportFile } from "dexie-export-import";
import { InjectionKey, Ref, ref } from "vue";
import { appDatabase } from "../database/db.ts";
import Log from "../database/models/Log.ts";
import ISortItem from "../types/ISortItem.ts";

/* 	Vite CANNOT access Azure-configured environment variables, so VITE_API_URL is instead defined during build using Github Secrets.
		See below for more info:
		https://github.com/vitejs/vite/discussions/13443
		https://learn.microsoft.com/en-us/azure/static-web-apps/build-configuration?tabs=identity&pivots=github-actions#environment-variables
 */

/**
 * axios object with the base URL preconfigured
 */
const axiosInstance = axios.create({
	baseURL: import.meta.env.PROD ? import.meta.env.VITE_API_URL : "http://localhost:3050",
	headers: {
		"Content-Type": "application/json"
	}
});

/**
 * Receives a media log database as a blob parameter and replaces the current one in the browser's IndexedDB with it.
 * @param dbToImport Incoming media log database
 */
async function overwriteDatabase(dbToImport: Blob) {
	try {
		const importMetadata = await peakImportFile(dbToImport);
		if (importMetadata.formatName != "dexie") {
			console.log("function overwriteDatabase: Invalid format.");
			return;
		}
		console.log("Database name:", importMetadata.data.databaseName);
		console.log("Database version:", importMetadata.data.databaseVersion);
		console.log(
			"Tables:",
			importMetadata.data.tables.map((t) => `${t.name} (${t.rowCount} rows)`).join("\n\t")
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

const sortLogByUpdated = (a: Log, b: Log) => {
	return (
		Log.dateFromString(<string>a.dateModified).toMillis() -
		Log.dateFromString(<string>b.dateModified).toMillis()
	);
};

const reverseSortLogByUpdated = (a: Log, b: Log) => {
	return (
		Log.dateFromString(<string>b.dateModified).toMillis() -
		Log.dateFromString(<string>a.dateModified).toMillis()
	);
};

const sortLogByCreated = (a: Log, b: Log) => {
	return (
		Log.dateFromString(<string>a.dateCreated).toMillis() -
		Log.dateFromString(<string>b.dateCreated).toMillis()
	);
};

const sortHeaders = ref<ISortItem[]>([{ key: "dateModified", order: "desc" }]);
/** Provide/Inject injection key for the function managing the save toast message. Used for typing purposes. */
const injectionKeySaveToast = Symbol() as InjectionKey<(which: "add" | "edit") => void>;
/** Provide/Inject injection key for the boolean managing the save toast message. */
const injectionKeySaveSuccess = Symbol() as InjectionKey<Ref<boolean>>;
const injectionKeySnackbarTimeout = Symbol() as InjectionKey<Ref<number>>;

export {
	axiosInstance,
	overwriteDatabase,
	progressCallback,
	sortLogByCreated,
	sortLogByUpdated,
	reverseSortLogByUpdated,
	sortHeaders,
	injectionKeySaveToast,
	injectionKeySaveSuccess,
	injectionKeySnackbarTimeout
};
