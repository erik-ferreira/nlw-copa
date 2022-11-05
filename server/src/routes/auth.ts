import axios from "axios";
import * as zod from "zod";
import { FastifyInstance } from "fastify";

import { prisma } from "../lib/prisma";
import { authenticate } from "../plugins/authenticate";

export async function authRoutes(fastify: FastifyInstance) {
  fastify.get(
    "/me",
    {
      onRequest: [authenticate],
    },
    async (request) => {
      return { user: request.user };
    }
  );

  fastify.post("/users", async (request, reply) => {
    const createUserBody = zod.object({
      access_token: zod.string(),
    });

    const { access_token } = createUserBody.parse(request.body);

    const userResponse = await axios.get(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    const userInfoSchema = zod.object({
      id: zod.string(),
      email: zod.string().email(),
      name: zod.string(),
      picture: zod.string().url(),
    });

    const userInfo = userInfoSchema.parse(userResponse.data);

    let user = await prisma.user.findUnique({
      where: {
        googleId: userInfo.id,
      },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          googleId: userInfo.id,
          name: userInfo.name,
          email: userInfo.email,
          avatarUrl: userInfo.picture,
        },
      });
    }

    const token = fastify.jwt.sign(
      {
        name: user.name,
        avatarUrl: user.avatarUrl,
      },
      {
        sub: user.id,
        expiresIn: "7 days",
      }
    );

    return { token };
  });
}
