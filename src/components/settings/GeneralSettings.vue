<script setup lang="ts">
import { settingsStore } from '../../stores/settings.ts';
</script>

<template>
	<h1>General</h1>
	<VContainer>
		<VRow>
			<VCol>
				<VRadioGroup label="Default database screen" v-model="settingsStore.defaultDBScreen">
					<VRadio label="Games" value="game"></VRadio>
					<VRadio label="TV" value="tv"></VRadio>
					<VRadio label="Movies" value="movie"></VRadio>
					<VRadio label="Books" value="book"></VRadio>
				</VRadioGroup>
			</VCol>
			<VCol>
				<VRadioGroup label="Default log entry screen" v-model="settingsStore.defaultEntryScreen">
					<VRadio label="Games" value="game"></VRadio>
					<VRadio label="TV" value="tv"></VRadio>
					<VRadio label="Movies" value="movie"></VRadio>
					<VRadio label="Books" value="book"></VRadio>
				</VRadioGroup>
			</VCol>
		</VRow>
	</VContainer>
</template>

<style scoped></style>
