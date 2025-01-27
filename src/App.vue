<script setup lang="ts">
import { RouterView } from 'vue-router';
</script>

<template>
	<VApp>
		<VAppBar color="primary">
			<VAppBarTitle>Media Logger</VAppBarTitle>
		</VAppBar>
		<VMain id="content-area">
			<VContainer>
				<RouterView v-slot="{ Component }">
					<KeepAlive>
						<Component :is="Component"></Component>
					</KeepAlive>
				</RouterView>
			</VContainer>
		</VMain>
		<VBottomNavigation grow bg-color="primary" color="textOnColor" order="-1" tag="footer">
			<VBtn :to="{ name: 'Home' }"><VIcon icon="$home"></VIcon>Home</VBtn>
			<VBtn :to="{ name: 'Entry' }"><VIcon icon="$add"></VIcon> Entry</VBtn>
			<VBtn :to="{ name: 'Database' }"><VIcon icon="$table"></VIcon>Log</VBtn>
			<VBtn :to="{ name: 'Settings' }"><VIcon icon="$settings"></VIcon>Settings</VBtn>
		</VBottomNavigation>
	</VApp>
</template>

<style scoped>
#content-area {
	height: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
}
</style>
