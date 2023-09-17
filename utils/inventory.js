export default class InventoryInterface {
  /**
   * @param {import("mineflayer").Bot} bot The bot instance
   */
  constructor(bot) {
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

    this.Bot.inventory.slots.forEach((item) => {
      if (item) {
        this.Bot.chat("Here's my inventory:");
        this.Bot.chat(`- ${item.name} x ${item.count}`);
      }
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
    const itemToEquip = items.find((item) => item.name === item);

    if (!itemToEquip) {
      this.Bot.chat(`I don't have any ${item}!`);
      return;
    }

    try {
      await this.Bot.equip(itemToEquip, "hand");
      this.Bot.chat(`Equipped ${item}!`);
    } catch (err) {
      this.Bot.chat(`Unable to equip ${item}!`);
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
      const item = items.find((item) => item.name === tool);
      if (!item) missingTools.push(tool);
    });

    return missingTools;
  }
}
