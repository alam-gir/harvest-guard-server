export interface WeatherRequest {
  latitude: number;
  longitude: number;
}

export interface WeatherSnapshot {
  temperatureC?: number | null;
  humidityPercent?: number | null;
  rainProbabilityPercent?: number | null;
  provider: string;
  raw?: any;
}

export interface WeatherClient {
  getCurrentWeather(input: WeatherRequest): Promise<WeatherSnapshot>;
}
