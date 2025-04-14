import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized: ({ token }) => {
      // マイページはサインイン済みユーザーのみアクセス可能
      return !!token;
    },
  },
});

export const config = {
  matcher: ["/mypage"],
};
