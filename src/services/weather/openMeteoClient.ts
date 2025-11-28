import { WeatherClient, WeatherRequest, WeatherSnapshot } from "./weather.types";

export class OpenMeteoClient implements WeatherClient {
  private readonly baseUrl =
    "https://api.open-meteo.com/v1/forecast";

  async getCurrentWeather(input: WeatherRequest): Promise<WeatherSnapshot> {
    const { latitude, longitude } = input;

    const url =
      `${this.baseUrl}` +
      `?latitude=${encodeURIComponent(latitude)}` +
      `&longitude=${encodeURIComponent(longitude)}` +
      `&hourly=temperature_2m,relative_humidity_2m,precipitation_probability` +
      `&forecast_days=1&timezone=auto`;

    const response = await fetch(url);
    if (!response.ok) {
      return {
        provider: "open-meteo",
        temperatureC: undefined,
        humidityPercent: undefined,
        rainProbabilityPercent: undefined,
        raw: { error: `HTTP ${response.status}` }
      };
    }

    const data = await response.json();

    const hourly = data.hourly || {};
    const temps: number[] = hourly.temperature_2m || [];
    const hums: number[] = hourly.relative_humidity_2m || [];
    const rains: number[] = hourly.precipitation_probability || [];

    // Simple approach: average of first 6 hours
    const windowSize = Math.min(6, temps.length);

    const avg = (arr: number[]): number | null => {
      if (!arr || !arr.length) return null;
      const n = Math.min(windowSize, arr.length);
      if (!n) return null;
      const sum = arr.slice(0, n).reduce((acc, v) => acc + v, 0);
      return sum / n;
    };

    const temperatureC = avg(temps);
    const humidityPercent = avg(hums);
    const rainProbabilityPercent = avg(rains);

    return {
      provider: "open-meteo",
      temperatureC,
      humidityPercent,
      rainProbabilityPercent,
      raw: data
    };
  }
}
