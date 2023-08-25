import { Tooltip } from "./tooltipFabric";

export class Popup {
  public actualMessages: { id: number; name: HTMLFormElement["name"] }[] = [];
  private tooltip: Tooltip = new Tooltip();
  popupOnSubmit() {
    this.popupCreator();
  }

  popupCreator() {
    const popupWindow = document.querySelector(".popup_window");

    if (!popupWindow) {
      const popupWindow = document.createElement("div");
      popupWindow.classList.add(
        "popup_window",
        "shown",
        "top-[50%]",
        "left-[50%]",
        "transform-gpu",
        "-translate-x-1/2",
        "-translate-y-1/2",
        "w-[400px]",
        "absolute",
        "border-solid",
        "border-0",
        "bg-white",
        "rounded",
        "shadow-lg",
        "p-6",
      );
      popupWindow.innerHTML = `
      <form class="form" novalidate>
        <div class="form-header mb-4">
          <h2 class="text-lg font-semibold">Что-то пошло не так</h2>
        </div>
        <p class="theme mb-4 text-gray-700 text-sm">К сожалению, нам не удалось определить ваше местоположение, пожалуйста, дайте разрешение на использование геолокации, либо введите координаты вручную.</p>
        <h2 class="mb-2 text-sm">Широта и долгота через запятую</h2>
        <input type="text" name="item" class="mb-4 p-2 border-2 border-gray-300 rounded w-full" required>
        <div class="form_buttons flex justify-end">
          <button class="cancel-bnt mr-2 px-4 py-2 border-2 border-gray-300 rounded" type="button">Отмена</button>
          <button class="submit-btn px-4 py-2 bg-blue-500 text-white rounded" type="submit">Ok</button>
        </div>
      </form>`;
      document.body.appendChild(popupWindow);
    } else {
      popupWindow.classList.toggle("hidden");
    }

    if (
      !document.querySelector(".popup_window")?.classList.contains("hidden")
    ) {
      const input = document.querySelector(
        "input[name='item']",
      ) as HTMLInputElement;
      input?.focus();

      this.tooltipLogic();
    }
  }

  // deletePopupOnSubmit(itemForDelete) {
  //   const deletePopupElement = document.querySelector(".form-delete");
  //   const cancelDeleteButton = deletePopupElement.querySelector(".cancel-bnt");
  //
  //   const popupWindowHandler = (event) => {
  //     event.preventDefault();
  //
  //     if (itemForDelete) {
  //       const ticketDataForDelete = {
  //         id: itemForDelete.dataset.id,
  //       };
  //
  //       const urlForDeleteTicketFull = new URL(this.url);
  //       const params = {
  //         method: "deleteTicketById",
  //         id: itemForDelete.dataset.id,
  //       };
  //       Object.keys(params).forEach((key) =>
  //         urlForDeleteTicketFull.searchParams.append(key, params[key]),
  //       );
  //
  //       fetch(urlForDeleteTicketFull, {
  //         method: "DELETE",
  //         mode: "cors",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify(ticketDataForDelete),
  //       })
  //         .then((response) => {
  //           if (!response.ok) {
  //             throw new Error(`HTTP error! status: ${response.status}`);
  //           }
  //           return response.json();
  //         })
  //         .then((ticketsList) => {
  //           if (Array.isArray(ticketsList)) {
  //             this._createTicketsList(ticketsList);
  //           }
  //         })
  //         .catch((error) => {
  //           console.log("Error:", error);
  //         });
  //     }
  //
  //     this.deletePopup();
  //
  //     deletePopupElement.removeEventListener("submit", popupWindowHandler);
  //     cancelDeleteButton.removeEventListener("click", deletePopupCancelHandler);
  //   };
  //
  //   const deletePopupCancelHandler = (event) => {
  //     event.preventDefault();
  //     if (event.target === deletePopupElement.querySelector(".cancel-bnt")) {
  //       this.deletePopup();
  //       cancelDeleteButton.removeEventListener(
  //         "click",
  //         deletePopupCancelHandler,
  //       );
  //       deletePopupElement.removeEventListener("submit", popupWindowHandler);
  //     }
  //   };
  //
  //   deletePopupElement.addEventListener("submit", popupWindowHandler);
  //   cancelDeleteButton.addEventListener("click", deletePopupCancelHandler);
  // }

