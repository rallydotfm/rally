# Rally

Rally is an open-source alternative to Twitter Space/Clubhouse for web3 communities.
Built with Polygon, Livekit, Lens Protocol, Lit Protocol, The Graph, Storj, Bundlr and Guild.

## Overview

**Current social audio apps don't work for web3 communities.**

Social audio applications are platforms where users interact with their voice in real time (for instance Spotify Live, Discord Stage, Zoom, Twitter Space...).

Currently, web3 communities rely heavily on those platforms for both their day-to-day communication and important one-time events. The problem: **Social audio apps don’t offer the best user experience possible to web3 communities.** All current social audio apps lack of one of the following features :

- **Access-control flexibility and customization**: fine-tuning access to live discussions (for token holders for example) and/or recordings is impossible.
- **Accessibility**: using a new platform requires to recreate a profile, follow different profiles, join groups, wait to be accepted in the group, follow topics... which is time consuming, and can be a blocker for certain community members, leaving a portion of the community out of the loop
- **Discoverability**: finding live discussions and/or recordings is difficult.
- **Privacy, security and anonymity**: current platforms track and sell user data, unbeknownst to said user ; joining live audio as an anonymous user isn't always an option either
- **Monetization**: platforms don't necessarily offer a way to creators to monetize their recordings/rooms
- **Interoperability**: announcing live chats and/or sharing recordings hosted on other platforms like Anchor, Apple/Google podcast, Spotify… is impossible, as current platforms try to lock-in users in their platforms. This also means that your content and social graph are tied to the platform - if it goes down, so will your data.

**Enters Web3**. Web3 is unique because it offers the tools to create an online experience that not only features these 5 principles but also:

- **1️⃣ Easily onboard entire communities;**
- 2️⃣ Provides users an online experience where they are **in total control of what they publish, who can access it, how, and when ;**
- 3️⃣ Provides **a permanent and platformless online experience to users**, meaning if a certain link in the chain would break, users will still have access to their data and content, **regardless of the platform** ;

This is why we want to build Rally, **the go to social audio app for DAOs and web3 enthusiasts** when they want to make announcements, learn, discuss, debate, share, or just chill together.

Rally is a web application at the cross-road of web2 and web3, a social audio platform that will not only allow users to create live audio chats, but also **easily onboard entire communities**, and provide users a **secure** online experience where they are **in total control of what they publish, who can access it, how, and when**.

## Get started

| **Pre-requisite**: `node` version `>=16`and `pnpm` installed

```diff
# Install dependencies
pnpm i

# in apps/nextjs, create a `.env` and make sure to add all required values

# Lens API URL. In dev mode, we use Mumbai testnet
NEXT_PUBLIC_LENS_API_URL=https://api-mumbai.lens.dev

# Lens App ID
NEXT_PUBLIC_LENS_PUBLICATIONS_APP_ID=

# Lens Hub Proxy contract address. This is the contract address on Mumbai testnet.
NEXT_PUBLIC_CONTRACT_LENS_HUB_PROXY=0x60Ae865ee4C725cd04353b5AAb364553f56ceF82

# Lens Periphery contract address. This is the contract address on Mumbai testnet.
NEXT_PUBLIC_CONTRACT_LENS_PERIPHERY=0xD5037d72877808cdE7F669563e9389930AF404E8

# Web3 Storage key. Replace with yours !
NEXT_PUBLIC_WEB3_STORAGE=

# Audio chat management smart contract. This is the contract address on Mumbai testnet
NEXT_PUBLIC_CONTRACT_AUDIOCHAT=0xC9047698C519486106Cbabb160000e0f46FFd160

# Chain used
NEXT_PUBLIC_CHAIN=mumbai

# Livekit server URL. Replace with yours !
# Docs: https://docs.livekit.io/concepts/authentication/
NEXT_PUBLIC_LIVEKIT_URL=

# Alchemy SDK API key. Replace with yours !
NEXT_PUBLIC_ALCHEMY_KEY=

# This is to allow gasless transactions on Lens (mumbai only - we are not whitelisted!)
NEXT_PUBLIC_INTERACTION_MODE=gasless

# Supabase URL. Replace with yours !
NEXT_PUBLIC_SUPABASE_URL=

# Supabase anon key. Replace with yours !
NEXT_PUBLIC_ANON_KEY=

# Deployed subgraph url (using The Graph hosted service)
NEXT_PUBLIC_SUBGRAPH_RALLY_API_URL=https://api.thegraph.com/subgraphs/name/<your-github-handle>/<your-subgraph-name>

# RPC Url
NEXT_PUBLIC_RPC_URL=https://polygon-mumbai.g.alchemy.com/v2/ls0_apQ2rJVqEZu_h9vWJZI5yIrdLKJM

# Base URL (eg: https://alpha.letsrally.fm). Default to localhost:3000 - don't forget to replace this value with your domain name in prod, otherwise wallet verification won't work !
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Used to encrypt the NextAuth.js JWT
NEXTAUTH_SECRET=`openssl rand -hex 32`

# Base URL used by NextAuth (eg: https://alpha.letsrally.fm). Default to localhost:3000 - don't forget to replace this value with your domain name in prod, otherwise wallet verification won't work !
NEXTAUTH_URL=http://localhost:3000

# Livekit Server API key. Replace with yours !
# Docs: https://docs.livekit.io/concepts/authentication/
LIVEKIT_API_KEY=

# Livekit Server secret key. Replace with yours !
# Docs: https://docs.livekit.io/concepts/authentication/
LIVEKIT_SECRET_KEY=

# S3-compatible service access key. Replace with yours !
S3_ACCESS_KEY=

# S3-compatible service secret key. Replace with yours !
S3_SECRET_KEY=

# S3-compatible service endpoint. Replace with yours !
S3_ENDPOINT=

# S3-compatible service bucket name. Replace with yours !
S3_BUCKET_NAME=

# Base path used to store recordings in the S3 bucket (eg: /sessions/recordings/). Replace with yours !
S3_RECORDINGS_BASE_KEY=

# Start the project by running this command in the root folder.
pnpm dev
```

