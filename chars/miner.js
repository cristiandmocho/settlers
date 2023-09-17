import { Professions } from "../settlers.config.js";
import Settler from "./settler.js";

const Buildings = {
  SimpleStairsDown: {
    once: [
      { x: 1, y: -1, z: 0, action: "dig" },
      { x: 2, y: -1, z: 0, action: "dig" },
      { x: 3, y: -1, z: 0, action: "dig" },
      { x: 4, y: -1, z: 0, action: "dig" },
      { x: 1, y: -1, z: 0, action: "move" },
      // { action: "step" },
    ],
    repeat: [
      { x: 1, y: -1, z: 0, action: "dig" },
      { x: 2, y: -1, z: 0, action: "dig" },
      { x: 3, y: -1, z: 0, action: "dig" },
      { x: 4, y: -1, z: 0, action: "dig" },
      { x: 4, y: 0, z: 0, action: "dig" },
      // { action: "step" },
      { x: 1, y: -1, z: 0, action: "move" },
    ],
  },
};

export default class Miner extends Settler {
  constructor(name) {
    super(name);

    this.Name = name;
    this.Profession = Professions.miner;

    // Miner specific commands
    [
      {
        name: "!dig-stairs",
        args: ["<level>"],
        callBack: this.digStairsUntil,
      },
      {
        name: "!create-hall",
        args: ["<x>", "<z>", "<blocksLong>", "<blocksWide>"],
        callBack: this.createHall,
      },
      {
        name: "!strip-mine",
        args: ["<x>", "<z>", "<blocksLong>", "<blocksWide>"],
        callBack: this.stripMine,
      },
    ].forEach((command) => {
      this.AddCommand(command);
    });
  }

  /**
   * @param {number} level The level to dig until
   */
  async digStairsUntil(level) {
    // Check if the bot is already digging
    if (this.Bot.targetDigBlock) {
      this.chat(`Already digging, hold on!`);
      return;
    }

    // Check if the bot has the required tools
    const missingTools = this.InventoryInterface.MissingTools([
      "pickaxe",
      "shovel",
    ]);
    if (missingTools.length > 0) {
      this.chat(`I'm missing the following tools: ${missingTools.join(", ")}`);
      return;
    }

    this.chat(`Diggin your staircase, wait a moment...`);

    const buildingStart = Buildings.SimpleStairsDown.once;
    const buildingRepeat = Buildings.SimpleStairsDown.repeat;

    const buildLevel = async (levelData) => {
      for (let i = 0; i < levelData.length; i++) {
        const { x, y, z, action } = levelData[i];
        const target = this.Bot.blockAt(
          this.Bot.entity.position.offset(x, y, z)
        );

        if (action === "dig") {
          if (target && target.type !== 0 && this.Bot.canDigBlock(target)) {
            if (target.material === "mineable/shovel")
              await this.InventoryInterface.EquipItem("shovel");

            if (target.material === "mineable/pickaxe")
              await this.InventoryInterface.EquipItem("pickaxe");

            try {
              await this.Bot.dig(target, true);
              await this.Bot.waitForTicks(20);
            } catch (err) {
              console.log(err);
            }
          }
        } else if (action === "move") {
          this.moveToPoint(this.Bot.entity.position.offset(x, y, z), 0);
          await this.Bot.waitForTicks(20);
        } else if (action === "step") {
          this.Bot.setControlState("forward", true);
          await this.Bot.waitForTicks(1.333);
          this.Bot.setControlState("forward", false);
        }
      }
    };

    // Build the first level
    await buildLevel(buildingStart);

    // Build the rest of the levels
    while (this.Bot.entity.position.y > level) {
      await buildLevel(buildingRepeat);
    }

    this.chat(`Done!`);
  }

  // Check if the bot has reached the desired level

  // let target;
  // if (bot.targetDigBlock) {
  //   bot.chat(`already digging ${bot.targetDigBlock.name}`);
  // } else {
  //   target = bot.blockAt(bot.entity.position.offset(0, -1, 0));
  //   if (target && bot.canDigBlock(target)) {
  //     bot.chat(`starting to dig ${target.name}`);
  //     try {
  //       await bot.dig(target);
  //       bot.chat(`finished digging ${target.name}`);
  //     } catch (err) {
  //       console.log(err.stack);
  //     }
  //   } else {
  //     bot.chat("cannot dig");
  //   }
  // }

  createHall(x, z, blocksLong, blocksWide) {
    this.chat(`create-hall ${x} ${z} ${blocksLong} ${blocksWide}`);
  }

  stripMine(x, z, blocksLong, blocksWide) {
    this.chat(`strip-mine ${x} ${z} ${blocksLong} ${blocksWide}`);
  }
}
