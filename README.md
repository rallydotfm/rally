# Rally

Rally is a voice-based social app (also called _social audio app_) where people from all around the world can gather together to share, listen, learn and talk together in real time.

## Get started

| **Pre-requisite**: `node` version `>=16`and `pnpm` installed

```diff
# Install dependencies
pnpm i

# in `packages/db`, create a `.env`
DATABASE_URL=<your-db>

# make sure the db is synced
pnpm db-push

# in apps/nextjs, create a `.env` and make sure to add all required values
# Lens API URL. In dev mode, we use Mumbai testnet
NEXT_PUBLIC_LENS_API_URL=https://api-mumbai.lens.dev
# Lens App ID
NEXT_PUBLIC_LENS_PUBLICATIONS_APP_ID=
# Lens Hub Proxy contract address. This is the contract address on Mumbai testnet.
NEXT_PUBLIC_LENS_HUB_PROXY=0x60Ae865ee4C725cd04353b5AAb364553f56ceF82
# Lens Periphery contract address. This is the contract address on Mumbai testnet.
NEXT_PUBLIC_LENS_PERIPHERY=0xD5037d72877808cdE7F669563e9389930AF404E8

# Start the project by running this command in the root folder.
pnpm dev
```

### Side-note regarding database

We use a MySQL database and Planetscale for the infrastructure.
You can check out [Planetscale documentation here](https://planetscale.com/docs) or check out [this Youtube video](https://www.youtube.com/watch?v=0w-pst8cTSo).

## Overview

**Current social audio apps don't work for web3 communities.**

Social audio applications are platforms where users interact with their voice in real time (for instance Spotify Live, Discord Stage, Zoom, Twitter Space...).

Currently, web3 communities rely heavily on those platforms for both their day-to-day communication and important one-time events. The problem: **Social audio apps don’t offer the best user experience possible to web3 communities.** All current social audio apps lack of one of the following features :

- **Access-control flexibility and customization**: fine-tuning access to live discussions (for token holders for example) and/or recordings is impossible.
- **Accessibility**: using a new platform requires to recreate a profile, follow different profiles, join groups, wait to be accepted in the group, follow topics... which is time consuming, and can be a blocker for certain community members, leaving a portion of the community out of the loop
- **Discoverability**: finding live discussions and/or recordings is difficult.
- **Privacy, security and anonymity**: current platforms track and sell user data, unbeknownst to said user ; joining live audio as an anonymous user isn't always an option either
- **Monetization**: platforms don't necessarily offer a way to creators to monetize their recordings/rooms
- **Interoperability**: announcing live chats and/or sharing recordings hosted on other platforms like Anchor, Apple/Google podcast, Spotify… is impossible, as current platforms try to lock-in users in their platforms

This is why we want to build Rally, **the go to social audio app for DAOs and web3 enthusiasts** when they want to make announcements, learn, discuss, debate, share, or just chill together.

Rally is a web application at the cross-road of web2 and web3, a social audio platform that will not only allow users to create live audio chats, but also **easily onboard entire communities**, and provide users a **secure** online experience where they are **in total control of what they publish, who can access it, how, and when**.

## Deploy to Vercel

Let's deploy the Next.js application to [Vercel](https://vercel.com/). If you have ever deployed a Turborepo app there, the steps are quite straightforward. You can also read the [official Turborepo guide](https://vercel.com/docs/concepts/monorepos/turborepo) on deploying to Vercel.

1. Create a new project on Vercel, select the `apps/nextjs` folder as the root directory and apply the following build settings in `Build & Development settings`:

```
Framework preset: Next.js

Build command : cd ../.. && npx turbo run build --filter nextjs
Output directory: Next.js default
Install command: pnpm install
Development command: next
```

```
Root directory: apps/nextjs
```

2. Add your `DATABASE_URL` environment variable.

3. Done! Your app should successfully deploy. Assign your domain and use that instead of `localhost` for the `url` in the Expo app so that your Expo app can communicate with your backend when you are not in development.

## Tech Stack

- Solidity: Smart contracts for audio chat creation
- 100ms: Infrastructure for real-time audio chats
- Lens Protocol: Decentralized social graph ; used to publish recordings, highlights and other publication related to audio chats ; display user profiles (for Lens users)
- Lit Protocol: Access control protocol ; used to gate access to rooms and publications ;
- Guild API : Access control and interoperability ; Platformless membership
- Web3 storage: Storage ; Used to store audio chats metadata
- Bundlr: Storage ; used to store recordings
- The Graph: Indexer
- Polygon/Mumbai: blockchain we will build on
- NextJS: Meta framework
- Rainbowkit: Wallet UI built on React/wagmi
- tRPC : end-to-end type safe API
- MySQL/Planetscale : database to store the user's topics of interest
- Prisma: TypeScript ORM
