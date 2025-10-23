export { default } from 'next-auth/middleware'

export const config = {
  matcher: ['/dashboard/:path*', '/events/:path*', '/quests/:path*', '/leaderboard/:path*'],
}
