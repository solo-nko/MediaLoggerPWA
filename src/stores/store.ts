import { computed, reactive, ref } from 'vue';
import { defineStore } from 'pinia';
import { useTheme } from 'vuetify';
import { DateTime } from 'luxon';
import { AxiosResponse } from 'axios';
import IItemsPerPageOption from '../types/IItemsPerPageOption.ts';
import { appDatabase } from '../database/db.ts';
import { axiosInstance, progressCallback } from '../config/Utils.ts';

export const settingsStore = reactive({
	defaultDBScreen: 'game',
	defaultEntryScreen: 'game'
});

const usePrivateStore = defineStore('private-store', () => {
	const controller: AbortController | null = null;
	return { controller };
});

export const useSyncStore = defineStore('sync-store', () => {
	const privateStore = usePrivateStore();
	const syncCode = ref(localStorage.getItem('syncCode'));
	const syncCodeValid = computed<boolean>(() => {
		return syncCode.value && syncCode.value.length === 6;
	});
	const lastBackupDate = ref(localStorage.getItem('lastBackupDate'));
	const lastBackupDateFormatted = computed(() => {
		const inputBackUpDate = DateTime.fromISO(lastBackupDate.value);
		if (inputBackUpDate.isValid) return inputBackUpDate.toLocaleString(DateTime.DATETIME_FULL);
		return 'Unknown';
	});

	async function SyncToCloud() {
		const exportBlob = await appDatabase.export({ prettyJson: true, progressCallback });
		const convertedBlob = JSON.parse(await exportBlob.text());
		let returnStatus: number | void;
		const updateCodeAndDate = (response: AxiosResponse) => {
			if ('LastUpdated' in response.data && 'SyncCode' in response.data) {
				lastBackupDate.value = response.data.LastUpdated;
				// setting to localStorage allows the browser to recall this value when the page is loaded again later
				localStorage.setItem('lastBackupDate', lastBackupDate.value);
				syncCode.value = response.data.SyncCode;
				localStorage.setItem('syncCode', syncCode.value);
			} else {
				console.log('API response payload incomplete.');
				console.log('API Response:');
				console.log(response.data);
			}
		};

		if (syncCode.value) {
			await axiosInstance
				.put(`/logs/${syncCode.value}`, convertedBlob)
				.then((response) => {
					updateCodeAndDate(response);
					returnStatus = response.status;
				})
				.catch((responseError) => {
					console.log('Response Error: ', responseError);
					returnStatus = responseError.status;
				});
		} else {
			// else if no sync code present, this will be considered a POST request
			await axiosInstance
				.post(`/logs/`, convertedBlob)
				.then((response) => {
					if (response.status === 201) {
						updateCodeAndDate(response);
					}
				})
				.catch((responseError) => {
					console.log('Response Error: ', responseError);
					returnStatus = responseError.status;
				});
		}
		return returnStatus;
	}

	async function SyncFromCloud() {
		privateStore.controller = new AbortController();
		const abortSignal = privateStore.controller.signal;
		const responseObject: {
			pulledLog: Blob | undefined;
			lastUploadedDate: string | undefined;
			status: number;
		} = {
			pulledLog: undefined,
			lastUploadedDate: undefined,
			status: 0
		};
		await axiosInstance
			.get(`/logs/${syncCode.value}`, { signal: abortSignal })
			.then((response) => {
				responseObject.pulledLog = new Blob([JSON.stringify(response.data.IndexedDB)]);
				responseObject.lastUploadedDate = response.data.LastUpdated;
				responseObject.status = response.status;
			})
			.catch((responseError) => {
				console.log('Response Error: ', responseError);
				responseObject.status = responseError.status;
			})
			.finally(() => {
				privateStore.controller = null;
			});
		return responseObject;
	}

	function AbortSync() {
		if (privateStore.controller !== null) privateStore.controller.abort();
	}

	return {
		AbortSync,
		SyncFromCloud,
		SyncToCloud,
		lastBackupDate,
		lastBackupDateFormatted,
		syncCode,
		syncCodeValid
	};
});

export const useLogDbStore = defineStore('db-search', () => {
	const dbSearchValue = ref<string>('');
	const itemsPerPageOptions = ref<IItemsPerPageOption[]>([
		{
			title: '5',
			value: 5
		},
		{
			title: '10',
			value: 10
		},
		{
			title: '20',
			value: 20
		},
		{
			title: '50',
			value: 50
		},
		{
			title: 'All',
			value: -1
		}
	]);
	const itemsPerPage = ref(itemsPerPageOptions.value[0].value);

	return { dbSearchValue, itemsPerPageOptions, itemsPerPage };
});

export const useThemeStore = defineStore('theme', () => {
	const localStorageTheme = localStorage.getItem('theme');
	const lightTheme = ref(false);
	const themeInstance = useTheme();

	function loadTheme() {
		// if no prior theme has been set, default to lightmode
		if (!localStorageTheme) {
			themeInstance.global.name.value = 'light1';
			localStorage.setItem('theme', themeInstance.global.name.value);
			// else use set theme
		} else themeInstance.global.name.value = localStorageTheme;
		if (themeInstance.global.current.value.dark) lightTheme.value = false;
		else lightTheme.value = true;
	}

	function toggleTheme() {
		themeInstance.global.name.value = themeInstance.global.current.value.dark ? 'light1' : 'dark1';
		if (themeInstance.global.current.value.dark) lightTheme.value = false;
		else lightTheme.value = true;
		localStorage.setItem('theme', themeInstance.global.name.value);
	}

	return { localStorageTheme, lightTheme, loadTheme, themeInstance, toggleTheme };
});
