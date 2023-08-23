import { Message } from "./Message";

type extractedData = {
  geo: { latitude: number; longitude: number } | string | undefined;
  text: string;
  date: number | undefined;
  video: Blob | undefined;
  audio: Blob | undefined;
};

function app() {
  const vault: Message[] = [];

  const input = document.querySelector(".input") as HTMLInputElement;
  const chat = document.querySelector(".content-container") as HTMLDivElement;

  const submitMessageHandler = async (event: KeyboardEventInit) => {
    if (event.key === "Enter") {
      const message = new Message(input.value);
      input.value = "";
      vault.push(message);
      message.postMessage(chat);
    }
  };

  input?.addEventListener("keyup", submitMessageHandler);

  // window.addEventListener("beforeunload", function () {
  //   localStorage.clear();
  // });

  window.addEventListener("beforeunload", () => {
    const dataListToStore: extractedData[] = [];

    vault.forEach((message) => {
      const extractedData = {
        text: message.text,
        geo: message.geo,
        date: message.date,
        video: message.video,
        audio: message.audio,
      };
      dataListToStore.push(extractedData);
    });
    localStorage.setItem("dataListToStore", JSON.stringify(dataListToStore));
  });

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
