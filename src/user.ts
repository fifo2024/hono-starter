import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";

// user模块
const user = new Hono();

user.get("/list", (c) => {
    throw new HTTPException(401);
    return c.text("List users");
}); // GET /user
user.get("/:id", (c) => {
    // GET /user/:id
    const id = c.req.param("id");
    return c.text("Get user: " + id);
});
user.post("/", (c) => c.text("Create user")); // POST /user

export default user;
