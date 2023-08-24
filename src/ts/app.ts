import { Message } from "./Message";
import { MediaTools } from "./MediaTools";

type extractedData = {
  geo: { latitude: number; longitude: number } | string | undefined;
  text: string;
  date: number | undefined;
  video: Promise<MediaStream> | undefined;
  audio: MediaStream | undefined;
};

function app() {
  const vault: Message[] = [];

  const input = document.querySelector(".input") as HTMLInputElement;
  const audio = document.querySelector(".audio") as HTMLAudioElement;
  const video = document.querySelector(".video") as HTMLVideoElement;
  const chat = document.querySelector(".content-container") as HTMLDivElement;

  const submitMessageHandler = (event: KeyboardEventInit) => {
    if (event.key === "Enter") {
      const message = new Message(input.value);
      input.value = "";
      vault.push(message);
      message.postMessage(chat);
    }
  };

  const videoHandler = async (event: Event) => {
    event.preventDefault();
    if (event.target instanceof HTMLElement) {
      if (event.target.classList.contains("fa-video")) {
        const video = MediaTools.getVideo();
        const message = new Message(input.value, undefined, video);
        vault.push(message);
        message.postMessage(chat);
      }
    }
  };

  const audioHandler = () => {};

  input?.addEventListener("keyup", submitMessageHandler);
  video?.addEventListener("click", videoHandler);
  audio?.addEventListener("click", audioHandler);

  window.addEventListener("beforeunload", function () {
    localStorage.clear();
  });

  // window.addEventListener("beforeunload", () => {
  //   const dataListToStore: extractedData[] = [];
  //
  //   vault.forEach((message) => {
  //     const extractedData = {
  //       text: message.text,
  //       geo: message.geo,
  //       date: message.date,
  //       video: message.video,
  //       audio: message.audio,
  //     };
  //     dataListToStore.push(extractedData);
  //   });
  //   localStorage.setItem("dataListToStore", JSON.stringify(dataListToStore));
  // });

  document.addEventListener("DOMContentLoaded", () => {
    const json = localStorage.getItem("dataListToStore") || "[]";

    try {
      const dataListFromStore = JSON.parse(json);

      if (dataListFromStore[0]) {
        dataListFromStore.forEach((extractedData: extractedData) => {
          const message = new Message(
            extractedData.text,
            extractedData.date,
            extractedData.video,
            extractedData.audio,
            extractedData.geo,
          );
          vault.push(message);
          message.postMessage(chat);
        });
      }
    } catch (error) {
      console.log(error);
    }
  });
}

app();
