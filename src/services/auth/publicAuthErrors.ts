import type { Locale } from "@/i18n/config";

type AuthFailure = { code?: string; status?: number; message?: string; name?: string };
type AuthMode = "login" | "register";

const messages: Record<Locale, Record<string, string>> = {
  vi: {
    invalidCredentials: "Email hoặc mật khẩu chưa đúng.",
    unconfirmed: "Email này chưa được xác nhận. Hãy mở thư xác nhận rồi đăng nhập lại.",
    existing: "Email này đã có tài khoản. Hãy chuyển sang Đăng nhập.",
    invalidEmail: "Địa chỉ email chưa hợp lệ. Hãy kiểm tra và thử lại.",
    gmailRequired: "Bản demo chỉ nhận địa chỉ kết thúc bằng @gmail.com.",
    weakPassword: "Mật khẩu chưa đáp ứng yêu cầu bảo mật. Hãy chọn mật khẩu dài và khó đoán hơn.",
    unauthorizedEmail: "Hệ thống hiện chưa thể gửi thư xác nhận tới email này. Quản trị viên cần cấu hình dịch vụ gửi email cho Supabase.",
    emailLimit: "Hệ thống đã đạt giới hạn gửi email xác nhận. Vui lòng thử lại sau hoặc liên hệ quản trị viên.",
    requestLimit: "Bạn đã thử quá nhiều lần. Vui lòng đợi vài phút rồi thử lại.",
    signupDisabled: "Hệ thống hiện chưa cho phép đăng ký tài khoản mới.",
    demoUnavailable: "Đăng ký demo chưa được bật trên máy chủ.",
    emailDelivery: "Không gửi được email xác nhận. Vui lòng liên hệ quản trị viên để kiểm tra cấu hình gửi thư.",
    server: "Dịch vụ đăng ký đang gặp lỗi. Vui lòng liên hệ quản trị viên.",
    network: "Không kết nối được dịch vụ tài khoản. Hãy kiểm tra mạng và thử lại.",
    fallback: "Chưa thể thực hiện yêu cầu. Vui lòng thử lại.",
  },
  en: {
    invalidCredentials: "The email or password is incorrect.",
    unconfirmed: "This email has not been confirmed. Open the confirmation email, then sign in again.",
    existing: "This email already has an account. Please sign in.",
    invalidEmail: "The email address is invalid. Check it and try again.",
    gmailRequired: "This demo only accepts addresses ending in @gmail.com.",
    weakPassword: "The password does not meet the security requirements. Choose a longer, stronger password.",
    unauthorizedEmail: "Confirmation emails cannot be sent to this address yet. The administrator needs to configure email delivery in Supabase.",
    emailLimit: "The confirmation email limit has been reached. Try again later or contact the administrator.",
    requestLimit: "Too many attempts. Wait a few minutes and try again.",
    signupDisabled: "New account registration is currently disabled.",
    demoUnavailable: "Demo registration is not enabled on the server.",
    emailDelivery: "The confirmation email could not be sent. Contact the administrator to check email delivery settings.",
    server: "The registration service is having trouble. Please contact the administrator.",
    network: "Could not reach the account service. Check your connection and try again.",
    fallback: "We could not complete that request. Try again.",
  },
  ru: {
    invalidCredentials: "Неверный адрес почты или пароль.",
    unconfirmed: "Адрес почты ещё не подтверждён. Откройте письмо с подтверждением и войдите снова.",
    existing: "Аккаунт с этой почтой уже существует. Войдите в него.",
    invalidEmail: "Проверьте адрес электронной почты и попробуйте снова.",
    gmailRequired: "В демоверсии принимаются только адреса с окончанием @gmail.com.",
    weakPassword: "Пароль не соответствует требованиям безопасности. Выберите более длинный и надёжный пароль.",
    unauthorizedEmail: "Письмо с подтверждением пока нельзя отправить на этот адрес. Администратору нужно настроить отправку почты в Supabase.",
    emailLimit: "Достигнут лимит отправки писем. Попробуйте позже или свяжитесь с администратором.",
    requestLimit: "Слишком много попыток. Подождите несколько минут и попробуйте снова.",
    signupDisabled: "Регистрация новых аккаунтов сейчас недоступна.",
    demoUnavailable: "Регистрация в демоверсии не включена на сервере.",
    emailDelivery: "Не удалось отправить письмо с подтверждением. Обратитесь к администратору для проверки почты.",
    server: "Сервис регистрации временно недоступен. Обратитесь к администратору.",
    network: "Не удалось подключиться к сервису аккаунтов. Проверьте соединение и попробуйте снова.",
    fallback: "Не удалось выполнить запрос. Попробуйте ещё раз.",
  },
};

export function publicAuthErrorMessage(error: AuthFailure, mode: AuthMode, locale: Locale) {
  const copy = messages[locale];
  switch (error.code) {
    case "invalid_credentials": return copy.invalidCredentials;
    case "email_not_confirmed": return copy.unconfirmed;
    case "email_exists":
    case "user_already_exists": return copy.existing;
    case "email_address_invalid":
    case "validation_failed": return copy.invalidEmail;
    case "gmail_required": return copy.gmailRequired;
    case "weak_password": return copy.weakPassword;
    case "email_address_not_authorized": return copy.unauthorizedEmail;
    case "over_email_send_rate_limit": return copy.emailLimit;
    case "over_request_rate_limit": return copy.requestLimit;
    case "signup_disabled":
    case "email_provider_disabled": return copy.signupDisabled;
    case "demo_signup_unavailable": return copy.demoUnavailable;
    case "request_timeout": return copy.network;
  }
  if (/error sending (?:confirmation )?email|failed to send email/i.test(error.message ?? "")) return copy.emailDelivery;
  if (error.name === "AuthRetryableFetchError" || !error.status) return copy.network;
  if (error.status >= 500) return copy.server;
  if (mode === "login") return copy.invalidCredentials;
  return `${copy.fallback}${error.code ? ` (${error.code})` : error.status ? ` (HTTP ${error.status})` : ""}`;
}
