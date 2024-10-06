import fs from 'fs';
import path from 'path';
import config from '../config/config';

const checkAndWatchConfig = (name: string, callback: (config: any) => void): void => {
  const pathToConfig = path.join(__dirname, '..', '..', 'config', `${name}.json`);

  const exists = fs.existsSync(pathToConfig);
  if (!exists) {
    fs.writeFileSync(pathToConfig, JSON.stringify(config, null, 2));
    callback(config);
  } else {
    const currentConfig = JSON.parse(fs.readFileSync(pathToConfig, 'utf-8'));
    let isChanged = false;
    for (const key in config) {
      if (!(key in currentConfig)) {
        currentConfig[key] = config[key as keyof typeof config];
        isChanged = true;
      }

      if (typeof config[key as keyof typeof config] === 'object') {
        const subConfig = config[key as keyof typeof config] as any;
        const currentSubConfig = currentConfig[key];
        for (const subKey in subConfig) {
          if (!(subKey in currentConfig[key])) {
            currentSubConfig[subKey] = subConfig[subKey];
            isChanged = true;
          }
        }
      }
    }

    if (isChanged) {
      fs.writeFileSync(pathToConfig, JSON.stringify(currentConfig, null, 2));
    }
    callback(currentConfig);

    fs.watch(pathToConfig, (eventType, filename) => {
      if (eventType === 'change') {
        try {
          const currentConfig = JSON.parse(fs.readFileSync(pathToConfig, 'utf-8'));
          callback(currentConfig);
        } catch (error: any) {
          console.error(`Error reading or parsing config file: ${error.message}`);
        }
      }
    });
  }
};

export default checkAndWatchConfig;
