import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import type { AuthUser } from "@/lib/auth";

export function redirectAfterLogin(
  router: AppRouterInstance,
  user: Pick<AuthUser, "role">
) {
  if (user.role === "admin") {
    router.push("/admin/dashboard");
  } else if (user.role === "owner") {
    router.push("/owner/dashboard");
  } else if (user.role === "user") {
    router.push("/user/dashboard");
  } else {
    router.push("/");
  }
}
