import { Client, Message, TextChannel } from 'discord.js-selfbot-v13'
import Logger from '../tools/logger';
import config from '../config/config';

class AutoFarm {
  private token: string = '';
  private logger: Logger;
  private client: Client;
  private setting: typeof config;
  private botStatus: boolean = true;
  private channel = {
    hunt: '',
    pray: '',
    curse: '',
  }
  private timeoutId = {
    hunt: 0 as unknown as NodeJS.Timeout,
    battle: 0 as unknown as NodeJS.Timeout,
    pray: 0 as unknown as NodeJS.Timeout,
    curse: 0 as unknown as NodeJS.Timeout,
  }
  private checkList = {
    daily: false,
    vote: false,
    cookie: false,
    quest: false,
    lootbox: false,
    crate: false,
  }

  constructor(token: string, setting: typeof config = config) {
    this.token = token;
    this.client = new Client();
    this.logger = new Logger();
    this.setting = setting;
    if (!setting.channels.hunt) this.logger.danger('Channel ID not found');
    this.channel = {
      hunt: setting.channels.hunt,
      pray: setting.channels.quest || setting.channels.hunt,
      curse: setting.channels.quest || setting.channels.hunt,
    }
  }

  start(): void {
    console.log('Starting AutoFarm');

    this.client.on('ready', async () => {
      this.logger.setID(this.client.user?.username as string);
      this.logger.info('AutoFarm is ready!');
      this.sendMessage(this.setting.channels.hunt, 'AutoFarm is ready!')
    })

    this.client.login(this.token).then(() => {
      this.logger.info('Logged in');
      this.sendCheckList()
      this.startAutoFarm();
    }).catch((err) => {
      if (err.code === 'TOKEN_INVALID') {
        this.logger.danger('Invalid token');
      } else {
        this.logger.danger('An error occurred while logging in');
      }
    })

    this.client.on('messageCreate', async (message) => {
      // OwO Captcha Handler
      if (message.author.id === this.setting.owoId && message.content.match(/human|captcha|dm|banned|https:\/\/owobot.com\/captcha/g) && (message.content.match(new RegExp(`${this.client.user?.id}`, 'g')) || message.mentions.users.first()?.id === this.client.user?.id)) return this.handleOwoCaptcha(), console.log(message)

      // OwO Verification Handler 
      if (message.author.id === this.setting.owoId && message.channel.type === 'DM' && message.content.match(/👍|verified|Thank you! :3/g)) this.handleOwoSuccessVerification(message.content)

      // CheckList Handler
      if (message.channelId === this.setting.channels.hunt && message.author.id === this.setting.owoId && message.embeds[0]?.description && message.embeds[0]?.author?.name?.match(new RegExp(`${message.guild?.members.me?.nickname}'s Checklist`, 'g'))) this.handleCheckList(message.embeds[0].description)
    })
  }

  handleOwoCaptcha() {
    this.botStatus = false
    this.logger.info('OwO captcha detected')
    this.stopAutoFarm()
  }

  handleOwoSuccessVerification(message: string): void {
    this.logger.info('OwO verification success')
    this.botStatus = true
    this.startAutoFarm()
  }

  private handleCheckList(message: string): void {
    this.logger.info('Checking checklist 📜')
    if (message.match(/⬛ 🎁/g)) {
      this.sendMessage(this.setting.channels.hunt, this.randomPrefix(['daily']))
      this.checkList.daily = true
    } else {
      this.checkList.daily = true
    }
    if (message.match(/⬛ 📝/g)) {
      this.checkList.vote = false
    } else {
      this.checkList.vote = true
    }

    if (message.match(/⬛ 🍪/g)) {
      this.checkList.cookie = false
    } else {
      this.checkList.cookie = true
    }

    if (message.match(/⬛ 📜/g)) {
      this.checkList.quest = false
    } else {
      this.checkList.quest = true
    }

    if (message.match(/⬛ 💎/g)) {
      this.checkList.lootbox = false
    } else {
      this.checkList.lootbox = true
    }

    if (message.match(/⬛ ⚔/g)) {
      this.checkList.crate = false
    } else {
      this.checkList.crate = true
    }

    let checkListMessage: string[] = []
    for (const key in this.checkList) {
      const value = this.checkList[key as keyof typeof this.checkList]
      checkListMessage.push(`${value ? '✅' : '❌'} ${key}`)
    }

    this.logger.info(`Checklist: ${checkListMessage.join(' | ')}`)

    if (this.checkList.daily && this.checkList.vote && this.checkList.cookie && this.checkList.quest && this.checkList.lootbox && this.checkList.crate) {
      this.logger.info('All checklist completed ✅')
      if (this.setting.checklist_completed) this.stopAutoFarm()
    }
  }

