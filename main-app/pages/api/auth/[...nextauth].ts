import { MongoClient } from "mongodb";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compareSync, hash } from "bcryptjs";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        console.log("authorizing 1");
        if (!credentials?.password || !credentials?.email) {
          throw Error("no correct credentials");
        }
        console.log("authorizing 2");
        if (!process.env.MONGODB_URI) {
          throw Error("Could not load the MONGODB_URI");
        }
        console.log("authorizing 3");

        const dbUser = await getUserByCredentials(credentials);

        if (dbUser) {
          // Any object returned will be saved in `user` property of the JWT
          return { ...dbUser, id: dbUser._id.toString() };
        } else {
          // If you return null then an error will be displayed advising the user to check their details.
          return dbUser;
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, token, user }) {
      if (session?.user) {
        session.user["id"] = token && token.sub;
      }
      return session;
    },
  },
  database: process.env.MONGODB_URI,
  session: {
    jwt: true,
    maxAge: 30 * 24 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET,
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
    encryption: true,
  },
};

export default NextAuth(authOptions);

interface LoginCredentials {
  email: string;
  password: string;
}

const getUserByCredentials = async ({ email, password }: LoginCredentials) => {
  console.log("start of userByCredentials");
  if (!process.env.MONGODB_URI) {
    throw Error("Could not load the MONGODB_URI");
  }
  const client = await MongoClient.connect(process.env.MONGODB_URI);
  const usersCollection = await client.db("learningHub").collection("users");

  let dbUser = await usersCollection.findOne({
    email: email,
  });
  if (!dbUser) {
    await usersCollection.insertOne({
      email: email,
      password: await hash(password, 12),
    });
    dbUser = await usersCollection.findOne({
      email: email,
    });
  }

  if (compareSync(password, dbUser?.password)) {
    return dbUser;
  } else {
    console.log("incorrect");
    throw Error("password not correct");
  }
};
