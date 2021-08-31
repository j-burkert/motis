import { sendRequest } from "./request";
import { verifyContentType } from "./protocol/checks";
import { Message } from "./protocol/motis";

export function sendRISForwardTimeRequest(
  newTime: number | Date
): Promise<Message> {
  return sendRequest("/ris/forward", "RISForwardTimeRequest", {
    new_time: typeof newTime === "number" ? newTime : newTime.getTime() / 1000,
  }).then((msg) => {
    return verifyContentType(msg, "MotisNoMessage");
  });
}