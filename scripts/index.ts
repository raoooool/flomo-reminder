import { random } from "lodash";
import { getMemosApi, postBarkApi } from "./request";
import { convert } from "html-to-text";

async function getMemos() {
  const data = await getMemosApi();
  const result = data.map((item) => {
    return convert(item.content, {
      wordwrap: false,
    });
  });
  return result;
}

async function getLuckyMemo(memos: string[]) {
  return memos[random(memos.length)];
}

async function main() {
  const memos = await getMemos();
  const luckyMemo = await getLuckyMemo(memos);
  postBarkApi(luckyMemo);
}

main();
