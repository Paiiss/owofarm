import { Client } from 'discord.js-selfbot-v13'
import Logger from '../tools/logger';

class AutoFarm {
  private token: string = '';
  private logger: Logger;
  private client: Client;

  constructor(token: string) {
    this.token = token;
    this.client = new Client();
    this.logger = new Logger();
  }

  start(): void {
    console.log('Starting AutoFarm');

    this.client.on('ready', async () => {
      this.logger.setID(this.client.user?.username as string);
      this.logger.info('AutoFarm is ready!');
    })

    this.client.login(this.token).catch((err) => {
      if (err.code === 'TOKEN_INVALID') {
        console.error('Invalid token');
      } else {
        console.error(err.message)
      }
    })
  }

}

export default AutoFarm;
