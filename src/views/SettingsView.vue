<script setup lang="ts">
import DatabaseSettings from '../components/settings/DatabaseSettings.vue';
import AppearanceSettings from '../components/settings/AppearanceSettings.vue';
import GeneralSettings from '../components/settings/GeneralSettings.vue';
import { computed, ref } from 'vue';

const currentTab = ref('GeneralSettings');
const settingsTabs = {
	DatabaseSettings,
	AppearanceSettings,
	GeneralSettings
};

const showSettingsDrawer = ref(true);

const iconType = computed(() => {
	return showSettingsDrawer.value ? '$chevronLeft' : '$chevronRight';
});
</script>

<template>
	<VNavigationDrawer id="settings-drawer" v-model="showSettingsDrawer">
		<VListItem>
			<span>Settings</span>
		</VListItem>
		<VDivider color="primary"></VDivider>
		<VListItem link @click="currentTab = 'GeneralSettings'">General</VListItem>
		<VListItem link @click="currentTab = 'DatabaseSettings'">Import / Export Database</VListItem>
		<VListItem link @click="currentTab = 'AppearanceSettings'">Appearance</VListItem>
		<VListItem>Games Master Settings</VListItem>
		<VListItem>Television Master Settings</VListItem>
		<VListItem>Book Master Settings</VListItem>
		<VListItem>Movie Master Settings</VListItem>
	</VNavigationDrawer>
	<VContainer height="100%">
		<VRow class="settings">
			<VCol cols="1" align-self="end">
				<VFab @click="showSettingsDrawer = !showSettingsDrawer" order="-2">
					<VIcon :icon="iconType"></VIcon>
				</VFab>
			</VCol>
			<VCol>
				<Component :is="settingsTabs[currentTab]"></Component>
			</VCol>
		</VRow>
	</VContainer>

	<!--	Platform Master -->
	<!--	Status Master -->
	<!--	Themes Setting -->
</template>

<style scoped>
#settings-drawer {
	border-right: solid 1px gray;
}

.settings {
	height: 100%;
}
</style>
