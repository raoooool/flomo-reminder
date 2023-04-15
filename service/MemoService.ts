import { random } from "lodash";
import { Memo } from "../types";
import { convert } from "html-to-text";

export class MemoService {
  private convertMemoToHtml(memo: Memo) {
    return convert(memo?.content || "", {
      wordwrap: false,
    });
  }

  getLuckyMemo(memos: Memo[]) {
    return this.convertMemoToHtml(memos[random(memos.length)]);
  }
}
