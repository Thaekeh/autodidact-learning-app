import Head from "next/head";
import clientPromise from "../lib/mongodb";
import { InferGetServerSidePropsType } from "next";
import { getSession, useSession } from "next-auth/react";
import styled from "@emotion/styled";

export async function getServerSideProps() {
  try {
    await clientPromise;
    return {
      props: { isConnected: true },
    };
  } catch (e) {
    console.error(e);
    return {
      props: { isConnected: false },
    };
  }
}

export default function Home() {
  const { data: session } = useSession();

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

const FlexContainer = styled.div(`
  display: flex;
  flex-wrap: wrap;
`);
