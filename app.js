const { createApp, ref, computed, watchEffect } = Vue;

createApp({
	setup() {
		const apiKey = '6841178b3ff0897aa27d7b56';
		const baseCurrency = ref('USD');
		const targetCurrency = ref('USD');
		const supportedCodes = ref();
		const conversionRates = ref();

		const isLoadingSupportedCodes = ref(true);
		const isLoadingConversionRates = ref(true);
		const errorFetchingSupportedCodes = ref(false);
		const errorFetchingConversionRates = ref(false);

		const isLoading = computed(() => isLoadingSupportedCodes.value || isLoadingConversionRates.value);
		const error = computed(() => errorFetchingSupportedCodes.value || errorFetchingConversionRates.value);

		const exchangeRate = computed(() => {
			return conversionRates.value ? conversionRates.value[targetCurrency.value] : 1;
		});

		const fetchSupportedCodes = async () => {
			isLoadingSupportedCodes.value = true;
			try {
				const response = await fetch(`https://v6.exchangerate-api.com/v6/${apiKey}/codes`);
				const data = await response.json();
				supportedCodes.value = data.supported_codes;
				errorFetchingSupportedCodes.value = false;
				console.log('Chargement des devises OK');
			} catch (err) {
				supportedCodes.value = undefined;
				errorFetchingSupportedCodes.value = true;
				console.error(`Chargement des devises KO : ${err.message}`);
			}
			isLoadingSupportedCodes.value = false;
		};

		const fetchConversionRates = async base => {
			isLoadingConversionRates.value = true;
			try {
				const response = await fetch(`https://v6.exchangerate-api.com/v6/${apiKey}/latest/${base}`);
				const data = await response.json();
				conversionRates.value = data.conversion_rates;
				errorFetchingConversionRates.value = false;
				console.log('Chargement des taux de change OK');
			} catch (err) {
				conversionRates.value = undefined;
				errorFetchingConversionRates.value = true;
				console.error(`Chargement des taux de change KO : ${err.message}`);
			}
			isLoadingConversionRates.value = false;
		};

		watchEffect(() => {
			fetchConversionRates(baseCurrency.value);
		});

		fetchSupportedCodes();

		return {
			baseCurrency,
			targetCurrency,
			supportedCodes,
			exchangeRate,
			isLoading,
			error,
		};
	},
}).mount('#app');
