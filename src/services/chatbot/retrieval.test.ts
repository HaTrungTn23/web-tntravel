import { describe, expect, it } from "vitest";
import { buildRetrievalQuery } from "./retrieval";

describe("chatbot vector retrieval query", () => {
  it("removes Russian party-size details from the search query", () => {
    expect(buildRetrievalQuery("\u041f\u043e\u0441\u043e\u0432\u0435\u0442\u0443\u0439\u0442\u0435 \u043c\u0435\u0441\u0442\u0430 \u0432 \u0422\u0430\u0439 \u041d\u0433\u0443\u0435\u043d\u0435 \u0434\u043b\u044f \u0441\u0435\u043c\u044c\u0438 \u0438\u0437 4 \u0447\u0435\u043b\u043e\u0432\u0435\u043a"))
      .toBe("\u041f\u043e\u0441\u043e\u0432\u0435\u0442\u0443\u0439\u0442\u0435 \u043c\u0435\u0441\u0442\u0430 \u0432 \u0422\u0430\u0439 \u041d\u0433\u0443\u0435\u043d\u0435");
  });

  it("removes Vietnamese party-size details from the search query", () => {
    expect(buildRetrievalQuery("G\u1ee3i \u00fd \u0111\u1ecba \u0111i\u1ec3m \u1edf Th\u00e1i Nguy\u00ean cho gia \u0111\u00ecnh c\u00f3 4 ng\u01b0\u1eddi"))
      .toBe("G\u1ee3i \u00fd \u0111\u1ecba \u0111i\u1ec3m \u1edf Th\u00e1i Nguy\u00ean");
  });

  it("keeps the original question when there is no party-size detail", () => {
    const question = "\u041a\u0430\u043a\u0438\u0435 \u0434\u043e\u0441\u0442\u043e\u043f\u0440\u0438\u043c\u0435\u0447\u0430\u0442\u0435\u043b\u044c\u043d\u043e\u0441\u0442\u0438 \u0435\u0441\u0442\u044c \u0432 \u0422\u0445\u0430\u0439\u043d\u0433\u0443\u0435\u043d\u0435?";
    expect(buildRetrievalQuery(question)).toBe(question);
  });
});
