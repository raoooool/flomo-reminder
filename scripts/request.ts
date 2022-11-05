import axios from "axios";
import dayjs from "dayjs";
import md5 from "md5";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { Memo } from "./types";
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("Asia/Shanghai");

const GET_MEMO_URL = "https://flomoapp.com/api/v1/memo/updated/";
const SALT = "dbbc3dd73364b4084c3a69346e0ce2b2";
const SUCCESS_CODE = 0;
const { FLOMO_AUTHORIZATION = "", BARK_TOKEN = "" } = process.env;

if (!FLOMO_AUTHORIZATION) {
  throw new Error("No Secrets.");
}

export function getMemosApi() {
  function getParams() {
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
    const sign = md5(n + SALT);

    return { ...params, sign };
  }

  return axios
    .get(GET_MEMO_URL, {
      params: getParams(),
      headers: {
        authorization: FLOMO_AUTHORIZATION,
      },
    })
    .then((resp) => {
      const data = resp.data;
      if (data?.code !== SUCCESS_CODE) {
        return Promise.reject(data);
      }
      return (data?.data || []) as Memo[];
    })
    .catch((error) => {
      console.error(error);
      return [] as Memo[];
    });
}

function getTitle() {
  return `${dayjs().tz().format("YYYY-MM-DD HH:mm")} 的 memo 请查收！😊`;
}

export function postBarkApi(content: string) {
  return axios(`https://api.day.app/push`, {
    method: "POST",
    data: {
      // title: getTitle(),
      body: content,
      device_key: BARK_TOKEN,
    },
  }).catch((err) => {
    console.error(err?.response?.data || err?.response || err);
  });
}
