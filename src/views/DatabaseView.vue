<script setup lang="ts">
import { ref, watch } from 'vue';
import GamesDB from '../components/database_tabs/GamesDB.vue';
import TVDB from '../components/database_tabs/TVDB.vue';
import BooksDB from '../components/database_tabs/BooksDB.vue';
import { settingsStore, useLogDbStore } from '../stores/store.ts';
import MoviesDB from '../components/database_tabs/MoviesDB.vue';

// TODO revisit available sort headers
const currentTab = ref(settingsStore.defaultDBScreen);

// this links each of the "items-per-page" in each tab to a single value
const itemPerPageParent = ref(10);
const searchStore = useLogDbStore();

// when changing to a different tab, reset search value
watch(currentTab, () => {
	searchStore.dbSearchValue = '';
});
</script>

<template>
	<VContainer>
		<VRow justify="space-between">
			<VCol>
				<VTabs id="tab-bar" v-model="currentTab" align-tabs="start">
					<VTab value="game">Game</VTab>
					<VTab value="tv">TV Series</VTab>
					<VTab value="movie">Movie</VTab>
					<VTab value="book">Book</VTab>
				</VTabs>
			</VCol>
			<VCol>
				<VTextField
					v-model="searchStore.dbSearchValue"
					label="Search"
					density="compact"
					clearable
					prepend-inner-icon="$search"
				></VTextField>
			</VCol>
		</VRow>
	</VContainer>

	<VTabsWindow id="list-view" v-model="currentTab" class="">
		<VTabsWindowItem value="game">
			<GamesDB v-model:items-per-page="itemPerPageParent"></GamesDB>
		</VTabsWindowItem>
		<VTabsWindowItem value="tv">
			<TVDB v-model:items-per-page="itemPerPageParent"></TVDB>
		</VTabsWindowItem>
		<VTabsWindowItem value="movie">
			<MoviesDB v-model:items-per-page="itemPerPageParent"></MoviesDB>
		</VTabsWindowItem>
		<VTabsWindowItem value="book">
			<BooksDB v-model:items-per-page="itemPerPageParent"></BooksDB>
		</VTabsWindowItem>
	</VTabsWindow>
</template>

<style scoped></style>
