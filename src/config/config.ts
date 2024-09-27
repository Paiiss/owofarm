const config = {
  typing: true,
  prefix: 'W',
  status: {
    hunt: true,
    battle: true,
    pray: true,
    curse: false,
    gamble: false,
    lootbox: false,
    lootbox_fabled: false,
    crate: false,
    cookie: false,
  },
  interval: {
    animals: 1200000,
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
