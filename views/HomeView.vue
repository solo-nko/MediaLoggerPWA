<script setup lang="ts">
import { ref } from 'vue';
import GameLog from '../types/GameLog.ts';

const nowPlayingGames = ref([
	{
		title: 'Game1',
		platform: 'PC'
	},
	{
		title: 'Game2',
		platform: 'GameCube'
	},
	{
		title: 'Game3',
		platform: 'PS5'
	}
]);
</script>

<template>
	<h1>Welcome to the Media Logger!</h1>
	<VContainer>
		<VRow justify="space-around">
			<VCard>
				<VCardTitle>Current Games</VCardTitle>
				<VList>
					<VListItem v-for="game in nowPlayingGames">
						<VListItemTitle></VListItemTitle>
					</VListItem>
				</VList>
			</VCard>
			<VCard>
				<VCardTitle>Current Television</VCardTitle>
			</VCard>
		</VRow>

	</VContainer>


</template>

<style scoped>

</style>