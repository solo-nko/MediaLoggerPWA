<script setup lang="ts">
import { liveQuery } from 'dexie';
import { useObservable } from '@vueuse/rxjs';
import { appDatabase } from '../src/database/db';
import { ref } from 'vue';

// ref may be required
const games = useObservable(liveQuery(() => appDatabase.games.toArray()))

</script>

<template>
	<VTabs></VTabs>
	<VList title="Database">
		<VListItem v-for="game in games" :key="game.id">{{ game.title }}</VListItem>
	</VList>
</template>

<style scoped>

</style>