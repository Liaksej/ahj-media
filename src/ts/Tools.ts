import { Message } from "./Message";

export class Tools {
  static dateConverter(created: number) {
    const date = new Date(created);

    const formatter = new Intl.DateTimeFormat("ru", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
    return formatter.format(date);
  }

  static getCurrentGeoposition(): Promise<GeolocationPosition["coords"]> {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (data) => {
            resolve(data.coords);
          },
          (error) => {
            reject(new Error(error.code.toString()));
          },
        );
      } else {
        reject(new Error("Geolocation in not supported by this browser."));
      }
    });
  }

  static postMessage(message: Message, chat: HTMLDivElement) {
    const messageDomElement = document.createElement("div");
    messageDomElement.classList.add("message");
    messageDomElement.innerHTML = `
      <div class="text-of-message">${message.text}</div>
      <div class="geo-of-message">${message.geo.lat}, ${message.geo.lng}</div>;
      <div class="date">${this.dateConverter(message.date)}</div>`;
    if (message.audio) {
      const audio = document.createElement("div");
      audio.classList.add("audio");
      audio.innerHTML = `<audio>${message.audio}</audio>`;
      messageDomElement.appendChild(audio);
    }
    if (message.video) {
      const video = document.createElement("div");
      video.classList.add("audio");
      video.innerHTML = `<audio>${message.video}</audio>`;
      messageDomElement.appendChild(video);
    }
    chat.appendChild(messageDomElement);
  }
}
