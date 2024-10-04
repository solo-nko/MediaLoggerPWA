<script setup lang="ts">
import { ref } from 'vue';
import GamesDB from '../components/database_tabs/GamesDB.vue';
import TVDB from '../components/database_tabs/TVDB.vue';
import BooksDB from '../components/database_tabs/BooksDB.vue';

const tabs = ref('game');
</script>

<template>
	<VTabs id="tab-bar" v-model="tabs" align-tabs="center">
		<!--	<VTabs id="tab-bar" v-model="currentTab" align-tabs="center">-->
		<VTab value="game">Game</VTab>
		<VTab value="tv">TV Series</VTab>
		<VTab value="movie">Movie</VTab>
		<VTab value="book">Book</VTab>
	</VTabs>
	<VTabsWindow id="list-view" v-model="tabs" class="">
		<VTabsWindowItem value="game">
			<GamesDB></GamesDB>
		</VTabsWindowItem>
		<VTabsWindowItem value="tv">
			<TVDB></TVDB>
		</VTabsWindowItem>
		<VTabsWindowItem value="movie">
			<h2>Movie Entry</h2>
		</VTabsWindowItem>
		<VTabsWindowItem value="book">
			<BooksDB></BooksDB>
		</VTabsWindowItem>
	</VTabsWindow>
</template>

<style scoped>
#list-view {
	width: 80%;
}
</style>
