import { MediaTools } from "./MediaTools";
import { activeStream } from "./app";
export class Message {
  constructor(
    public text: string,
    public video?: MediaStream | Blob | boolean,
    public audio?: MediaStream | Blob | boolean,
    public date?: number,
    public geo?:
      | string
      | {
          latitude: number;
          longitude: number;
        },
  ) {
    this.text = text;
    this.date = date ?? Date.now();
    this.geo = geo;
  }

  protected dateConverter(created: number) {
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

  async postMessage(chat: HTMLDivElement) {
    const messageDomElement = document.createElement("div");
    const audioButton = document.querySelector(".audio");
    const videoButton = document.querySelector(".video");

    messageDomElement.classList.add("message");
    messageDomElement.innerHTML = `
      <div class="text-of-message">${this.text}</div>
      <div class="geo-of-message">loading...</div>
      <div class="date">${this.dateConverter(this.date!)}</div>`;
    chat.appendChild(messageDomElement);

    const geoElement: HTMLDivElement | null =
      messageDomElement.querySelector(".geo-of-message");
    if (geoElement && this.geo !== null && this.geo !== undefined) {
      if (typeof this.geo === "object") {
        geoElement.textContent = `${this.geo.latitude}, ${this.geo.longitude}`;
      }
      if (typeof this.geo === "string") {
        geoElement.textContent = `${this.geo}`;
      }
    } else {
      MediaTools.getCurrentGeoposition()
        .then((geo) => {
          if (geoElement && geo! instanceof GeolocationPosition) {
            this.geo = {
              latitude: geo.coords.latitude,
              longitude: geo.coords.longitude,
            };
            geoElement.textContent = `${geo!.coords.latitude}, ${
              geo!.coords.longitude
            }`;
          }
        })
        .catch((error) => {
          console.error("Could not fetch geo data:", error?.code);
          this.geo = error.message;
          if (geoElement) {
            geoElement.textContent = `${error?.message}`;
          }
        });
    }
    if (this.audio) {
      const audioElement = document.createElement("audio");
      audioElement.classList.add("audio_container");
      audioElement.setAttribute("controls", "");
      messageDomElement.appendChild(audioElement);
      const audioButton = document.querySelector(".audio");
      if (audioButton && videoButton) {
        videoButton.innerHTML = `<i class="fa-solid fa-stop"></i>`;
        audioButton.innerHTML = `<i class="fa-solid fa-xmark"></i>`;
      }
      await MediaTools.mediaRecorder("audio");
    }
    if (this.video) {
      const videoElement = document.createElement("video");
      videoElement.classList.add("video_container");
      messageDomElement.appendChild(videoElement);
      const stream = await MediaTools.getVideo();
      activeStream.push(stream);
      videoElement.srcObject = stream;
      videoElement.addEventListener("canplay", () => {
        videoElement.play();
      });
      if (videoButton && audioButton) {
        videoButton.innerHTML = `<i class="fa-solid fa-stop"></i>`;
        audioButton.innerHTML = `<i class="fa-solid fa-xmark"></i>`;
      }
      await MediaTools.mediaRecorder("video");
    }
  }
}
