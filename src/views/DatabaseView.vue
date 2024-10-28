<script setup lang="ts">
import { ref } from 'vue';
import GamesDB from '../components/database_tabs/GamesDB.vue';
import TVDB from '../components/database_tabs/TVDB.vue';
import BooksDB from '../components/database_tabs/BooksDB.vue';
import { settingsStore } from '../stores/settings.ts';
import MoviesDB from '../components/database_tabs/MoviesDB.vue';

const tabs = ref(settingsStore.defaultDBScreen);

// this links each of the "items-per-page" in each tab to a single value
const itemPerPageParent = ref(10);
</script>

<template>
	<VTabs id="tab-bar" v-model="tabs" align-tabs="center">
		<VTab value="game">Game</VTab>
		<VTab value="tv">TV Series</VTab>
		<VTab value="movie">Movie</VTab>
		<VTab value="book">Book</VTab>
	</VTabs>
	<VTabsWindow id="list-view" v-model="tabs" class="">
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

<style scoped>
#list-view {
	width: 80%;
}
</style>
