import axios from 'axios';

const getOwoUrlLogin = async (token: string): Promise<string> => {
  const url =
    'https://discord.com/api/v9/oauth2/authorize?client_id=408785106942164992&response_type=code&redirect_uri=https%3A%2F%2Fowobot.com%2Fapi%2Fauth%2Fdiscord%2Fredirect&scope=identify%20guilds%20email%20guilds.members.read';
  const headers = {
    Authorization: token,
    'Content-Type': 'application/json',
  };

  const body = {
    guild_id: '1119963281923248219',
    permissions: '8',
    authorize: true,
    integration_type: 0,
    location_context: {
      guild_id: '10000',
      channel_id: '10000',
      channel_type: 10000,
    },
  };
  return axios
    .post(url, body, { headers: headers })
    .then((response) => {
      return response.data.location;
    })
    .catch((error) => {
      console.error('Error:', error.response ? error.response.data : error.message);
    });
};

export default getOwoUrlLogin;
