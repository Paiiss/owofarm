import fs from 'fs';
import path from 'path';
import config from '../config/config';

const checkConfig = (name: string): typeof config => {
  const pathToConfig = path.join(__dirname, '..', '..', 'config', `${name}.json`);
  const exists = fs.existsSync(pathToConfig);
  if (!exists) {
    fs.writeFileSync(pathToConfig, JSON.stringify(config, null, 2));

    return config as typeof config;
  } else {
    const currentConfig = JSON.parse(fs.readFileSync(pathToConfig, 'utf-8'));
    for (const key in config) {
      if (!currentConfig[key]) {
        currentConfig[key] = config[key as keyof typeof config];
      }
    }
    fs.writeFileSync(pathToConfig, JSON.stringify(currentConfig, null, 2));

    return currentConfig as typeof config;
  }
};

export default checkConfig;
