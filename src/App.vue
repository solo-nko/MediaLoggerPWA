<script setup lang="ts">
import { RouterView } from 'vue-router';
</script>

<template>
	<VApp>
		<VAppBar title="Media Logger"></VAppBar>
		<VMain>
			<RouterView></RouterView>
		</VMain>

		<VBottomNavigation grow>
			<VBtn :to="{ name: 'Home' }">Home</VBtn>
			<VBtn :to="{ name: 'Entry' }">Entry</VBtn>
			<VBtn :to="{ name: 'Database' }">Log</VBtn>
		</VBottomNavigation>
	</VApp>
</template>

<style scoped>

</style>
