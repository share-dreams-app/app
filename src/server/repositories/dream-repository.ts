import { db } from "@/lib/db";

export function createDreamRepository() {
  return {
    countActiveDreams(ownerId: string) {
      return db.dream.count({
        where: {
          ownerId,
          status: "ACTIVE"
        }
      });
    },
    createDream(input: { ownerId: string; title: string }) {
      return db.dream.create({
        data: {
          ownerId: input.ownerId,
          title: input.title
        }
      });
    }
  };
}
