import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({});

async function main() {
  const user = await prisma.user.create({
    data: {
      name: "John doe",
      email: "johndoe@gmail.com",
      avatarUrl: "https://github.com/erik-ferreira.png",
    },
  });

  const pool = await prisma.pool.create({
    data: {
      title: "Pool Example",
      code: "POL123",
      ownerId: user.id,

      participants: {
        create: {
          userId: user.id,
        },
      },
    },
  });

  await prisma.game.create({
    data: {
      date: "2022-11-26T12:00:00.201Z",
      firstTeamCountryCode: "DE",
      secondTeamCountryCode: "BR",
    },
  });

  await prisma.game.create({
    data: {
      date: "2022-11-27T12:00:00.201Z",
      firstTeamCountryCode: "BR",
      secondTeamCountryCode: "AR",

      guesses: {
        create: {
          firstTeamPoints: 2,
          secondTeamPoints: 1,

          participant: {
            connect: {
              userId_poolId: {
                userId: user.id,
                poolId: pool.id,
              },
            },
          },
        },
      },
    },
  });
}

main();
