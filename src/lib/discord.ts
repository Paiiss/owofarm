import { Client, Message, TextChannel, Options } from 'discord.js-selfbot-v13';
import Logger from '../tools/logger';
import config from '../config/config';
import { superscriptToNumber } from '../tools/format';
import { Items, Gems } from '../enums/items';
import sleep from '../tools/sleep';

class AutoFarm {
  private token: string = '';
  private logger: Logger;
  private client: Client;
  private setting: typeof config;
  private botStatus: boolean = true;
  private botReady: boolean = false;
  private timeoutId = {
    hunt: 0 as unknown as NodeJS.Timeout,
    battle: 0 as unknown as NodeJS.Timeout,
    pray: 0 as unknown as NodeJS.Timeout,
    curse: 0 as unknown as NodeJS.Timeout,
    inventory: 0 as unknown as NodeJS.Timeout,
    checklist: 0 as unknown as NodeJS.Timeout,
  };
  private inventory = {} as any;
  private checkList = {
    daily: false,
    vote: false,
    cookie: false,
    quest: false,
    lootbox: false,
    crate: false,
  };
  private total = {
    hunt_exp: 0,
    hunt: 0,
  };

  constructor(token: string, setting: typeof config = config) {
    this.token = token;
    this.client = new Client({
      sweepers: {
        ...Options.defaultSweeperSettings,
        /* messages: {
          interval: 10,
          lifetime: 15
        } */
      },
    });
    this.logger = new Logger();
    this.setting = setting;
    if (!setting.channels.hunt) this.logger.danger('Channel ID not found');
  }

  start(): void {
    console.log('Starting AutoFarm');

    this.client.on('ready', async () => {
      this.logger.setID(this.client.user?.username as string);
      this.logger.info('AutoFarm is ready!');
      this.sendMessage(this.setting.channels.hunt, 'AutoFarm is ready!');
    });

    this.client
      .login(this.token)
      .then(() => {
        this.logger.info('Logged in');
        this.autoChecklist();
      })
      .catch((err) => {
        if (err.code === 'TOKEN_INVALID') {
          this.logger.danger('Invalid token');
        } else {
          this.logger.danger('An error occurred while logging in');
        }
      });

    this.client.on('messageCreate', async (message) => {
      if (message.author.id !== this.setting.owoId) return;
      // OwO Captcha Handler
      if (
        message.content.match(/human|captcha|dm|banned|https:\/\/owobot.com\/captcha/g) &&
        (message.content.match(new RegExp(`${this.client.user?.id}`, 'g')) ||
          message.mentions.users.first()?.id === this.client.user?.id)
      )
        return this.handleOwoCaptcha();

      // OwO Verification Handler
      if (message.channel.type === 'DM' && message.content.match(/👍|verified|Thank you! :3/g))
        this.handleOwoSuccessVerification(message.content);

      // CheckList Handler
      if (
        message.channelId === this.setting.channels.hunt &&
        message.embeds[0]?.description &&
        message.embeds[0]?.author?.name?.match(
          new RegExp(`${message.guild?.members.me?.nickname || this.client.user?.displayName}'s Checklist`, 'g')
        )
      )
        this.handleCheckList(message.embeds[0].description);

      // Check Hunt Gems
      if (
        message.content?.match(
          new RegExp(`${message.guild?.members.me?.nickname || this.client.user?.displayName}\\*\\*, hunt`, 'g')
        )
      )
        this.handleHuntGems(message.content);

      // Inventory Handler
      if (
        message.content?.match(
          new RegExp(`${message.guild?.members.me?.nickname || this.client.user?.displayName}'s Inventory`, 'g')
        )
      )
        this.handleInventory(message.content);
    });
  }

  handleOwoCaptcha() {
    this.botStatus = false;
    this.botReady = false;
    this.logger.info('OwO captcha detected');
    this.stopAutoFarm();
  }

  handleOwoSuccessVerification(message: string): void {
    this.logger.info('OwO verification success');
    this.botStatus = true;
    this.autoChecklist();
  }

