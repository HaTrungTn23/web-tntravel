import { describe, expect, it } from "vitest";
import { publicAuthErrorMessage } from "./publicAuthErrors";

describe("public authentication errors", () => {
  it("explains when a confirmation email cannot be sent to an address", () => {
    expect(publicAuthErrorMessage({ code: "email_address_not_authorized", status: 403 }, "register", "vi"))
      .toContain("cấu hình dịch vụ gửi email");
  });

  it("does not mistake every 422 response for an existing account", () => {
    expect(publicAuthErrorMessage({ code: "weak_password", status: 422 }, "register", "vi"))
      .toContain("Mật khẩu");
  });

  it("distinguishes email rate limiting and connection failures", () => {
    expect(publicAuthErrorMessage({ code: "over_email_send_rate_limit", status: 429 }, "register", "vi"))
      .toContain("giới hạn gửi email");
    expect(publicAuthErrorMessage({ name: "AuthRetryableFetchError" }, "register", "vi"))
      .toContain("Không kết nối được");
  });
});
