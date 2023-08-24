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
            video: true,
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

  static mediaRecorder(streamPromise: MediaStream) {
    const stream = streamPromise;
    const recorder = new MediaRecorder(stream);
    const videoElement: Element | undefined = Array.from(
      document.querySelectorAll(".video_container"),
    ).at(-1);
    const chunks: Blob[] = [];

    recorder.addEventListener("start", () => {
      console.log("start");
    });

    recorder.addEventListener("dataavailable", (event) => {
      chunks.push(event.data);
    });

    recorder.addEventListener("stop", async () => {
      const blob = new Blob(chunks);
      console.log("stop");
      if (videoElement instanceof HTMLVideoElement) {
        videoElement.srcObject = null;

        videoElement.src = URL.createObjectURL(blob);

        videoElement.setAttribute("controls", "");
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
          stream.getTracks().forEach((track) => {
            track.stop();
          });
          if (event.target.parentElement) {
            event.target.parentElement.innerHTML = `<i class="fa-solid fa-video"></i>`;
          }
        }
      });

    recorder.start();
  }
}
