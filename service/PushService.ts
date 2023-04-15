import axios from "axios";
import envService from "./EnvService";

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
