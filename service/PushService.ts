import axios from "axios";
import envService from "./EnvService";

// import dayjs from "dayjs";
// import utc from "dayjs/plugin/utc";
// import timezone from "dayjs/plugin/timezone";
// dayjs.extend(utc);
// dayjs.extend(timezone);
// dayjs.tz.setDefault("Asia/Shanghai");

interface Config {
  url: string;
  token: string;
  request: {
    method: "GET" | "POST";
    getParams: (content: string) => Record<string, string>;
  };
}

export class PushService {
  private configs: Record<string, Config> = {
    bark: {
      url: "https://api.day.app/push",
      token: envService.envs.BARK_TOKEN,
      request: {
        method: "POST",
        getParams: (content) => ({
          device_key: envService.envs.BARK_TOKEN,
          body: content,
        }),
      },
    },
    pushDeer: {
      url: "https://api2.pushdeer.com/message/push",
      token: envService.envs.PUSHDEER_TOKEN,
      request: {
        method: "GET",
        getParams: (content) => ({
          pushkey: envService.envs.PUSHDEER_TOKEN,
          text: content,
        }),
      },
    },
  };

  push = (content = "") => {
    Object.values(this.configs).forEach((config) => {
      if (!config.token) return;
      axios({
        url: config.url,
        method: config.request.method,
        params: config.request.getParams(content),
      });
    });
  };
}
