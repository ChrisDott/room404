"use client";
import { ConvexReactClient } from "convex/react";
import { ConvexProvider } from "convex/react";
import React from "react";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;

if (!convexUrl) {
  // eslint-disable-next-line no-console
  console.warn(
    "NEXT_PUBLIC_CONVEX_URL is not set. Convex client will not connect."
  );
}

const client = convexUrl ? new ConvexReactClient(convexUrl) : undefined;

export function ConvexProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!client) return <>{children}</>;
  return <ConvexProvider client={client}>{children}</ConvexProvider>;
}


