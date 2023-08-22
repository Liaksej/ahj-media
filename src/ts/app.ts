import { Message } from "./Message";
import { Tools } from "./Tools";

function app() {
  const vault: Message[] = [];

  const input = document.querySelector(".input") as HTMLInputElement;
  const chat = document.querySelector(".content-container") as HTMLDivElement;

  const submitMessageHandler = async (event: KeyboardEventInit) => {
    if (event.key === "Enter") {
      const { latitude, longitude } = await Tools.getCurrentGeoposition();
      const message = new Message(input.value, {
        lat: latitude,
        lng: longitude,
      });
      vault.push(message);
      Tools.postMessage(message, chat);
    }
  };

  input?.addEventListener("keyup", submitMessageHandler);
}

app();
