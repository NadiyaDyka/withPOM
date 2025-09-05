import fs from "fs";
import { error } from "console";
import path from "path";

export default class Utils {
  getRandomNumberRange(min: number, max: number) {
    return Math.floor(Math.random() * (max - min) + min);
  }

  formatProperName(unformattedName: string) {
    return String(unformattedName).charAt(0).toUpperCase() + String(unformattedName).slice(1);
  }

  checkFileExists(fileName: string) {
    return fs.existsSync(fileName);
  }

  readJsonFileFromDirectory(fileName: string, directory: string) {
    const filePath = path.resolve(directory, fileName);
    return this.readJsonFromFile(filePath);
  }

  readJsonFromFile(fileName: string): string {
    let jsonString: string;
    if (this.checkFileExists(fileName)) {
      const jsonStr = fs.readFileSync(fileName, "utf-8");
      jsonString = JSON.parse(jsonStr);
    } else {
      throw error(`The file "${fileName}" does not exist`);
    }
    return jsonString;
  }
}
