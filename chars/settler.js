import { Config, Professions } from "../settlers.config.js";
import BaseBot from "./basebot.js";

const { port, host, auth, password } = Config.server;

export default class Settler extends BaseBot {
  /**
   * @param {string} name The bot's name
   * @param {Professions} profession The bot's profession
   */
  constructor(name, profession = Professions.settler) {
    super();

    this.Profession = profession;
    this.Name = name;

    // Bot events
    this.on("login", () => {
      this.chat(
        `Hello, my name is ${this.Name}!\nIf you want to talk to me, start your commands with a "!" (ex: !come)`
      );
    });

    this.on("spawn", () => {
      this.chat("I'm ready to work! What do you want me to do?");
    });

    this.on("respawn", () => {
      this.chat("I'm ready to work... again...");
    });

    this.on("death", () => {
      this.chat("I died... I'll be back!");
    });

    this.on("kicked", (reason) => {
      console.log(`I was kicked for ${reason}`);
      console.log(reason);
    });

    this.on("end", (reason) => {
      console.log(`I disconnected for ${reason}`);
      console.log(reason);
    });

    // Connect to server
    this.Connect(host, port, auth, password);
  }
}
