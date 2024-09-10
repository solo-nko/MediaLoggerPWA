<script setup lang="ts">
import { appDatabase } from '../src/database/db.ts';
import { ref } from 'vue';

const titleEntry = ref('')
const platformEntry = ref('')

async function addGame() {
		const id = await appDatabase.games.add({
			title: titleEntry.value,
			platform: platformEntry.value,
		})
}

</script>

<template>
<VCard id="card">
	<VCardTitle>Log Entry</VCardTitle>
	<VTextField label="Title" v-model="titleEntry"></VTextField>
	<VTextField label="Platform" v-model="platformEntry"></VTextField>
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
</style>