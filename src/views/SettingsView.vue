<script setup lang="ts">
import ImportExport from '../components/settings/ImportExport.vue';
import AppearanceSettings from '../components/settings/AppearanceSettings.vue';
import GeneralSettings from '../components/settings/GeneralSettings.vue';
import { ref } from 'vue';

const currentTab = ref('ImportExport');
const settingsTabs = {
	ImportExport,
	AppearanceSettings,
	GeneralSettings
};
</script>

<template>
	<VContainer height="100%">
		<VRow>
			<VCol id="settings-drawer" cols="3">
				<VList>
					<VListItem title="Settings"></VListItem>
					<VDivider></VDivider>
					<VListItem link @click="currentTab = 'GeneralSettings'">General Settings</VListItem>
					<VListItem link @click="currentTab = 'ImportExport'">Import / Export Database</VListItem>
					<VListItem link @click="currentTab = 'AppearanceSettings'">Appearance</VListItem>
					<VListItem>Games Master Settings</VListItem>
					<VListItem>Television Master Settings</VListItem>
					<VListItem>Book Master Settings</VListItem>
					<VListItem>Movie Master Settings</VListItem>
				</VList>
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
</style>
