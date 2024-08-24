# NFT Minting Dapp

A comprehensive tool for minting NFTs on the Solana blockchain with advanced features like dynamic metadata updates, staking, fractional ownership, and email notifications.

## Overview

The BARK NFT Minting Dapp allows users to mint, stake, fractionalize, and buy out NFTs on the Solana blockchain. This application integrates with Uploadcare for off-chain storage and provides functionalities for NFT management and advanced features such as staking and fractionalization.

## Features

- **Minting NFTs**: Create and mint NFTs with custom metadata.
- **Staking**: Stake NFTs to participate in specific programs.
- **Fractionalization**: Divide NFTs into fractions for partial ownership.
- **Buyout**: Initiate buyouts for fractionalized NFTs.
- **Email Notifications**: Receive email alerts for NFT-related activities.
- **Secure File Upload**: Uses Uploadcare for storing NFT metadata.

## Project Structure

```
bark-nft-minting-dapp/
│
├── src/
│   ├── index.ts          # Entry point of the application
│   ├── app.ts            # Main application logic for NFT minting, staking, etc.
│   ├── nft.ts            # Functions and utilities related to NFTs
│   ├── staking.ts        # Functions for staking NFTs
│   ├── fractionalization.ts # Functions for fractionalizing NFTs
│   ├── buyout.ts         # Functions for initiating buyouts
│   ├── utils/
│   │   ├── uploadcare.ts # Utility functions for Uploadcare integration
│   │   ├── email.ts      # Utility functions for sending emails
│   │   └── validation.ts # Utility functions for validating NFT metadata
│   └── config.ts         # Configuration file and environment variables handling
│
├── assets/
│   └── metadata/
│       └── nft_metadata.json # Example metadata for NFTs
│
├── tests/
│   ├── app.test.ts       # Tests for the main application logic
│   ├── nft.test.ts       # Tests for NFT-related functions
│   ├── staking.test.ts   # Tests for staking functionality
│   ├── fractionalization.test.ts # Tests for fractionalization functionality
│   └── buyout.test.ts    # Tests for buyout functionality
│
├── scripts/
│   ├── deploy.ts         # Script for deploying smart contracts or other deployment tasks
│   ├── setup.ts          # Script for setting up the development environment
│   └── example.ts        # Example script to demonstrate usage
│
├── .env                  # Environment variables
├── .gitignore             # Git ignore file
├── package.json           # NPM package descriptor
├── README.md             # Project documentation
└── tsconfig.json         # TypeScript configuration
```

## Getting Started

### Prerequisites

- Node.js
- Solana CLI and wallet setup
- Uploadcare account
- Access to Solana devnet or mainnet

### Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/barkprotocol/mint-nft.git
    cd mint-nft
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Set up environment variables:

    Create a `.env` file in the root directory and add the following:

    ```plaintext
    UPLOADCARE_PUBLIC_KEY=your_uploadcare_public_key
    UPLOADCARE_SECRET_KEY=your_uploadcare_secret_key
    WALLET_PATH=path_to_your_wallet.json
    SOLANA_NETWORK=devnet
    EMAIL_HOST=your_email_host
    EMAIL_PORT=your_email_port
    EMAIL_USER=your_email_user
    EMAIL_PASS=your_email_password
    ```

### Usage

1. **Minting NFTs**

    Create a JSON file with NFT metadata and use the script to mint NFTs:

    ```typescript
    import { mintMultipleNfts } from './app'; // Ensure this function is exported in your app.ts

    const nftDetails = [
      {
        name: 'BARK NFT 1',
        symbol: 'BARK1',
        uri: 'https://your_metadata_uri',
        royalty: 5,
        attributes: [{ trait_type: 'Background', value: 'Forest' }],
        collection: { name: 'BARK Collection', family: 'BARK' }
      },
      {
        name: 'BARK NFT 2',
        symbol: 'BARK2',
        uri: 'https://your_metadata_uri',
        royalty: 5,
        attributes: [{ trait_type: 'Background', value: 'Desert' }]
      }
    ];

    mintMultipleNfts(nftDetails, 'recipient@example.com');
    ```

2. **Staking an NFT**

    Call the `stakeNft` function with the NFT mint address and owner public key:

    ```typescript
    import { stakeNft } from './app';

    const nftMintAddress = new PublicKey('your_nft_mint_address');
    const ownerPublicKey = new PublicKey('your_wallet_public_key');

    stakeNft(nftMintAddress, ownerPublicKey);
    ```

3. **Fractionalizing an NFT**

    Use the `fractionalizeNft` function to divide the NFT:

    ```typescript
    import { fractionalizeNft } from './app';

    const nftMintAddress = new PublicKey('your_nft_mint_address');
    const fractionCount = 10; // Number of fractions

    fractionalizeNft(nftMintAddress, fractionCount);
    ```

4. **Initiating a Buyout**

    Call the `initiateBuyout` function for fractionalized NFTs:

    ```typescript
    import { initiateBuyout } from './app';

    const nftMintAddress = new PublicKey('your_nft_mint_address');
    const buyoutPercentage = 50; // Buyout percentage

    initiateBuyout(nftMintAddress, buyoutPercentage);
    ```

## Contributing

We welcome contributions to improve this dApp. Please follow these steps:

1. Fork the repository.
2. Create a feature branch.
3. Commit your changes.
4. Push to the branch.
5. Create a pull request.

## License

The MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgments

- **Uploadcare**: For providing reliable off-chain storage.
- **Solana**: For its high-performance blockchain.
- **Metaplex**: For enabling NFT standards on Solana.
