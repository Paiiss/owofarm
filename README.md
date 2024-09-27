# OwoFarm

A fully automated farming bot for the popular Owo bot on Discord. This bot is designed to automate various Owo bot commands like hunting, battling, and more, helping you collect resources and improve your progress effortlessly!

## Features

- **Auto Hunting (`owo hunt`)**: Automatically hunts for animals with customizable intervals.
- **Auto Battling (`owo battle`)**: Engage in battles with predefined strategies and commands.
- **Customizable Timing**: Set intervals between commands to avoid detection.
- **Anti-Detection Measures**: Implements randomization in command timings to reduce the risk of being flagged by Discord or Owo bot's anti-bot systems.
- **Support for Multiple Accounts**: Can be configured to run on multiple Discord accounts.

## Setup & Usage

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Paiiss/owofarm.git
   cd owofarm
   ```
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Configure the bot**:

   - Update the `.env` file with your Discord bot token and Owo bot configurations.
   - Customize the bot's settings in `src/config.ts` as needed.

4. **Build the bot**:

   ```bash
   npm run build
   ```

5. **Run the bot**:
   ```bash
   npm start
   ```

## Notes

- Use this bot responsibly and at your own risk. Automating Discord bots can potentially violate Discord’s and Owo bot’s terms of service.
- This project is meant for educational purposes only.

---

This description provides a clear overview of the bot's purpose, features, setup instructions, and important disclaimers, ensuring potential users understand its functionality and risks involved.
