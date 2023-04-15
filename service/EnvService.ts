class EnvService {
  envs = {
    FLOMO_AUTHORIZATION: process.env.FLOMO_AUTHORIZATION || "",
    BARK_TOKEN: process.env.BARK_TOKEN || "",
  };

  constructor() {
    const lackEnvs = (
      Object.keys(this.envs) as Array<keyof typeof this.envs>
    ).filter((key) => {
      return !this.envs[key];
    });

    if (lackEnvs.length) {
      throw new Error(`缺少环境变量 ${lackEnvs.join("、")}`);
    }
  }
}

const envService = new EnvService();

export default envService;
