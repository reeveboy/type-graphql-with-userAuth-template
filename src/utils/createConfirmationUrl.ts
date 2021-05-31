import { redis } from "../redis";
import { v4 } from "uuid";
import { CONFIRM_USER_PREFIX, FRONTEND_ORIGIN } from "../constants";

export const createConfirmationUrl = async (userId: number) => {
  const token = v4();
  await redis.set(CONFIRM_USER_PREFIX + token, userId, "ex", 60 * 60 * 24); // 1 day expiration

  return `${FRONTEND_ORIGIN}/user/confirm/${token}`;
};
