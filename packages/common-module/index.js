import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SUPPORTED_ENVS = ['SIT', 'UAT'];

export const getActiveEnv = () => {
	const selectedEnv = (process.env.ENV || 'SIT').toUpperCase();
	return SUPPORTED_ENVS.includes(selectedEnv) ? selectedEnv : 'SIT';
};

export const getEnvConfig = () => {
	const activeEnv = getActiveEnv();
	const fileName = `env.${activeEnv.toLowerCase()}.json`;
	const filePath = path.join(__dirname, 'config', fileName);
	let parsed = {};

	if (fs.existsSync(filePath)) {
		const raw = fs.readFileSync(filePath, 'utf-8');
		parsed = JSON.parse(raw);
	}

	let jsonFromSecret = {};
	if (process.env.TEST_CONFIG_JSON) {
		jsonFromSecret = JSON.parse(process.env.TEST_CONFIG_JSON);
	}

	const config = {
		...parsed,
		...jsonFromSecret,
		ENV: activeEnv,
	};

	if (process.env.BASE_URL) config.BASE_URL = process.env.BASE_URL;
	if (process.env.USERNAME) config.USERNAME = process.env.USERNAME;
	if (process.env.PASSWORD) config.PASSWORD = process.env.PASSWORD;

	if (!config.BASE_URL || !config.USERNAME || !config.PASSWORD) {
		throw new Error(
			`Incomplete environment config for ${activeEnv}. Provide BASE_URL/USERNAME/PASSWORD via GitHub Environment secrets or local ${fileName}.`
		);
	}

	return config;
};
