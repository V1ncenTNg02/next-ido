// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck

import NextAuth from 'next-auth'
import TwitterProvider from 'next-auth/providers/twitter'

import config from '../../../configs'

export default NextAuth({
  providers: [
    TwitterProvider({
      clientId: config.twitterClientId,
      clientSecret: config.twitterClientSecret,
      profile(profile) {
        return {
          id: profile.id_str,
          name: profile.name,
          email: profile.email,
          image: profile.profile_image_url_https,
          username: '@' + profile.screen_name
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (account?.provider === 'twitter') {
        token.username = user.username
        token.hasTwitter = true
      }
      return token
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.hasTwitter = token.hasTwitter || false
        session.user.username = token.username || null
      }

      return {
        ...session,
        user: {
          ...session.user
        }
      }
    },
    async signIn({ user, account }) {
      //Twitter
      if (account && account.provider === 'twitter') {
        user.hasTwitter = true
        return true
      }

      return false
    }
  },
  secret: process.env.NEXTAUTH_SECRET
})
