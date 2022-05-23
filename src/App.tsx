import type { Component } from "solid-js";
import { Index, Show } from "solid-js";

import logo from "./assets/logo.svg";
import styles from "./App.module.css";

import Letter from "./components/Letter";
import Attempt from "./components/Attempt";
import SuccessPopup from "./components/SuccessPopup";

import store from "./store";
import { LETTERS_NUM } from "./consts";

const App: Component = () => {
  const [state] = store;

  return (
    <div class={styles.App}>
      <section class={styles.container}>
        <header class={styles.header}>
          <img class={styles.logo} src={logo} title="5 Букв игра" />
        </header>

        <main class={styles.main}>
          <section class={styles.game}>
            <Index each={state.store.attempts}>
              {(item, index) => (
                <Attempt
                  index={index}
                  lettersNumber={LETTERS_NUM}
                  disabled={state.store.activeAttemptIndex !== index}
                />
              )}
            </Index>
          </section>
          <section class={styles.rules}>
            <h2 class={styles.rulesTitle}>Правила игры</h2>
            <p>
              Загадано существительно из 5 букв, вам необходимо угадать его за 6
              попыток.
            </p>
            <p class={styles.yellow}>
              После каждой попытки цвет ячеек меняется, вот что означают цвета:
            </p>
            <div class={styles.word}>
              <Letter delayedAnimation={200}>К</Letter>
              <Letter delayedAnimation={400}>Е</Letter>
              <Letter type="finded" delayedAnimation={600}>
                Ф
              </Letter>
              <Letter type="finded" delayedAnimation={800}>
                И
              </Letter>
              <Letter delayedAnimation={1000}>Р</Letter>
            </div>

            <p>
              Буквы “Ф” и “И” белые - они есть в загаданном слове, но стоят в
              других местах. Буквы “К”, “Е” и “Р” серые - это значит их нет в
              нужном слове.
            </p>

            <div class={styles.word}>
              <Letter type="finded-position" delayedAnimation={1000}>
                Ф
              </Letter>
              <Letter type="finded-position" delayedAnimation={1200}>
                И
              </Letter>
              <Letter delayedAnimation={1400}>Р</Letter>
              <Letter delayedAnimation={1600}>М</Letter>
              <Letter delayedAnimation={1800}>А</Letter>
            </div>

            <p>
              Буквы “Ф” и “И” жёлтые - значит они есть в нужном слове и стоят в
              нужных местах.
            </p>

            <div class={styles.word}>
              <Letter type="finded-position" delayedAnimation={1800}>
                Ф
              </Letter>
              <Letter type="finded-position" delayedAnimation={2000}>
                И
              </Letter>
              <Letter type="finded-position" delayedAnimation={2200}>
                Л
              </Letter>
              <Letter type="finded-position" delayedAnimation={2400}>
                Ь
              </Letter>
              <Letter type="finded-position" delayedAnimation={2600}>
                М
              </Letter>
            </div>

            <p>Когда вы угадаете слово, все буквы окрасятся в желтый цвет.</p>
          </section>
        </main>
      </section>
      <Show when={!!state.store.findedWord}>
        <SuccessPopup word={state.store.findedWord} />
      </Show>
    </div>
  );
};

export default App;
