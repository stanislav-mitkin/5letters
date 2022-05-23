import type { Component } from "solid-js";

import { Index, Show, createSignal, createEffect } from "solid-js";

import Letter from "../Letter";
import store from "../../store";
import { LETTERS_NUM } from "../../consts";

import styles from "./Attempt.module.css";

interface AttemptProps {
  index: number;
  lettersNumber?: number;
  disabled?: boolean;
}

const Attempt: Component<AttemptProps> = (props) => {
  const [mainState, setMainState] = store;
  const [errorAnswer, setErrorAnswer] = createSignal(false);

  createEffect(() => {
    if (errorAnswer()) {
      setTimeout(() => {
        setErrorAnswer(false);
        setMainState(
          "store",
          "attempts",
          props.index,
          "letters",
          Array.from({ length: LETTERS_NUM }).map(() => ({
            char: "",
            status: "",
            delayedAnimation: 0,
          }))
        );
        setActiveLetter(0);
      }, 800);
    }
  });

  const setCharValue = (letterIndex: number, value: string) => {
    setMainState(
      "store",
      "attempts",
      props.index,
      "letters",
      letterIndex,
      "char",
      value
    );
  };

  const setActiveLetter = (letterIndex: number) => {
    setMainState(
      "store",
      "attempts",
      props.index,
      "activeLetterIndex",
      letterIndex
    );
  };

  const moveToNextAttempt = () => {
    const nextIndex = props.index + 1;
    setMainState("store", "activeAttemptIndex", nextIndex);
    setMainState("store", "attempts", nextIndex, "activeLetterIndex", 0);
  };

  const setLetterStatus = (
    letterIndex: number,
    status: "finded-position" | "finded" | "not-finded",
    delayedAnimation: number
  ) => {
    setMainState(
      "store",
      "attempts",
      props.index,
      "letters",
      letterIndex,
      "status",
      status
    );

    setMainState(
      "store",
      "attempts",
      props.index,
      "letters",
      letterIndex,
      "delayedAnimation",
      delayedAnimation
    );
  };

  const handleCheckWord = async () => {
    const charsArray = mainState.store.attempts?.[props.index]?.letters?.map(
      (letter) => letter.char
    );

    const word = charsArray.join("");

    try {
      const response = await fetch("/api/check", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ word }),
      });

      const jsonResponse = await response.json();

      if (jsonResponse.words) {
        (jsonResponse.words as { index: number; status: any }[]).forEach(
          (word) => {
            setLetterStatus(word.index, word.status, (word.index + 1) * 200);
          }
        );

        if (jsonResponse.finded) {
          setTimeout(() => {
            setMainState("store", "findedWord", jsonResponse.answer);
          }, 1500);
        } else {
          moveToNextAttempt();
        }
      } else {
        setErrorAnswer(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (!props.lettersNumber) {
    return null;
  }

  return (
    <div
      classList={{
        [styles.Attempt]: true,
        [styles.errorAnswer]: errorAnswer(),
      }}
    >
      <Index each={mainState.store.attempts?.[props.index]?.letters}>
        {(item, inputIndex) => {
          return (
            <Letter
              isInput
              disabled={props.disabled}
              delayedAnimation={item().delayedAnimation}
              value={item().char}
              type={item().status as any}
              isActive={
                inputIndex ===
                mainState.store.attempts?.[props.index].activeLetterIndex
              }
              onFocus={(e) => {
                setActiveLetter(inputIndex);
              }}
              onKeyUp={(e) => {
                const value = e.currentTarget.value;
                const code = e.key;
                const isCorrectChar = /[А-Яа-яЁё]/g.test(code);

                const isDelete = ["Backspace", "Delete"].includes(code);
                const currentIndex =
                  mainState.store.attempts?.[props.index].activeLetterIndex;

                if (isDelete) {
                  const nextIndex = currentIndex - 1;
                  setActiveLetter(nextIndex > 0 ? nextIndex : 0);
                }

                if (value === "") {
                  setCharValue(inputIndex, "");
                }

                if (isCorrectChar) {
                  const nextIndex = currentIndex + 1;
                  setCharValue(inputIndex, value);
                  setActiveLetter(
                    nextIndex < LETTERS_NUM ? nextIndex : currentIndex
                  );
                }
              }}
            />
          );
        }}
      </Index>
      <Show
        when={mainState.store.attempts?.[props.index]?.letters?.every(
          (letter) =>
            /[А-Яа-яЁё]/g.test(letter.char) &&
            props.index === mainState.store.activeAttemptIndex &&
            !mainState.store.findedWord
        )}
      >
        <button class={styles.sendButton} onClick={handleCheckWord}>
          проверить
        </button>
      </Show>
    </div>
  );
};

export default Attempt;
