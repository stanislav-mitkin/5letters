import { createContext } from "solid-js";

export const LETTERS_NUM = 5;
export const ATTEMPTS_NUM = 6;

export const AppContext = createContext({
  attempts: [],
  activeAttemptIndex: 0,
});

export const DEFAULT_STORE = {
  attempts: Array.from({ length: ATTEMPTS_NUM }).map(() => ({
    letters: Array.from({ length: LETTERS_NUM }).map(() => ({
      char: "",
      status: "",
      delayedAnimation: 0,
    })),
    activeLetterIndex: 999,
  })),
  activeAttemptIndex: 0,
  findedWord: "",
};
