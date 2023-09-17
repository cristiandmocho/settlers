import { Professions } from "../settlers.config.js";
import Settler from "./settler.js";

export default class Miner extends Settler {
  constructor(name) {
    super(name);

    this.Name = name;
    this.Profession = Professions.miner;

    // Miner specific commands
    [
      {
        name: "!dig-stairs-until",
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
    this.chat(`dig-stairs-until ${level}`);
  }

  createHall(x, z, blocksLong, blocksWide) {
    this.chat(`create-hall ${x} ${z} ${blocksLong} ${blocksWide}`);
  }

  stripMine(x, z, blocksLong, blocksWide) {
    this.chat(`strip-mine ${x} ${z} ${blocksLong} ${blocksWide}`);
  }
}
