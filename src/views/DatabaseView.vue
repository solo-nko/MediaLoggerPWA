<script setup lang="ts">
import { ref } from 'vue';
import GamesDB from '../components/database_tabs/GamesDB.vue';
import TVDB from '../components/database_tabs/TVDB.vue';

const tabs = ref('game')
</script>

<template>
	<VTabs id="tab-bar" v-model="tabs" align-tabs="center">
		<!--	<VTabs id="tab-bar" v-model="currentTab" align-tabs="center">-->
		<VTab value="game">Game</VTab>
		<VTab value="tv">TV Series</VTab>
		<VTab value="movie">Movie</VTab>
		<VTab value="book">Book</VTab>
	</VTabs>
	<VTabsWindow id="entry-form" v-model="tabs" class="">
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
			<h2>Book Entry</h2>
		</VTabsWindowItem>
	</VTabsWindow>
</template>

<style scoped>
#entry-form {
	width: 70%;
}
</style>
