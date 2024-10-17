<script setup lang="ts">
import { RouterView } from 'vue-router';
</script>

<template>
	<VApp>
		<VContainer>
			<VRow>
				<VAppBar color="primary">
					<VAppBarTitle>Media Logger</VAppBarTitle>
				</VAppBar>
			</VRow>
			<VRow>
				<VMain id="content-area">
					<RouterView v-slot="{ Component }">
						<KeepAlive>
							<Component :is="Component"></Component>
						</KeepAlive>
					</RouterView>
				</VMain>
			</VRow>
			<VRow>
				<VBottomNavigation grow bg-color="primary" color="textOnColor" order="-1" tag="footer">
					<VBtn :to="{ name: 'Home' }">Home</VBtn>
					<VBtn :to="{ name: 'Entry' }">Entry</VBtn>
					<VBtn :to="{ name: 'Database' }">Log</VBtn>
					<VBtn :to="{ name: 'Settings' }">Settings</VBtn>
				</VBottomNavigation>
			</VRow>
		</VContainer>
	</VApp>
</template>

<style scoped>
#content-area {
	display: flex;
	flex-direction: column;
	align-items: center;
}
</style>
