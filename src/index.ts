import { Hono } from "hono";
import { showRoutes } from "hono/dev";
import { cors } from "hono/cors";
import { csrf } from "hono/csrf";
import { HTTPException } from "hono/http-exception";
import { ErrorCode } from "./type";
import user from "./user";

const app = new Hono();
// 统一的前缀
const api = app.basePath("/api");

// 预防csrf攻击
api.use(csrf());
// 所有接口设置cors， 也可以分别设置cors， 如user相关接口只允许指定ip访问
api.use("*", cors());

app.get("/", (c) => {
    return c.text("Hello Hono!");
});
app.post("/", (c) => c.text("POST /"));
app.put("/", (c) => c.text("PUT /"));
app.delete("/", (c) => c.text("DELETE /"));
app.onError((err, c) => {
    // 任何请求， http status 返回200， 错误码在返回体自定义
    const status = 200;
    // 记录原始的错误， 返回给前端的是友好的信息
    // TODO Logger
    let errorCode = 40001;
    const errorMsg = "不是我的错，想想前端的问题！";
    if (err instanceof HTTPException) {
        errorCode = ErrorCode.UNAUTHORIZED;
    }

    const response = {
        code: errorCode,
        data: null,
        message: errorMsg,
    };
    return c.json(response, status);
});

// 每个实例的err要自己监听
// api.onError(errorHandler)

// verbose 会显示详情信息， 如： 是否使用了中间件
// showRoutes(api, { verbose: false })

// 使用user路由组
app.route("/user", user);

// 增加一层v1的路由方式
const v1 = new Hono();
v1.route("/user", user);
app.route("/v1", v1);

export default {
    port: Bun.env.PORT,
    fetch: app.fetch,
};
