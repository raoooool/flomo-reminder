import { random } from "lodash";
import { Memo } from "../types";
import { convert } from "html-to-text";
import envService from "./EnvService";

export class MemoService {
  private pushTags = envService.envs.PUSH_TAGS.split(",");

  private convertMemoToHtml(memo: Memo) {
    return convert(memo?.content || "", {
      wordwrap: false,
    });
  }

  private getMemo(memos: Memo[]) {
    return this.convertMemoToHtml(memos[random(memos.length - 1)]);
  }

  getLuckyMemo(memos: Memo[]) {
    const tagMemos = memos.filter((memo) =>
      this.pushTags.some((tag) =>
        memo.tags.some((memoTag) => memoTag.includes(tag))
      )
    );
    if (tagMemos.length) {
      return this.getMemo(tagMemos);
    }
    return this.getMemo(memos);
  }
}
