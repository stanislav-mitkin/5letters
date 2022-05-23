import type { Component, JSX } from "solid-js";

import { createSignal, createEffect, createMemo, batch } from "solid-js";

import styles from "./Letter.module.css";

interface LetterProps extends JSX.InputHTMLAttributes<HTMLInputElement> {
  children?: JSX.Element;
  isInput?: boolean;
  type?: "finded-position" | "finded" | "not-finded" | undefined;
  delayedAnimation?: number;
  isActive?: boolean;
  letterIndex?: number;
}

const Letter: Component<LetterProps> = (props) => {
  const [letterType, setLetterType] = createSignal(
    props.delayedAnimation ? null : props.type
  );

  const [showAnimation, setsShowAnimation] = createSignal(false);

  createEffect(() => {
    if (props.delayedAnimation) {
      setTimeout(() => {
        setsShowAnimation(true);
        setTimeout(() => {
          setLetterType(props.type);
        }, 450);
      }, props.delayedAnimation);
    }
  });

  const classList = createMemo(() => ({
    [styles.letter]: true,
    [styles.animation]: showAnimation(),
    [styles.finded]: letterType() === "finded",
    [styles["not-finded"]]: letterType() === "not-finded",
    [styles["finded-position"]]: letterType() === "finded-position",
  }));

  if (props.isInput) {
    return (
      <input
        classList={{
          [styles.input]: true,
          ...classList(),
        }}
        type="text"
        maxLength={1}
        disabled={props.disabled}
        value={props.value}
        onKeyUp={props.onKeyUp}
        onFocus={props.onFocus}
        ref={(el: HTMLElement) => {
          createEffect(() => {
            if (props.isActive) {
              el.focus();
            }
          });
        }}
      />
    );
  }

  return <div classList={classList()}>{props.children}</div>;
};

export default Letter;
