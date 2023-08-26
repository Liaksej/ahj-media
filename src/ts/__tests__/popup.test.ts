import { Popup } from "../Popup";

describe("Popup validator method", () => {
  let instance: Popup;

  beforeEach(() => {
    instance = new Popup();
  });

  // Проверим 5 валидных наборов данных
  test.each([
    ["51.50851, −0.12572"],
    ["51.50851,−0.12572"],
    ["[51.50851, −0.12572]"],
    ["39.913818,116.363625"],
    ["[39.913818,116.363625]"],
  ])("correct data returns nothing (%s)", (text: string) => {
    expect(instance.validator(text)).toBeUndefined();
  });

  // Проверим 5 невалидных наборов данных
  test.each([
    ["incorrect data"],
    ["51.50851"],
    ["−0.12572"],
    ["[51.50851]"],
    ["[−0.12572]"],
  ])("incorrect data returns patternMismatch (%s)", (text) => {
    expect(instance.validator(text)).toBe("patternMismatch");
  });
});
