import { Message } from "./Message";

// type extractedData = {
//   geo: { latitude: number; longitude: number } | string | undefined;
//   text: string;
//   date: number | undefined;
//   video: Promise<MediaStream> | undefined;
//   audio: MediaStream | undefined;
// };
export const vault: Message[] = [];
export const activeStream: MediaStream[] = [];

function app() {
  const input = document.querySelector(".input") as HTMLInputElement;
  const audio = document.querySelector(".audio") as HTMLAudioElement;
  const video = document.querySelector(".video") as HTMLVideoElement;
  const chat = document.querySelector(".content-container") as HTMLDivElement;
  const inputContainer = document.querySelector(
    ".input-container",
  ) as HTMLDivElement;

  const submitMessageHandler = async (event: KeyboardEventInit) => {
    if (event.key === "Enter") {
      const message = new Message(input.value);
      input.value = "";
      input.style.height = "auto";
      vault.push(message);
      await message.postMessage(chat);
    }
  };

  const videoHandler = async (event: Event) => {
    event.preventDefault();
    if (event.target instanceof HTMLElement) {
      if (event.target.classList.contains("fa-video")) {
        const message = new Message(input.value, true);
        vault.push(message);
        await message.postMessage(chat);
      }
    }
  };

  const audioHandler = async (event: Event) => {
    event.preventDefault();
    if (event.target instanceof HTMLElement) {
      if (event.target.classList.contains("fa-microphone")) {
        const message = new Message(input.value, false, true);
        vault.push(message);
        await message.postMessage(chat);
      }
    }
  };

  input?.addEventListener("keyup", submitMessageHandler);
  video?.addEventListener("click", videoHandler);
  audio?.addEventListener("click", audioHandler);

  window.addEventListener("beforeunload", function () {
    localStorage.clear();
  });

  input.addEventListener("focus", () => {
    inputContainer.classList.add(
      "outline",
      "outline-offset-1",
      "outline-2",
      "outline-indigo-500/40",
    );
  });
  input.addEventListener("blur", function () {
    inputContainer.classList.remove(
      "outline",
      "outline-offset-1",
      "outline-2",
      "outline-indigo-500/40",
    );
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

  // document.addEventListener("DOMContentLoaded", () => {
  //   const json = localStorage.getItem("dataListToStore") || "[]";
  //
  //   try {
  //     const dataListFromStore = JSON.parse(json);
  //
  //     if (dataListFromStore[0]) {
  //       dataListFromStore.forEach((extractedData: extractedData) => {
  //         const message = new Message(
  //           extractedData.text,
  //           extractedData.date,
  //           extractedData.video,
  //           extractedData.audio,
  //           extractedData.geo,
  //         );
  //         vault.push(message);
  //         message.postMessage(chat);
  //       });
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // });
}

app();
