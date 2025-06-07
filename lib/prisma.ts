import { PrismaClient } from "@prisma/client";

export default function getPrismaClient() {
  return new PrismaClient();
}
