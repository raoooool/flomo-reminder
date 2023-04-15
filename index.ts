function errorHandler(error: Error) {
  console.error(error);
  process.exit(1);
}

process.on("uncaughtException", errorHandler);
process.on("unhandledRejection", errorHandler);

import * as dotenv from "dotenv";

dotenv.config();

import { ApiService } from "./service/ApiService";
import { MemoService } from "./service/MemoService";
import { PushService } from "./service/PushService";

async function main() {
  const apiService = new ApiService();
  const memoService = new MemoService();
  const pushService = new PushService();

  const memos = await apiService.getMemos();
  const luckyMemo = memoService.getLuckyMemo(memos);

  console.log("The lucky memo is: \r\n\r\n", luckyMemo, "\r\n");

  pushService.push(luckyMemo);
}

main();