  private handleCheckList(message: string): void {
    this.logger.info('Checking checklist 📜');
    if (message.match(/⬛ 🎁/g)) {
      this.sendMessage(this.setting.channels.hunt, this.randomPrefix(['daily']));
      this.checkList.daily = true;
    } else {
      this.checkList.daily = true;
    }

    if (message.match(/⬛ 🍪/g)) {
      if (this.setting.status.cookie) {
        this.logger.info('Sending cookie 🍪');
        this.sendMessage(
          this.setting.channels.hunt,
          this.randomPrefix(['cookie']) + ` <@${this.setting.target.cookie || this.setting.owoId}>`
        );
        this.checkList.cookie = true;
      }
    }

    this.checkList.vote = message.match(/⬛ 📝/g) ? false : true;
    this.checkList.quest = message.match(/⬛ 📜/g) ? false : true;
    this.checkList.lootbox = message.match(/⬛ 💎/g) ? false : true;
    this.checkList.crate = message.match(/⬛ ⚔/g) ? false : true;

    let checkListMessage: string[] = [];
    for (const key in this.checkList) {
      const value = this.checkList[key as keyof typeof this.checkList];
      checkListMessage.push(`${value ? '✅' : '❌'} ${key}`);
    }

    this.logger.info(`Checklist: ${checkListMessage.join(' | ')}`);

    if (
      this.checkList.daily &&
      this.checkList.cookie &&
      this.checkList.quest &&
      this.checkList.lootbox &&
      this.checkList.crate
    ) {
      this.logger.info('All checklist completed ✅');
      if (this.setting.checklist_completed) this.stopAutoFarm();
    }

    if (!this.botReady) {
      this.botReady = true;
      this.startAutoFarm();
    }
  }

  private handleHuntGems(message: string): void {
    this.total.hunt += 1;
    const gems: (keyof typeof Gems)[] = [];

    if (!message.includes('gem1')) gems.push('huntgem');
    if (!message.includes('gem3')) gems.push('empgem');
    if (!message.includes('gem4')) gems.push('luckgem');

    if (gems.length > 0) {
      this.logger.info(`Missing gems: ${gems.join(', ')}`);
      if (this.setting.status.gems) {
        let userGems = [];
        for (const gem of gems) {
          let getGem = Object.keys(this.inventory).find((item: any) => Gems[gem].includes(item));
          if (getGem) {
            userGems.push(getGem);
          }
        }

        if (userGems.length > 0) this.useGem(userGems);
      }
    }

    let match;
    const xpRegex = /gained \*\*(\d+)xp\*\*/g;
    while ((match = xpRegex.exec(message)) !== null) {
      const xp = parseInt(match[1], 10);
      this.total.hunt_exp += xp;
    }

    this.logger.info(`Total XP from hunting: ${this.total.hunt_exp}`);
  }

  private handleInventory(message: string): void {
    const regex = /`(\d+|2--)`<a?:\w+:\d+>([⁰¹²³⁴⁵⁶⁷⁸⁹]+)/g;
    let match;
    const result = {} as { [key: string]: number };

    while ((match = regex.exec(message)) !== null) {
      const quantity: string = match[1];
      const itemCount: number = superscriptToNumber(match[2]);

      result[quantity] = itemCount;
    }
    this.inventory = result;

    if (Items.Crate in this.inventory && this.setting.status.crate) this.openCrate;
    if (Items.Lootbox in this.inventory && this.setting.status.lootbox) this.openLootbox;
    if (Items.LootboxFabled in this.inventory && this.setting.status.lootbox_fabled) this.openLootboxfabled;
  }

  async sendMessage(channel: string, message: string): Promise<void> {
    if (!this.botStatus) return this.logger.danger('Bot is not ready');
    const channelToSend = this.client.channels.cache.get(channel) as TextChannel;
    if (!channelToSend) this.logger.danger('Channel not found');
    if (this.setting.typing) await channelToSend.sendTyping();
    channelToSend?.send(message).catch((err) => {
      this.logger.danger(`An error occurred while sending a message: ${err}`);
    });
  }

  randomPrefix(message: string[]): string {
    return (
      ['owo', this.setting.prefix || 'owo'][Math.floor(Math.random() * 2)] +
      ' ' +
      message[Math.floor(Math.random() * message.length)]
    );
  }

