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

	if (!fs.existsSync(filePath)) {
		throw new Error(`Missing environment config file: ${filePath}`);
	}

	const raw = fs.readFileSync(filePath, 'utf-8');
	const parsed = JSON.parse(raw);

	return {
		ENV: activeEnv,
		BASE_URL: process.env.BASE_URL || parsed.BASE_URL,
		USERNAME: process.env.USERNAME || parsed.USERNAME,
		PASSWORD: process.env.PASSWORD || parsed.PASSWORD,
	};
};
