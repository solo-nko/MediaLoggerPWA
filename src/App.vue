<script setup lang="ts">
import { RouterView } from 'vue-router';
</script>

<template>
	<VApp>
		<VAppBar color="primary">
			<VAppBarTitle>Media Logger</VAppBarTitle>
		</VAppBar>

		<VMain id="content-area">
			<RouterView v-slot="{ Component }">
				<KeepAlive>
					<Component :is="Component"></Component>
				</KeepAlive>
			</RouterView>
		</VMain>

		<VBottomNavigation grow bg-color="primary" color="textOnColor" order="-1" tag="footer">
			<VBtn :to="{ name: 'Home' }">Home</VBtn>
			<VBtn :to="{ name: 'Entry' }">Entry</VBtn>
			<VBtn :to="{ name: 'Database' }">Log</VBtn>
			<VBtn :to="{ name: 'Settings' }">Settings</VBtn>
		</VBottomNavigation>
	</VApp>
</template>

<style scoped>
#content-area {
	display: flex;
	flex-direction: column;
	align-items: center;
}
</style>
