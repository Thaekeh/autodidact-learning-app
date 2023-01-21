import Head from "next/head";
import clientPromise from "../lib/mongodb";
import { InferGetServerSidePropsType } from "next";
import { getSession, useSession } from "next-auth/react";
import styled from "@emotion/styled";

export default function Home() {
  return (
    <div className="container">
      <Head>
        <title>Learning Hub</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <div>Test</div>
      </main>
    </div>
  );
}