## Overview

**Current social audio apps don't work for web3 communities.**

Social audio applications are platforms where users interact with their voice in real time (for instance Spotify Live, Discord Stage, Zoom, Twitter Space...).

Currently, web3 communities rely heavily on those platforms for both their day-to-day communication and important one-time events. The problem: **Social audio apps don’t offer the best user experience possible to web3 communities.** All current social audio apps lack of one of the following features :

- **Access-control flexibility and customization**: fine-tuning access to live discussions (for token holders for example) and/or recordings is impossible.
- **Accessibility**: using a new platform requires to recreate a profile, follow different profiles, join groups, wait to be accepted in the group, follow topics... which is time consuming, and can be a blocker for certain community members, leaving a portion of the community out of the loop
- **Discoverability**: finding live discussions and/or recordings is difficult.
- **Privacy, security and anonymity**: current platforms track and sell user data, unbeknownst to said user ; joining live audio as an anonymous user isn't always an option either
- **Monetization**: platforms don't necessarily offer a way to creators to monetize their recordings/rooms
- **Interoperability**: announcing live chats and/or sharing recordings hosted on other platforms like Anchor, Apple/Google podcast, Spotify… is impossible, as current platforms try to lock-in users in their platforms. This also means that your content and social graph are tied to the platform - if it goes down, so will your data.

**Enters Web3**. Web3 is unique because it offers the tools to create an online experience that not only features these 5 principles but also:

- **1️⃣ Easily onboard entire communities;**
- 2️⃣ Provides users an online experience where they are **in total control of what they publish, who can access it, how, and when ;**
- 3️⃣ Provides **a permanent and platformless online experience to users**, meaning if a certain link in the chain would break, users will still have access to their data and content, **regardless of the platform** ;

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

- Solidity: Smart contracts for audio chat creation.
- IPFS: Storage ; Used to store audio chats metadata
- Lit Protocol: Access control protocol ; used to gate access to published recordings ;
- Guild API : Access control and interoperability ; Platformless membership ; used to gate access to audio rooms ;
- Bundlr: Storage ; used to store recordings
- Livekit: Open-source and scalable WebRTC stack ; used for real-time audio chats
- Lens Protocol: Decentralized social graph ; used to publish recordings, highlights and other publication related to audio chats ; display user profiles (for Lens users)
- ENS
- The Graph: Indexer ; used to display indexed audio chats and recordings ;
- Polygon/Mumbai: blockchain we will build on
- NextJS: Meta framework
- Rainbowkit: Wallet UI built on React/wagmi
- tRPC : end-to-end type safe API
- StorJ: decentralized S3 compatible storage solution
