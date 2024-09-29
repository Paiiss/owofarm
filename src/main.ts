import discord from './lib/discord';
import dotenv from 'dotenv';
dotenv.config();

const token = process.env.TOKEN?.toString()?.split(',');

if (token) {
  token.forEach((t) => {
    new discord(t);
  });
} else {
  console.log('No token found');
}
