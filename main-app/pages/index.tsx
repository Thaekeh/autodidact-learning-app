import Head from "next/head";
import clientPromise from "../lib/mongodb";
import { InferGetServerSidePropsType } from "next";
import { getSession, useSession } from "next-auth/react";
import styled from "@emotion/styled";

export default function Home() {
  return (
    <div className="container">
      <main>
        <div>Test</div>
      </main>
    </div>
  );
}
