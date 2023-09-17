import EventEmmiter from "events";

export default class HealthInterface extends EventEmmiter {
  /**
   * @param {import("mineflayer").Bot} bot The bot instance
   */
  constructor(bot) {
    super();
    this.Bot = bot;

    this.Bot?.on("health", this.onHealthChange.bind(this));
    this.Bot?.on("breath", this.onBreathChange.bind(this));
  }

  onHealthChange() {
    this.emit("health-change", this.Bot.health);
    this.warnIfLowHealth();
  }

  onBreathChange() {
    this.emit("breath-change", this.Bot.breath);
    this.warnIfLowBreath();
  }

  warnIfLowHealth() {
    if (this.Bot.health < 10) {
      this.emit("health-low", this.Bot.health);
    }
  }

  warnIfLowBreath() {
    if (this.Bot.breath < 30) {
      this.Bot.chat("I'm low on breath!", this.Bot.breath);
    }
  }
}
