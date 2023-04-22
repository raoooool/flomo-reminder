class EnvService {
  envs = {
    FLOMO_AUTHORIZATION: process.env.FLOMO_AUTHORIZATION || "", // flomo jwt
    PUSH_TAGS: process.env.PUSH_TAGS || "", // 需要推送的 tags，用逗号分割
    BARK_TOKEN: process.env.BARK_TOKEN || "", // bark token
    PUSHDEER_TOKEN: process.env.PUSHDEER_TOKEN || "", // push-deer token
  };

  requiredEnvs: (keyof typeof this.envs)[] = ["FLOMO_AUTHORIZATION"];

  constructor() {
    const lackEnvs = (
      Object.keys(this.envs) as Array<keyof typeof this.envs>
    ).filter((key) => {
      if (!this.requiredEnvs.includes(key)) {
        return false;
      }
      return !this.envs[key];
    });

    if (lackEnvs.length) {
      throw new Error(`缺少环境变量 ${lackEnvs.join("、")}`);
    }
  }
}

const envService = new EnvService();

export default envService;
