import axios from "axios";
import dayjs from "dayjs";
import md5 from "md5";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { Memo } from "../types";
import envService from "./EnvService";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("Asia/Shanghai");

export class ApiService {
  private getMemoUrl = "https://flomoapp.com/api/v1/memo/updated/";
  private salt = "dbbc3dd73364b4084c3a69346e0ce2b2";
  private successCode = 0;
  private token = envService.envs.FLOMO_AUTHORIZATION;

  private kSort(e: any) {
    var t = Object.keys(e).sort(),
      a: any = {};
    for (var n in t) a[t[n]] = e[t[n]];
    return a;
  }

  private getParams() {
    const params: { [key: string]: string } = this.kSort({
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
    const sign = md5(n + this.salt);
    return { ...params, sign };
  }

  async request() {
    const resp = await axios.get(this.getMemoUrl, {
      params: this.getParams(),
      headers: {
        authorization: this.token,
      },
    });
    const data = resp?.data;
    if (data?.code !== this.successCode) {
      throw new Error(`flomo 请求失败： ${JSON.stringify(data)}`);
    }
    return (data?.data || []) as Memo[];
  }
}
