import { vault } from "./app";
import { activeStream } from "./app";

export class MediaTools {
  static getCurrentGeoposition(): Promise<
    GeolocationPosition | GeolocationPositionError
  > {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (data) => {
            resolve(data);
          },
          (error: GeolocationPositionError) => {
            reject(error);
          },
        );
      } else {
        reject(new Error("Geolocation in not supported by this browser."));
      }
    });
  }

  static async getVideo(): Promise<MediaStream> {
    return await new Promise((resolve, reject) => {
      if (navigator.mediaDevices) {
        try {
          const video = navigator.mediaDevices.getUserMedia({
            video: { width: 300 },
          });
          resolve(video);
        } catch (error) {
          reject(new Error("Meida in not supported by this browser."));
        }
      } else {
        reject(new Error("Meida in not supported by this browser."));
      }
    });
  }

  static async getAudio(): Promise<MediaStream> {
    return await new Promise((resolve, reject) => {
      if (navigator.mediaDevices) {
        try {
          const video = navigator.mediaDevices.getUserMedia({
            audio: true,
          });
          resolve(video);
        } catch (error) {
          reject(new Error("Meida in not supported by this browser."));
        }
      } else {
        reject(new Error("Meida in not supported by this browser."));
      }
    });
  }

  static async getVideoAudio(): Promise<MediaStream> {
    return await new Promise((resolve, reject) => {
      if (navigator.mediaDevices) {
        try {
          const video = navigator.mediaDevices.getUserMedia({
            audio: true,
            video: { width: 300 },
          });
          resolve(video);
        } catch (error) {
          reject(new Error("Meida in not supported by this browser."));
        }
      } else {
        reject(new Error("Meida in not supported by this browser."));
      }
    });
  }

  static async mediaRecorder(typeOfStream: string) {
    const stream =
      typeOfStream === "video"
        ? await MediaTools.getVideoAudio()
        : await MediaTools.getAudio();

    activeStream.push(stream);

    const recorder = new MediaRecorder(stream);
    const chunks: Blob[] = [];

    let timer: number;
    let witchButton: string;

    const mediaElement: Element | undefined =
      typeOfStream === "video"
        ? Array.from(document.querySelectorAll(".video_container")).at(-1)
        : Array.from(document.querySelectorAll(".audio_container")).at(-1);

    const videoButton = document.querySelector(".video");
    const audioButton = document.querySelector(".audio");

    recorder.addEventListener("start", () => {
      console.log("start");
      let counter: number = 0;
      timer = setInterval(() => {
        counter++;
        if (recorder.state === "recording") {
          const lastTimer = document.querySelector(".timer");
          if (lastTimer) {
            lastTimer.remove();
          }
          const minutes = Math.floor(counter / 60);
          const seconds = counter % 60;
          const element = document.createElement("div");
          element.classList.add("timer");
          element.textContent = `${minutes
            .toString()
            .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
          videoButton?.insertAdjacentElement("afterend", element);
        }
      }, 1000);
    });

    recorder.addEventListener("dataavailable", (event) => {
      chunks.push(event.data);
    });

    recorder.addEventListener("stop", async () => {
      const blob = new Blob(chunks);
      console.log("stop");
      if (mediaElement instanceof HTMLMediaElement) {
        if (witchButton === "stop") {
          mediaElement.src = URL.createObjectURL(blob);
          mediaElement.setAttribute("width", "300");
          mediaElement.setAttribute("controls", "");
          if (typeOfStream === "video") {
            vault.at(-1)!.video = blob;
            console.log(vault.at(-1)!.video);
          } else {
            vault.at(-1)!.audio = blob;
            console.log(vault.at(-1)!.audio);
          }
        }
        if (witchButton === "cancel") {
          mediaElement.remove();
        }

        mediaElement.srcObject = null;

        clearInterval(timer);
        if (videoButton?.nextElementSibling?.classList.contains("timer")) {
          videoButton?.nextElementSibling?.remove();
        }
      }
    });

    videoButton?.addEventListener("click", async (event) => {
      if (
        event.target instanceof HTMLElement &&
        event.target.classList.contains("fa-stop")
      ) {
        witchButton = "stop";
        recorder.stop();
        activeStream.forEach((stream) => {
          stream.getTracks().forEach((track) => {
            track.stop();
          });
        });

        if (event.target.parentElement) {
          event.target.parentElement.innerHTML = `<i class="fa-solid fa-video"></i>`;
          document.querySelector(
            ".audio",
          )!.innerHTML = `<i class="fa-solid fa-microphone"></i>`;
        }
      }
    });

    audioButton?.addEventListener("click", (event) => {
      event.preventDefault();
      if (
        event.target instanceof HTMLElement &&
        event.target.classList.contains("fa-xmark")
      ) {
        witchButton = "cancel";
        recorder.stop();
        activeStream.forEach((stream) => {
          stream.getTracks().forEach((track) => {
            track.stop();
          });
        });

        if (event.target.parentElement) {
          event.target.parentElement.innerHTML = `<i class="fa-solid fa-microphone"></i>`;
          document.querySelector(
            ".video",
          )!.innerHTML = `<i class="fa-solid fa-video"></i>`;
        }
      }
    });

    recorder.start();
  }
}
