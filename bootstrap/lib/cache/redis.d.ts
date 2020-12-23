declare class RedisCache {
  constructor(options: any): RedisCache;
  async connect(); 
  static async build(options: any)
  async set(key: string, value: string, maxAge?: number)
  async get(key: string)
  async del(key: string)
}
export const defaultOptions: () => {
    host: string;
    port: string | number;
    path: any;
    url: any;
    password: any;
    maxAge: number;
    timeout: number;
}
export const redactOptions: (opts: any) => any
