export const Config = {
  server: {
    // host: "hashtagcity.ddns.net",
    host: "localhost",
    port: 10080,
    auth: "offline",
    // password: null,
  },
};

export const Professions = {
  miner: {
    canUseTools: ["pickaxe", "shovel"],
    canUseEntities: ["furnace", "chest", "crafting_table", "stonecutter"],
    recipesKnown: [
      "furnace",
      "torch",
      "iron_ingot",
      "gold_ingot",
      "iron_block",
      "gold_block",
      "stone_fence",
      "stone_slab",
      "stone_stairs",
    ],
    inventoryRequired: ["torch", "pickaxe", "shovel"],
  },
  woodcutter: {
    canUseTools: ["axe"],
    canUseEntities: ["chest", "crafting_table", "cutting_table"],
    recipesKnown: ["planks", "stick", "chest", "crafting_table"],
    inventoryRequired: ["axe"],
  },
  mechanic: {
    canUseTools: [],
    canUseEntities: ["chest", "crafting_table"],
    recipesKnown: ["cutting_table", "stonecutter", "anvil"],
    inventoryRequired: [],
  },
  gatherer: {
    canUseTools: ["shovel", "pickaxe"],
    canUseEntities: ["chest"],
    recipesKnown: ["stick", "seeds"],
    inventoryRequired: ["shovel", "pickaxe"],
  },
};