  async sendMessage(channel: string, message: string): Promise<void> {
    if (!this.botStatus) return this.logger.danger('Bot is not ready')
    const channelToSend = this.client.channels.cache.get(channel) as TextChannel
    if (!channelToSend) this.logger.danger('Channel not found')
    if (this.setting.typing) await channelToSend.sendTyping()
    channelToSend?.send(message).catch((err) => {
      this.logger.danger(`An error occurred while sending a message: ${err}`);
    })
  }

  randomPrefix(message: string[]): string {
    return ['owo', this.setting.prefix || 'owo'][Math.floor(Math.random() * 2)] + ' ' + message[Math.floor(Math.random() * message.length)]
  }

  async startAutoFarm(): Promise<void> {
    if (!this.botStatus) return this.logger.danger('Bot is not ready')
    if (this.setting.status.hunt) this.autoHunt()
    if (this.setting.status.battle) this.autoBattle()
    if (this.setting.status.pray) this.autoPray()
    if (this.setting.status.curse) this.autoCurse()
  }

  private async sendCheckList(): Promise<void> {
    this.logger.info('Sending checklist 📜')
    this.sendMessage(this.setting.channels.hunt, this.randomPrefix(['cl', 'checklist']))
  }

  private async autoHunt(): Promise<void> {
    this.timeoutId.hunt = setTimeout(async () => {
      this.logger.info('Hunting')
      await this.sendMessage(this.setting.channels.hunt, this.randomPrefix(['hunt', 'h']))
      this.autoHunt()
    }, Math.floor(Math.random() * (this.setting.interval.hunt.fastestTime - this.setting.interval.hunt.slowestTime + 1) + this.setting.interval.hunt.slowestTime))
  }

  private async autoBattle(): Promise<void> {
    this.timeoutId.battle = setTimeout(async () => {
      this.logger.info('Battling')
      await this.sendMessage(this.setting.channels.hunt, this.randomPrefix(['battle', 'b']))
      this.autoBattle()
    }, Math.floor(Math.random() * (this.setting.interval.battle.fastestTime - this.setting.interval.battle.slowestTime + 1) + this.setting.interval.battle.slowestTime))
  }

  private async autoPray(): Promise<void> {
    this.logger.info('Praying')
    await this.sendMessage(this.setting.channels.quest, this.randomPrefix(['pray']))

    this.timeoutId.pray = setTimeout(async () => {
      this.logger.info('Praying')
      await this.sendMessage(this.setting.channels.quest, this.randomPrefix(['pray']))
      this.autoPray()
    }, this.setting.interval.pray)
  }

  private async autoCurse(): Promise<void> {
    this.logger.info('Cursing')
    await this.sendMessage(this.setting.channels.quest, this.randomPrefix(['curse']))

    this.timeoutId.curse = setTimeout(async () => {
      this.logger.info('Cursing')
      await this.sendMessage(this.setting.channels.quest, this.randomPrefix(['curse']))
      this.autoCurse()
    }, this.setting.interval.curse)
  }

  stopAutoFarm(): void {
    for (const id in this.timeoutId) {
      const key = id as keyof typeof this.timeoutId;
      if (this.timeoutId[key]) clearTimeout(this.timeoutId[key])
    }
  }
}

export default AutoFarm;
