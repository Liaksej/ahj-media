import { MediaTools } from "./MediaTools";
export class Message {
  constructor(
    public text: string,
    public date?: number,
    public video?: Blob,
    public audio?: MediaStream,
    public geo?:
      | string
      | {
          latitude: number;
          longitude: number;
        },
  ) {
    this.text = text;
    this.date = date ?? Date.now();
    this.video = video;
    this.audio = audio;
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

  postMessage(chat: HTMLDivElement) {
    const messageDomElement = document.createElement("div");
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
      const audioRecorder = new MediaRecorder(this.audio);
      const chunks: Blob[] = [];

      audioRecorder.addEventListener("start", () => {
        console.log("start");
      });

      audioRecorder.addEventListener("dataavailable", (event) => {
        chunks.push(event.data);
      });

      audioRecorder.addEventListener("stop", () => {
        const blob = new Blob(chunks);
      });

      const audio = document.createElement("div");
      audio.classList.add("audio");
      audio.innerHTML = `<audio>${this.audio}</audio>`;
      messageDomElement.appendChild(audio);
    }
    // if (this.video) {
    //   const video = document.createElement("video");
    //   const audioRecorder = new MediaRecorder(this.audio);
    //   video.classList.add("audio");
    //   video.srcObject = this.video;
    //   messageDomElement.appendChild(video);
    //   video.addEventListener("canplay", () => {});
    // }
  }
}
