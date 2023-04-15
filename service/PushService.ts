import axios from "axios";
import envService from "./EnvService";

// import dayjs from "dayjs";
// import utc from "dayjs/plugin/utc";
// import timezone from "dayjs/plugin/timezone";
// dayjs.extend(utc);
// dayjs.extend(timezone);
// dayjs.tz.setDefault("Asia/Shanghai");

export class PushService {
  private url = "https://api.day.app/push";

  private token = envService.envs.BARK_TOKEN;

  push(content = "") {
    return axios(this.url, {
      method: "POST",
      data: {
        body: content,
        device_key: this.token,
      },
    });
  }
}
