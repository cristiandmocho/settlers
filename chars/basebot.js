import EventEmmiter from "events";
import Mineflayer from "mineflayer";
import Pathfinder from "mineflayer-pathfinder";
import MCData from "minecraft-data";

const { pathfinder, Movements, goals } = Pathfinder;

/**
 * @typedef {Object} Command
 * @property {string} name The name of the command
 * @property {string[]} args The arguments of the command
 * @property {Function} callBack The callback function of the command
 */
class Command {
  constructor(name, args = [], callBack = () => {}) {
    this.name = name;
    this.args = args;
    this.callBack = callBack;
  }
}

import InventoryInterface from "../utils/inventory.js";
import ChestInterface from "../utils/chest.js";

export default class BaseBot extends EventEmmiter {
  constructor() {
    super();

    this.Name = null;
    this.Bot = null;
    this.Profession = null;
    this.MCData = null;
    this.Commands = [];
    this.Level = 0;

    this.Inventory = new InventoryInterface(this.Bot);
    this.ChestInterface = new ChestInterface(this.Bot);

    //Adding basic commands
    const basicCommands = [
      { name: "!come", args: [], callBack: this.moveToPlayer },
      {
        name: "!moveto",
        args: ["<x>", "<y>", "<z>", "<range>"],
        callBack: this.moveToPointArgs,
      },
      { name: "!stop", args: [], callBack: this.stop },
      { name: "!inventory", args: [], callBack: this.ListInventory },
      { name: "!where", args: [], callBack: this.whereAreYou },
      { name: "!face", args: ["<direction>"], callBack: this.faceDirection },
    ];

    basicCommands.forEach((command) => {
      this.AddCommand(command);
    });
  }

  /**
   *
   * @param {string} host The hostname of the server
   * @param {number} port The port of the server
   * @param {string} auth The authentication type (microsoft, offline)
   * @param {string | null} password The password to use. If auth is offline, there's no need to provide a password.
   */
  Connect(host = "localhost", port, auth = "offline", password = null) {
    this.Bot = Mineflayer.createBot({
      username: this.Name,
      host,
      port,
      auth,
      password,
    });

    this.Bot.loadPlugin(pathfinder);
    this.MCData = MCData(this.Bot.version);
    this.Inventory = new InventoryInterface(this.Bot);
    this.ChestInterface = new ChestInterface(this.Bot);

    // Bot events
    this.Bot.on("login", () => {
      this.emit("login");
    });

    this.Bot.on("respawn", () => {
      this.emit("respawn");
    });

    this.Bot.on("spawn", () => {
      const defaultMove = new Movements(this.Bot, this.MCData);
      this.Bot.pathfinder.setMovements(defaultMove);

      this.emit("spawn");
    });

    this.Bot.on("death", () => {
      this.emit("death");
    });

    this.Bot.on("end", (reason) => {
      this.emit("end", { reason });
    });

    this.Bot.on("chat", (username, message) => {
      if (username === this.Bot.username) return;

      // Parse command and arguments
      const command = message.split(" ")[0];
      const args = message.split(" ").slice(1) || [];

      if (!command.startsWith("!")) return;

      //Special case
      if (command === "!come") args.push(username);

      //Check if command exists and call it
      const commandObj = this.Commands.find((cmd) => cmd.name === command);

      if (commandObj) {
        commandObj.callBack.apply(this, args);
      } else {
        this.Bot.chat("Try one of the following:");
        this.Commands.forEach((command) => {
          this.Bot.chat(`- ${command.name} ${command.args.join(" ")}`);
        });
      }

      // Emit chat event
      this.emit("chat", { username, message });
    });

    // Log errors and kick reasons:
    this.Bot.on("kicked", console.log);
    this.Bot.on("error", console.log);
  }

  Disconnect() {
    this.Bot.end();
  }

  /**
   * @function AddCommand Adds a command to the bot
   * @param {Command} command The command to add
   */
  AddCommand(command) {
    this.Commands.push(command);
  }

  // Bot in-game actions

  /**
   *
   * @param {string} message The message to send
   */
  chat(message) {
    this.Bot.chat(message);
  }

  /**
   * @param {{x: number, y: number, z: number}} point The point to move to
   * @param {number} range The distance to keep from the point
   */
  moveToPoint(point, range) {
    if (!point) {
      this.emit("error", { message: "No point provided!", point });
      return;
    }

    const goal = new goals.GoalNear(point.x, point.y, point.z, range);

    this.Bot.pathfinder.setGoal(goal);
    this.emit("move", { point, range });
  }

  moveToPlayer(username) {
    const player = this.Bot.players[username];

    console.log(player);

    this.moveToPoint(player?.entity?.position, 1);
  }

  moveToPointArgs(x, y, z, range) {
    this.moveToPoint({ x, y, z }, range);
  }

  stop() {
    this.Bot.pathfinder.setGoal(null);
    this.emit("stop");
  }

  whereAreYou() {
    const position = this.Bot.entity.position;

    this.Bot.chat(
      `I'm at ${position.x}, ${position.y}, ${
        position.z
      }, facing ${this.getFacingDirection()}!`
    );

    this.emit("where", { position, direction: this.getFacingDirection() });
  }

  /**
   * @returns {string} The direction the bot is facing (north, west, south, east)
   */
  getFacingDirection() {
    const yaw = this.Bot.entity.yaw;
    const facing = Math.round((yaw / (2 * Math.PI)) * 4);

    return ["North", "West", "South", "East"][facing < 0 ? facing + 4 : facing];
  }

  /**
   * @param {string} direction The direction to face (north, west, south, east)
   */
  faceDirection(direction) {
    const dir = direction.toLowerCase();

    const yaw = {
      north: 0,
      west: Math.PI / 2,
      south: Math.PI,
      east: (3 * Math.PI) / 2,
    }[dir];

    const delta = {
      north: [0, -1],
      west: [-1, 0],
      south: [0, 1],
      east: [1, 0],
    }[dir];

    this.Bot.look(yaw, 0);
    this.Bot.pathfinder.goto(
      new goals.GoalXZ(
        this.Bot.entity.position.x + delta[0],
        this.Bot.entity.position.z + delta[1]
      )
    );

    this.emit("face", { direction });
  }

  ListInventory() {
    this.Inventory.ListInventory();
  }
}
