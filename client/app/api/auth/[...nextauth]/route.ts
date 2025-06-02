import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { Session } from 'next-auth';
import { UserType } from '@/types/generalTypes';
import { userLogin } from '@/service/registrationService';

// Define custom User type
interface CustomUser {
  id: string;
  email: string;
  token: string;
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials) {
          throw new Error('No credentials provided');
        }
        const res = await userLogin({email: credentials.email,password: credentials.password} as UserType)
        const data = await res.json();
        if (res.ok && data.token && data.user) {
          return { 
            id: data.user._id, 
            email: data.user.email, 
            token: data.token 
          };
        }
        throw new Error(data.error || 'Invalid credentials');
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: { token: { accessToken?: string; id?: string }; user?: CustomUser }) {
      if (user) {
        token.accessToken = user.token;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }: { session: Session & { accessToken?: string }; token: { accessToken?: string; id?: string } }) {
      if (token.accessToken) {
        session.accessToken = token.accessToken;
      }
      if (token.id) {
        session.user.id = token.id;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };