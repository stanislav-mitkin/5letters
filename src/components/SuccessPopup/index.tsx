import type { Component } from "solid-js";

import { createEffect, createSignal, For } from "solid-js";

import Letter from "../Letter";
import store from "../../store";
// import { LETTERS_NUM, ATTEMPTS_NUM } from "../../consts";

import styles from "./SuccessPopup.module.css";

interface SuccessPopupProps {
  word: string;
}
const SuccessPopup: Component<SuccessPopupProps> = (props) => {
  const [show, setShow] = createSignal(false);
  const [state, setStore] = store;

  createEffect(() => {
    setTimeout(() => {
      setShow(true);
    }, 200);
  });
  return (
    <div
      classList={{
        [styles.popup]: true,
        [styles.popupOpen]: show(),
      }}
    >
      <h2 class={styles.title}>Ура! Вы успешно угадали слово!</h2>
      <div class={styles.word}>
        <For each={state.store.findedWord.split("")}>
          {(item, index) => (
            <Letter
              type="finded-position"
              delayedAnimation={200 * (1 + index())}
            >
              {item}
            </Letter>
          )}
        </For>
      </div>

      <div class={styles.buttons}>
        {/* <button
          class={styles.button}
          onClick={() => {
            setStore(
              "store",
              "attempts",
              [0, ATTEMPTS_NUM - 1],
              "letters",
              [0, LETTERS_NUM - 1],
              (item) => ({ ...item, char: "", status: "", delayedAnimation: 0 })
            );
          }}
        >
          Сыграть еще раз
        </button> */}
        <button class={styles.buttonClose} onClick={() => setShow(false)}>
          Закрыть
        </button>
      </div>
    </div>
  );
};

export default SuccessPopup;
