import md5 from "md5";
import axios from "axios";
import { random } from "lodash";
import dayjs from "dayjs";

type Data = {
  content: string;
  creator_id: number;
  source: string;
  tags: string[];
  pin: number;
  created_at: string;
  updated_at: string;
  deleted_at: null;
  slug: string;
  linked_count: number;
  files: string[];
};

const SUCCESS_CODE = 0;
const UPDATE_URL = "https://flomoapp.com/api/v1/memo/updated/";
const { PUSH_URL = "", FLOMO_SALT, FLOMO_AUTHORIZATION = "" } = process.env;

if (!PUSH_URL || !FLOMO_SALT || !FLOMO_AUTHORIZATION) {
  throw new Error("no secrets.");
}

class FlomoReminder {
  getParams() {
    function kSort(e: any) {
      var t = Object.keys(e).sort(),
        a: any = {};
      for (var n in t) a[t[n]] = e[t[n]];
      return a;
    }
    const params: { [key: string]: string } = kSort({
      limit: "500",
      tz: "8:0",
      timestamp: new Date().getTime().toString().slice(0, 10),
      api_key: "flomo_web",
      app_version: "2.0",
    });

    let n = "";
    for (let i in params) {
      n += i + "=" + params[i] + "&";
    }
    n = n.substring(0, n.length - 1);
    const sign = md5(n + FLOMO_SALT);

    return { ...params, sign };
  }

  async request() {
    return axios
      .get(UPDATE_URL, {
        params: this.getParams(),
        headers: {
          authorization: FLOMO_AUTHORIZATION,
        },
      })
      .then((resp) => {
        const data = resp.data;
        if (data?.code !== SUCCESS_CODE) {
          return Promise.reject(data);
        }
        return data;
      })
      .catch((error) => {
        console.error(error);
      });
  }

  async getMemos() {
    const data: Data[] = (await this.request())?.data || [];
    const result = data.map((item) => {
      return item.content.replace(
        new RegExp("<(S*?)[^>]*>.*?|<.*? />", "g"),
        ""
      );
    });
    return result;
  }

  async getLuckyMemo() {
    const memos = await this.getMemos();
    return memos[random(memos.length)];
  }
}

function push(desp: string) {
  axios(PUSH_URL, {
    method: "POST",
    params: {
      title: `${dayjs().format("YYYY-MM-DD HH:mm")} 的 memo 提醒请查收！`,
      desp,
    },
  }).catch((error) => {
    console.error(error);
  });
}

async function main() {
  const flomoReminder = new FlomoReminder();
  const memo = await flomoReminder.getLuckyMemo();
  push(memo);
}

main();
