import fs from "fs";
import path from "path";

const source = path.resolve(__dirname, "../../db/seeds/cars.seed.json");
const target = path.resolve(__dirname, "../../data/cars.json");

function runSeed() {
  if (!fs.existsSync(source)) {
    throw new Error("Seed source file not found");
  }

  fs.copyFileSync(source, target);
  console.log("Seed completed: copied db/seeds/cars.seed.json to data/cars.json");
}

runSeed();
