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

    const mediaElement: Element | undefined =
      typeOfStream === "video"
        ? Array.from(document.querySelectorAll(".video_container")).at(-1)
        : Array.from(document.querySelectorAll(".audio_container")).at(-1);

    recorder.addEventListener("start", () => {
      console.log("start");
    });

    recorder.addEventListener("dataavailable", (event) => {
      chunks.push(event.data);
    });

    recorder.addEventListener("stop", async () => {
      const blob = new Blob(chunks);
      console.log("stop");
      if (mediaElement instanceof HTMLMediaElement) {
        mediaElement.srcObject = null;
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
    });

    document
      .querySelector(".video")
      ?.addEventListener("click", async (event) => {
        if (
          event.target instanceof HTMLElement &&
          event.target.classList.contains("fa-stop")
        ) {
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

    recorder.start();
  }
}
