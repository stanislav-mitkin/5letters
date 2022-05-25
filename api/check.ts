import type { VercelRequest, VercelResponse } from "@vercel/node";

import { dict } from "./_dict";
import { patienceDiff } from "./_diff";

interface DiffLine {
  line: string;
  aIndex: number;
  bIndex: number;
}

interface DiffResult {
  lines: DiffLine[];
}

const currentDay = new Date();
const d =
  currentDay.getDate() < 10 ? `${currentDay.getDate()}0` : currentDay.getDate();
const m =
  currentDay.getMonth() < 10
    ? `${currentDay.getMonth()}0`
    : currentDay.getMonth();
const y = currentDay.getFullYear().toString().slice(-2);

const DAY_NUMBER = Number(`${d}${m}${y}`);
const word5 = dict.filter((word) => word.length === 5);

const totalNumber = word5.length;

const wordKey =
  totalNumber / DAY_NUMBER > 0.01
    ? totalNumber / DAY_NUMBER
    : totalNumber / Number(String(DAY_NUMBER).slice(0, 4));

const WORD = word5?.[Math.floor(wordKey * totalNumber)];

export default (request: VercelRequest, response: VercelResponse) => {
  if (request.method === "POST") {
    const { word } = request.body;

    const isWordExist = dict.find(
      (dictWord) => dictWord.toLocaleLowerCase() === word.toLocaleLowerCase()
    );

    if (isWordExist) {
      const difference: DiffResult = patienceDiff(
        WORD.split(""),
        isWordExist.split("")
      );

      const isFinded = difference.lines.every(
        (item) => item.aIndex === item.bIndex
      );

      if (isFinded) {
        response.status(200).json({
          finded: true,
          words: WORD.split("").map((item, index) => ({
            index,
            status: "finded-position",
          })),
          answer: WORD,
        });
      } else {
        const prepared = difference.lines
          .filter((item) => item.bIndex > -1)
          .reduce((result, current) => {
            const find = difference.lines.find(
              (item) => item.line === current.line && item.aIndex > -1
            );

            return [
              ...result,
              {
                ...current,
                aIndex: find ? find.aIndex : current.aIndex,
              },
            ];
          }, [] as DiffLine[]);

        const result = prepared.map((item, index) => {
          const status =
            item.aIndex === item.bIndex
              ? "finded-position"
              : item.aIndex < 0
              ? "not-finded"
              : item.aIndex !== item.bIndex
              ? "finded"
              : "not-finded";

          return {
            index,
            status,
          };
        });

        response.status(200).json({
          finded: false,
          words: result,
        });
      }
    } else {
      response.status(200).json({
        finded: false,
      });
    }
  } else {
    response.statusCode = 405;
    response.end();
  }
};
