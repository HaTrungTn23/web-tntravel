import "server-only";
import { cookies } from "next/headers";
import { defaultLocale, isLocale, localeCookieName, type Locale } from "./config";

export async function getServerLocale(): Promise<Locale> {
  const value = (await cookies()).get(localeCookieName)?.value;
  return isLocale(value) ? value : defaultLocale;
}
