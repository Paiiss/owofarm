import discord from './lib/discord'
import dotenv from 'dotenv'
dotenv.config()

new discord(process.env.TOKEN as string).start()