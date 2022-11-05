import * as zod from "zod";
import { FastifyInstance } from "fastify";

import { prisma } from "../lib/prisma";
import { authenticate } from "../plugins/authenticate";

export async function guessRoutes(fastify: FastifyInstance) {
  fastify.get("/guesses/count", async () => {
    const count = await prisma.guess.count();

    return { count };
  });

  fastify.post(
    "/pools/:poolId/games/:gameId/guesses",
    {
      onRequest: [authenticate],
    },
    async (request, reply) => {
      const createGuessParams = zod.object({
        poolId: zod.string(),
        gameId: zod.string(),
      });

      const createGuessBody = zod.object({
        firstTeamPoints: zod.number(),
        secondTeamPoints: zod.number(),
      });

      const { poolId, gameId } = createGuessParams.parse(request.params);
      const { firstTeamPoints, secondTeamPoints } = createGuessBody.parse(
        request.body
      );

      const participant = await prisma.participant.findUnique({
        where: {
          userId_poolId: {
            poolId,
            userId: request.user.sub,
          },
        },
      });

      // if participant not found in pool, he cannot create a guess
      if (!participant) {
        return reply.status(400).send({
          message: "You're not allowed to create a guess inside the pool.",
        });
      }

      const guess = await prisma.guess.findUnique({
        where: {
          participantId_gameId: {
            participantId: participant.id,
            gameId,
          },
        },
      });

      // if user has already created guess this game, he cannot create another one
      if (guess) {
        return reply.status(400).send({
          message: "You already send a guess to this game on this pool.",
        });
      }

      const game = await prisma.game.findUnique({
        where: {
          id: gameId,
        },
      });

      if (!game) {
        return reply.status(400).send({
          message: "Game not found.",
        });
      }

      if (game.date < new Date()) {
        return reply.status(400).send({
          message: "You cannot send guesses after the game date.",
        });
      }

      await prisma.guess.create({
        data: {
          gameId,
          firstTeamPoints,
          secondTeamPoints,
          participantId: participant.id,
        },
      });

      return reply.status(201).send();
    }
  );
}