  // deletePopup(itemForDelete) {
  //   const popupDelete = document.querySelector(".popup_delete");
  //   if (!popupDelete) {
  //     const popupWindow = document.createElement("div");
  //     popupWindow.classList.add("popup_delete", "shown");
  //     popupWindow.innerHTML = `
  //     <form class="form-delete">
  //       <div class="form-header"><h2>Удалить тикет</h2></div>
  //       <h2>Вы уверены, что хотите удалить этот тикет? Это действие необходимо.</h2>
  //       <div class="form_buttons">
  //         <button class="cancel-bnt" type="button">Отмена</button>
  //         <button class="submit-btn" type="submit">Ok</button>
  //       </div>
  //     </form>`;
  //     document.body.appendChild(popupWindow);
  //   } else {
  //     popupDelete.classList.toggle("shown");
  //   }
  //   if (itemForDelete) {
  //     this.deletePopupOnSubmit(itemForDelete);
  //   }
  // }

  tooltipLogic() {
    const form: HTMLFormElement | null = document.querySelector(".form");
    const cancelButton: HTMLElement | null | undefined =
      form?.querySelector(".cancel-bnt");

    const errors = {
      item: {
        valueMissing: "Нам потребуются координаты...",
        patternMismatch:
          "Координаты должны быть в формате '51.50851, −0.12572'",
      },
    };
    // TODO: Поставить вместо any правильный тип.
    const showTooltip = (message: string, el: HTMLFormElement) => {
      this.actualMessages.push({
        name: el.name,
        id: this.tooltip.showTooltip(message, el),
      });
    };

    const getError = (el: HTMLFormElement | null) => {
      const errorKey: string | undefined = Object.keys(
        ValidityState.prototype,
      ).find((key) => {
        if (!el) return;
        if (key === "valid") return;
        if (key in el.validity) {
          return (el.validity as never)[
            key
          ] as ValidityState[keyof ValidityState];
        }
      });

      if (!errorKey) return;

      if (el!.name in errors && errorKey in errors[el!.name as never]) {
        return errors[el!.name as never][errorKey];
      }
    };

    const popupCancelHandler = (event: Event) => {
      event.preventDefault();
      if (event.target === document.querySelector(".cancel-bnt")) {
        (
          document.querySelector("input[name='item']") as HTMLInputElement
        ).value = "";

        this.popupCreator();

        this.actualMessages.forEach((message) =>
          this.tooltip.removeTooltip(message.id),
        );
        this.actualMessages = [];

        cancelButton?.removeEventListener("click", popupCancelHandler);
        form?.removeEventListener("submit", formSubmitEventHandler);
      }
    };

    cancelButton?.addEventListener("click", popupCancelHandler);

    const formSubmitEventHandler = (e: Event) => {
      e.preventDefault();

      this.actualMessages.forEach((message) =>
        this.tooltip.removeTooltip(message.id),
      );
      this.actualMessages = [];

      const elements: HTMLFormControlsCollection | undefined = form?.elements;

      Array.from(elements!).some((elem) => {
        const error = getError(elem as HTMLFormElement);

        if (error) {
          showTooltip(error, elem as HTMLFormElement);
          return true;
        }
        return false;
      });

      if (form?.checkValidity()) {
        console.log("valid");
        console.log("submit");

        this.popupOnSubmit();
        cancelButton?.removeEventListener("click", popupCancelHandler);
        form.removeEventListener("submit", formSubmitEventHandler);
        Array.from(form.elements).forEach((el) =>
          el.removeEventListener("focus", elementBlurCallback),
        );
      }
    };

    form?.addEventListener("submit", formSubmitEventHandler);

    const elementOnBlur = (e: Event) => {
      if (e.target instanceof HTMLFormElement) {
        const el = e.target;

        const error = getError(el);

        const currentErrorMessage = this.actualMessages.find(
          (item) => item.name === el.name,
        );

        if (error) {
          if (!currentErrorMessage) {
            showTooltip(error, el);
          }
        } else {
          if (currentErrorMessage) {
            this.tooltip.removeTooltip(currentErrorMessage.id);
            this.actualMessages.splice(
              this.actualMessages.indexOf(currentErrorMessage),
              1,
            );
          }
        }
      }
    };

    const elementBlurCallback = (event: Event) =>
      event.target?.addEventListener("blur", elementOnBlur);

    Array.from(form!.elements).forEach(
      (element) => element?.addEventListener("focus", elementBlurCallback),
    );
  }
}
