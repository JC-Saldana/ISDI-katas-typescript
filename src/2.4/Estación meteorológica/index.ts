function halfOdds() {
  return Math.random() >= 0.5
}

interface Observer {
  update(subject: Publisher): void;
}

interface Publisher {
  subscribe(observer: Observer): void;
  unsubscribe(observer: Observer): void;
  notify(): void;
}

class WeatherMeasurement {
  public temperature
  public humidity
  constructor(temperature: number, humidity: number) {
    this.temperature = temperature
    this.humidity = humidity
  }
}

class Thermometer {
  private temperature: number = 24
  private updateTemperature(): void {
    const temperatureVariance = 1
    this.temperature = halfOdds() ? this.temperature + temperatureVariance : this.temperature - temperatureVariance
  }
  public getTemperature(): number {
    this.updateTemperature()
    return this.temperature
  }
}

class Hygrograph {
  private humidity: number = 63
  private updateHumidity(): void {
    const humidityVariance = 2
    this.humidity = halfOdds() ? this.humidity + humidityVariance : this.humidity - humidityVariance
  }
  public getHumidity(): number {
    this.updateHumidity()
    return this.humidity
  }
}

class WeatherPublisher implements Publisher {

  private observers: WeatherObserver[] = [];
  private temperature: number = 0
  private humidity: number = 0

  public subscribe(observer: WeatherObserver): void {
    const isExist = this.observers.includes(observer);
    if (isExist) {
      return console.log('Subject: Observer has been subscribed already.');
    }
    console.log('Subject: Subscribed an observer.');
    this.observers.push(observer);
  }

  public unsubscribe(observer: WeatherObserver): void {
    const observerIndex = this.observers.indexOf(observer);
    if (observerIndex === -1) {
      return console.log('Subject: Nonexistent observer.');
    }
    this.observers.splice(observerIndex, 1);
    console.log('Subject: Unsubscribed an observer.');
  }
  public notify(): void {
    const weatherMeasurement = new WeatherMeasurement(this.temperature, this.humidity) 
    for (const observer of this.observers) {
      observer.update(this, weatherMeasurement);
    }
  }

  private retrieveMeasurements(thermometer: Thermometer, hygrograph: Hygrograph): void {
    this.temperature = thermometer.getTemperature()
    this.humidity = hygrograph.getHumidity()
    this.notify();
  }

  public turnDevicesOn(): void {
    const thermometer = new Thermometer()
    const hygrograph = new Hygrograph()
    setInterval(() => {
      this.retrieveMeasurements(thermometer, hygrograph)
    }, 1000)
  }
}

interface WeatherObserver {
  update(subject: Publisher, weatherData: WeatherMeasurement): void;
}

class HumidityDisplayObserver implements WeatherObserver {
  public update(subject: Publisher, weatherMeasurement: WeatherMeasurement): void {
    if (subject instanceof WeatherPublisher) {
      console.log(`Humidity: ${weatherMeasurement.humidity}%`);
    }
  }
}

class TemperatureDisplayObserver implements WeatherObserver {
  public update(subject: Publisher, weatherMeasurement: WeatherMeasurement): void {
    if (subject instanceof WeatherPublisher) {
      console.log(`Temperature: ${weatherMeasurement.temperature}ºC`);
    }
  }
}

// Client

const subject = new WeatherPublisher();
const observer1 = new HumidityDisplayObserver();
const observer2 = new TemperatureDisplayObserver();

subject.subscribe(observer1);
subject.subscribe(observer2);

// Starts to push data
subject.turnDevicesOn();
