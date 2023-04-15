import axios from "axios";
import md5 from "md5";
import { Memo } from "../types";
import envService from "./EnvService";
import dayjs from "dayjs";

interface RequestParams {
  latestSlug: string; // 最后一条 memo 的 slug id
  latestUpdatedAt: number; // 最后一条 memo 的更新时间戳
}

export class ApiService {
  private getMemoUrl = "https://flomoapp.com/api/v1/memo/updated/";
  private salt = "dbbc3dd73364b4084c3a69346e0ce2b2";
  private successCode = 0;
  private token = envService.envs.FLOMO_AUTHORIZATION;
  private limit = 200;

  /**
   * 给 params 排序以生成签名
   */
  private kSort(e: any) {
    var t = Object.keys(e).sort(),
      a: any = {};
    for (var n in t) a[t[n]] = e[t[n]];
    return a;
  }

  /**
   * 生成签名
   */
  private getSign(params: Record<string, string | number>) {
    let n = "";
    for (let i in params) {
      n += i + "=" + params[i] + "&";
    }
    n = n.substring(0, n.length - 1);
    return md5(n + this.salt);
  }

  /**
   * 构造请求参数
   */
  private getParams(params: RequestParams) {
    const sortedParams: { [key: string]: string } = this.kSort({
      limit: this.limit,
      tz: "8:0",
      timestamp: new Date().getTime().toString().slice(0, 10),
      api_key: "flomo_web",
      app_version: "2.0",
      ...(params.latestSlug && params.latestUpdatedAt
        ? {
            latest_slug: params.latestSlug,
            latest_updated_at: params.latestUpdatedAt,
          }
        : {}),
    });

    return { ...sortedParams, sign: this.getSign(sortedParams) };
  }

  private async request(params: RequestParams) {
    const resp = await axios.get(this.getMemoUrl, {
      params: this.getParams(params),
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

  /**
   * 分片获取 memos
   */
  async getMemos(params?: RequestParams): Promise<Memo[]> {
    const { latestSlug = "", latestUpdatedAt = 0 } = params || {};
    const memos = await this.request({
      latestSlug,
      latestUpdatedAt: latestUpdatedAt,
    });
    if (memos.length >= this.limit) {
      return [
        ...memos,
        ...(await this.getMemos({
          latestSlug: memos[memos.length - 1].slug,
          latestUpdatedAt: dayjs(memos[memos.length - 1].updated_at).unix(),
        })),
      ];
    } else {
      return memos;
    }
  }
}