  async startAutoFarm(): Promise<void> {
    if (!this.botStatus) return this.logger.danger('Bot is not ready');
    this.autoInventory();
    if (this.setting.status.hunt) this.autoHunt(), await sleep(2000);
    if (this.setting.status.battle) this.autoBattle(), await sleep(2000);
    if (this.setting.status.pray) this.autoPray(), await sleep(2000);
    if (this.setting.status.curse) this.autoCurse(), await sleep(2000);
  }

  private sendCheckList(): void {
    this.logger.info('Sending checklist 📜');
    this.sendMessage(this.setting.channels.hunt, this.randomPrefix(['cl', 'checklist']));
  }

  private async autoHunt(): Promise<void> {
    this.logger.info('Hunting');
    await this.sendMessage(this.setting.channels.hunt, this.randomPrefix(['hunt', 'h']));
    this.timeoutId.hunt = setTimeout(
      () => {
        this.autoHunt();
      },
      Math.floor(
        Math.random() * (this.setting.interval.hunt.fastestTime - this.setting.interval.hunt.slowestTime + 1) +
          this.setting.interval.hunt.slowestTime
      )
    );
  }

  private async autoBattle(): Promise<void> {
    this.logger.info('Battling');
    await this.sendMessage(this.setting.channels.hunt, this.randomPrefix(['battle', 'b']));
    this.timeoutId.battle = setTimeout(
      () => {
        this.autoBattle();
      },
      Math.floor(
        Math.random() * (this.setting.interval.battle.fastestTime - this.setting.interval.battle.slowestTime + 1) +
          this.setting.interval.battle.slowestTime
      )
    );
  }

  private async autoPray(): Promise<void> {
    this.logger.info('Praying');
    let txt = this.setting.target.pray ? ` <@${this.setting.target.pray}>` : '';
    await this.sendMessage(this.setting.channels.hunt, this.randomPrefix(['pray']) + txt);

    this.timeoutId.pray = setTimeout(async () => {
      this.autoPray();
    }, this.setting.interval.pray);
  }

  private async autoCurse(): Promise<void> {
    this.logger.info('Cursing');
    let txt = this.setting.target.curse ? ` <@${this.setting.target.curse}>` : '';
    await this.sendMessage(this.setting.channels.hunt, this.randomPrefix(['curse']) + txt);

    this.timeoutId.curse = setTimeout(async () => {
      this.autoCurse();
    }, this.setting.interval.curse);
  }

  private async autoChecklist(): Promise<void> {
    await this.sendCheckList();

    this.timeoutId.checklist = setTimeout(async () => {
      this.autoChecklist();
    }, this.setting.interval.checklist);
  }

  private autoInventory(): void {
    this.logger.info('Checking inventory 🧾');
    this.sendMessage(this.setting.channels.hunt, this.randomPrefix(['inv', 'inventory']));

    if (!this.setting.status.inventory) return;

    this.timeoutId.inventory = setTimeout(async () => {
      this.autoInventory();
    }, this.setting.interval.inventory);
  }

  private openLootbox(): void {
    this.logger.info('Opening lootbox 🎁');
    this.sendMessage(this.setting.channels.hunt, this.randomPrefix(['lootbox', 'lb']) + ' all');
  }

  private openLootboxfabled(): void {
    this.logger.info('Opening lootbox fabled 🎁');
    this.sendMessage(this.setting.channels.hunt, this.randomPrefix(['lootbox', 'lb']) + ' fabled all');
  }

  private openCrate(): void {
    this.logger.info('Opening crate 📦');
    this.sendMessage(this.setting.channels.hunt, this.randomPrefix(['crate']) + ' all');
  }

  private useGem(gem: string[]): void {
    this.logger.info(`Using gem: ${gem.join(', ')}`);
    this.sendMessage(this.setting.channels.hunt, this.randomPrefix(['use']) + ` ${gem.join(' ')}`);
  }

  stopAutoFarm(): void {
    for (const id in this.timeoutId) {
      const key = id as keyof typeof this.timeoutId;
      if (this.timeoutId[key]) clearTimeout(this.timeoutId[key]);
    }
  }
}

export default AutoFarm;
