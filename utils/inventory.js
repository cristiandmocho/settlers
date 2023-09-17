import EventEmmiter from "events";

export default class InventoryInterface extends EventEmmiter {
  /**
   * @param {import("mineflayer").Bot} bot The bot instance
   */
  constructor(bot) {
    super();
    this.Bot = bot;
  }

  isInventoryFull() {
    return this.Bot.inventory.emptySlotCount() === 0;
  }

  isInventoryEmpty() {
    const count = this.Bot.inventory.items().length;

    if (count === 0) this.Bot.chat("My inventory is empty!");
    return count === 0;
  }

  ListInventory() {
    if (this.isInventoryEmpty()) return;

    this.Bot.chat("Here's my inventory:");
    this.Bot.inventory.slots.forEach((item) => {
      if (item) this.Bot.chat(`- ${item.name} x ${item.count}`);
    });
  }

  async DropItems(item, count) {
    if (this.isInventoryEmpty()) return;

    const items = this.Bot.inventory.items();
    const itemToDrop = items.find((item) => item.name === item);

    if (!itemToDrop) {
      this.Bot.chat(`I don't have any ${item}!`);
      return;
    }

    try {
      await this.Bot.toss(itemToDrop.type, null, count);
      this.Bot.chat(`Dropped ${count} x ${item}!`);
    } catch (err) {
      this.Bot.chat(`Unable to drop ${item}!`);
      console.log(err);
    }
  }

  async EquipItem(item) {
    if (this.isInventoryEmpty()) return;

    const items = this.Bot.inventory.items();
    const itemToEquip = items.find((ite) => ite.name.indexOf(item) > -1);

    if (!itemToEquip) {
      this.Bot.chat(`I don't have any ${item}!`);
      return;
    }

    try {
      await this.Bot.equip(itemToEquip, "hand");
      this.emit("equip", { item: itemToEquip });
    } catch (err) {
      this.Bot.chat(`Unable to equip ${itemToEquip.displayName}!`);
      console.log(err);
    }
  }

  /**
   * @param {import("prismarine-block").Block} block The block to equip the best item for
   */
  async EquipBestItemFor(block) {
    const items = this.Bot.inventory.items().sort((a, b) => {
      return a.type - b.type;
    });

    const itemToEquip = items.find((item) => block.canHarvest(item.type));

    if (!itemToEquip) {
      this.Bot.chat(`I don't have any tool capable of harvesting the blocks!`);
      return;
    }

    try {
      await this.Bot.equip(itemToEquip, "hand");
      this.Bot.chat(`Equipped ${block.name}!`);
    } catch (err) {
      this.Bot.chat(`Unable to equip ${block.name}!`);
      console.log(err);
    }
  }

  async UnequipItem() {
    if (this.isInventoryEmpty()) return;

    const itemToUnequip = this.Bot.inventory.slots[45];

    if (!itemToUnequip) {
      this.Bot.chat(`I don't have anything to unequip!`);
      return;
    }

    try {
      await this.Bot.unequip(itemToUnequip, "hand");
      this.Bot.chat(`Unequipped ${itemToUnequip.name}!`);
    } catch (err) {
      this.Bot.chat(`Unable to unequip ${itemToUnequip.name}!`);
      console.log(err);
    }
  }

  /**
   * @param {string[]} tools The tools the bot needs
   * @returns {string[]} An array of the missing tools
   */
  MissingTools(tools) {
    const items = this.Bot.inventory.items();
    const missingTools = [];

    tools.forEach((tool) => {
      const item = items.find(
        (item) => item.name.indexOf(tool.toLowerCase()) > -1
      );
      if (!item) missingTools.push(tool);
    });

    return missingTools;
  }
}
