import * as fs from "fs";
import * as path from "path";
import { Car, Question } from "../types/model";
import { AppError } from "../middleware/appError";

const DATA_DIR = path.resolve(__dirname, "../../data");
const CARS_FILE = path.join(DATA_DIR, "cars.json");
const QUESTIONS_FILE = path.join(DATA_DIR, "questions.json");

export class CarRepository {
  private carsCache: Car[] | null = null;
  private questionsCache: Question[] | null = null;

  getAllCars(): Car[] {
    if (this.carsCache) {
      return this.carsCache;
    }

    this.carsCache = this.readJson<Car[]>(CARS_FILE);
    return this.carsCache;
  }

  getCarById(carId: string): Car {
    const car = this.getAllCars().find((item) => item.id === carId);
    if (!car) {
      throw new AppError(404, "CAR_NOT_FOUND", "Car not found");
    }
    return car;
  }

  getQuestions(): Question[] {
    if (this.questionsCache) {
      return this.questionsCache;
    }

    this.questionsCache = this.readJson<Question[]>(QUESTIONS_FILE);
    return this.questionsCache;
  }

  private readJson<T>(filePath: string): T {
    try {
      const data = fs.readFileSync(filePath, "utf-8");
      return JSON.parse(data) as T;
    } catch (error) {
      throw new AppError(500, "DATA_SOURCE_ERROR", `Failed reading ${path.basename(filePath)}`, error);
    }
  }
}
