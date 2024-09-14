<script setup lang="ts">
import { appDatabase } from '../src/database/db.ts';
import { ref } from 'vue';
import { GameStatus } from '../types/GameStatus.ts';
import { DateTime } from 'luxon';

const gameStatus = Object.values(GameStatus);

const gameLogEntry = ref({
	title: null,
	progress: null,
	platform: null,
	status: null,
	modifiedDate: null
});

function resetFields() {
	for (const key in gameLogEntry.value) {
		gameLogEntry.value[key] = null;
	}
}

async function addGame() {
	let luxonModified: DateTime;
	if (gameLogEntry.value.modifiedDate) {
		luxonModified = DateTime.fromISO(gameLogEntry.value.modifiedDate);
	} else {
		luxonModified = DateTime.now()
	}
	const id = await appDatabase.games.add({
		title: gameLogEntry.value.title,
		platform: gameLogEntry.value.platform,
		progress: gameLogEntry.value.progress,
		status: gameLogEntry.value.status,
		dateCreated: DateTime.now().toString(),
		// if date hasn't been modified in the UI, use the current time
		dateModified: luxonModified.toString()
	});
	resetFields();
}

</script>

<template>
	<VCard id="card">
		<VCardTitle>Log Entry</VCardTitle>
		<VTextField label="Title" v-model="gameLogEntry.title"></VTextField>
		<VTextField label="Platform" v-model="gameLogEntry.platform"></VTextField>
		<VAutocomplete label="Status" :items="gameStatus" v-model="gameLogEntry.status"></VAutocomplete>
		<VTextarea label="Progress" v-model="gameLogEntry.progress" rows="2" no-resize></VTextarea>
		<div id="editor"></div>
		<VTextField label="Date Updated (if applicable)" type="date" v-model="gameLogEntry.modifiedDate"></VTextField>

		<VCardActions>
			<VBtn @click="addGame">Save</VBtn>
		</VCardActions>
	</VCard>
</template>

<style scoped>
#card {
	width: 70%;
	padding: 3rem;
}

#editor {
	border: black solid 1px;
}
</style>