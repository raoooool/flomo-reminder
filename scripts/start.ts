import md5 from "md5";
import axios from "axios";

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

const UPDATE_URL = "https://flomoapp.com/api/v1/memo/updated/";
const salt = process.env.FLOMO_SALT;
const authorization = process.env.FLOMO_AUTHORIZATION || "";

if (!salt || !authorization) {
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
    const sign = md5(n + salt);

    return { ...params, sign };
  }

  async request() {
    return axios
      .get(UPDATE_URL, {
        params: this.getParams(),
        headers: {
          authorization,
        },
      })
      .then((resp) => {
        const data = resp.data;
        if (data?.code !== 200) {
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

  async run() {}
}

async function main() {
  const flomoReminder = new FlomoReminder();
  const memos = await flomoReminder.getMemos();
  console.log("memos", memos);
}

main();
