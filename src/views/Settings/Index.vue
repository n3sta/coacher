<template>
	<div>
		<v-container fluid grid-list-md>
			<v-layout row wrap>
				<v-flex xs12 sm6 md3 @click="$router.push({name: 'account'})">
					<v-card class="settings-box">
						<v-icon>build</v-icon>	
						<span class="title">Konto</span>
					</v-card>
				</v-flex>
				<v-flex xs12 sm6 md3 @click="$router.push({name: 'pupils'})">
					<v-card class="settings-box">
						<v-icon>people</v-icon>	
						<span class="title">Zawodnicy</span>
					</v-card>
				</v-flex>
				<v-flex xs12 sm6 md3 @click="$router.push({name: 'trainings'})">
					<v-card class="settings-box">
						<v-icon>directions_run</v-icon>	
						<span class="title">Treningi</span>
					</v-card>
				</v-flex>
				<v-flex xs12 sm6 md3 @click="$router.push({name: 'questions'})">
					<v-card class="settings-box">
						<v-icon>list</v-icon>	
						<span class="title">Ankieta</span>
					</v-card>
				</v-flex>
				<v-flex xs12 sm6 md3>
					<v-card class="settings-box">
						<v-icon>compare_arrows</v-icon>	
						<span class="title">Integracje</span>
					</v-card>
				</v-flex>
				<v-flex xs12 sm6 md3>
					<v-card class="settings-box">
						<v-icon>import_export</v-icon>	
						<span class="title">Import/export</span>
					</v-card>
				</v-flex>
			</v-layout>
		</v-container>
	</div>
</template>

<script>
	export default {

	}
</script>