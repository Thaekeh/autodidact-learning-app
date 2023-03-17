import axios from "axios";

const TRANSLATION_ENDPOINT = "https://api.cognitive.microsofttranslator.com/";

export const translateWord = async (
	word: string,
	sourceLanguage: string,
	targetLanguage: string
) => {
	const { v4: uuidv4 } = require("uuid");

	const location = "westeurope";
	console.log(process.env.AZURE_KEY);

	const response = await axios({
		baseURL: TRANSLATION_ENDPOINT,
		url: "/translate",
		method: "post",
		headers: {
			"Ocp-Apim-Subscription-Key": "fbf93cbea2dc450d8a461e616dde72f1",
			"Ocp-Apim-Subscription-Region": location,
			"Content-type": "application/json",
			"X-ClientTraceId": uuidv4().toString(),
		},
		params: {
			"api-version": "3.0",
			from: sourceLanguage,
			to: targetLanguage,
		},
		data: [
			{
				text: word,
			},
		],
		responseType: "json",
	});
	return JSON.stringify(response.data[0].translations[0].text);
};
