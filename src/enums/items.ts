enum Items {
  Crate = '100',
  Lootbox = '050',
  LootboxFabled = '049',

  // huntgem
  FabledGem1 = '057',
  LegendaryGem1 = '056',
  MythicalGem1 = '055',
  EpicGem1 = '054',
  RareGem1 = '053',
  UncommonGem1 = '052',
  CommonGem1 = '051',

  // empgem
  FabledGem3 = '071',
  LegendaryGem3 = '070',
  MythicalGem3 = '069',
  EpicGem3 = '068',
  RareGem3 = '067',
  UncommonGem3 = '066',
  CommonGem3 = '065',

  // luckgem
  FabledGem4 = '078',
  LegendaryGem4 = '077',
  MythicalGem4 = '076',
  EpicGem4 = '075',
  RareGem4 = '074',
  UncommonGem4 = '073',
  CommonGem4 = '072',
}

const Gems = {
  huntgem: [
    Items.FabledGem1,
    Items.LegendaryGem1,
    Items.MythicalGem1,
    Items.EpicGem1,
    Items.RareGem1,
    Items.UncommonGem1,
    Items.CommonGem1,
  ],
  empgem: [
    Items.FabledGem3,
    Items.LegendaryGem3,
    Items.MythicalGem3,
    Items.EpicGem3,
    Items.RareGem3,
    Items.UncommonGem3,
    Items.CommonGem3,
  ],
  luckgem: [
    Items.FabledGem4,
    Items.LegendaryGem4,
    Items.MythicalGem4,
    Items.EpicGem4,
    Items.RareGem4,
    Items.UncommonGem4,
    Items.CommonGem4,
  ],
};

export { Items, Gems };
