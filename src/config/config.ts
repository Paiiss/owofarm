const config = {
  typing: true,
  prefix: 'W',
  status: {
    hunt: true,
    battle: true,
    zoo: true,
    pray: true,
    curse: false,
    gamble: false,
    lootbox: false,
    lootbox_fabled: false,
    crate: false,
    cookie: false,
    gems: true,
    inventory: true,
    quest: true,
  },
  interval: {
    send_message: 2000,
    animals: 1200000,
    zoo: 300000,
    pray: 303000,
    curse: 303500,
    gamble: {
      coinflip: 30000,
      slots: 30000,
    },
    hunt: {
      slowestTime: 16000,
      fastestTime: 32000,
    },
    battle: {
      slowestTime: 16000,
      fastestTime: 32000,
    },
    inventory: 130000,
    checklist: 120000,
    quest: {
      owo: 32000,
      check: 60000,
    },
  },
  channels: {
    hunt: '1287350084832333855',
    quest: '1287350170517770334',
    gamble: '1287350196258209812',
  },
  target: {
    pray: '',
    curse: '',
    cookie: '408785106942164992',
  },
  owoId: '408785106942164992',
  checklist_completed: false,
};

export default config;
