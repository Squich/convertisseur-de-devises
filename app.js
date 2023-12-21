const { createApp, ref, computed, watchEffect } = Vue;

createApp({
	setup() {
		const apiKey = '6841178b3ff0897aa27d7b56';
		const baseCurrency = ref('USD');
		const targetCurrency = ref('USD');
		const dataConversionRates = ref(null);
		const supportedCodes = ref([]);

		const exchangeRate = computed(() => {
			return dataConversionRates.value ? dataConversionRates.value[targetCurrency.value] || 1 : 1;
		});

		const fetchDataSupportedCodes = async () => {
			const requestString = `https://v6.exchangerate-api.com/v6/${apiKey}/codes`;
			try {
				const response = await fetch(requestString);
				if (!response.ok) {
					throw new Error(`Erreur lors de la requête vers l'API: ${response.status} ${response.statusText}`);
				} else {
					const data = await response.json();
					supportedCodes.value = data.supported_codes;
					console.log("Les devises ont été récupérées depuis l'API avec succès");
				}
			} catch (err) {
				console.error(`Erreur lors de la requête vers l'API : ${err.message}`);
			}
		};

		const fetchDataConversionRates = async base => {
			const requestString = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/${base}`;
			try {
				const response = await fetch(requestString);
				if (!response.ok) {
					throw new Error(`Erreur lors de la requête vers l'API: ${response.status} ${response.statusText}`);
				} else {
					const data = await response.json();
					dataConversionRates.value = data.conversion_rates;
					console.log("Les taux de change ont été récupérés depuis l'API avec succès");
				}
			} catch (err) {
				console.error(`Erreur lors de la requête vers l'API : ${err.message}`);
			}
		};

		watchEffect(() => {
			fetchDataConversionRates(baseCurrency.value);
		});

		fetchDataSupportedCodes();

		return {
			baseCurrency,
			targetCurrency,
			supportedCodes,
			exchangeRate,
		};
	},
	template: `
		<header>
			<h1>Taux de conversion</h1>
		</header>
		<main>
			<div id="base-container">
				<label for="baseCurrency">Devise de base</label>
				<select v-model="baseCurrency">
					<option v-for="code in supportedCodes" :key="code[0]" :value="code[0]">{{ code[1] }} - {{ code[0] }}</option>
				</select>
				<p class="number">1</p>
			</div>
			<div id="target-container">
				<label for="targetCurrency">Devise cible</label>
				<select v-model="targetCurrency">
					<option v-for="code in supportedCodes" :key="code[0]" :value="code[0]">{{ code[1] }} - {{ code[0] }}</option>
				</select>
				<p class="number">{{exchangeRate}}</p>
			</div>
		</main>	
	`,
}).mount('#app');
