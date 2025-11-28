import { WeatherClient } from "./weather.types";
import { OpenMeteoClient } from "./openMeteoClient";

let weatherClientInstance: WeatherClient | null = null;

export const getWeatherClient = (): WeatherClient => {
  if (!weatherClientInstance) {
    weatherClientInstance = new OpenMeteoClient();
  }
  return weatherClientInstance;
};
