import { PublicKey, Connection, Keypair, Transaction, sendAndConfirmTransaction, SystemProgram, TransactionInstruction } from '@solana/web3.js';
import { createNft, mplTokenMetadata } from '@metaplex-foundation/mpl-token-metadata';
import { createUmi, keypairIdentity, generateSigner, percentAmount, sol } from '@metaplex-foundation/umi';
import { RestClient } from '@uploadcare/rest-client';
import nodemailer from 'nodemailer';
import fs from 'fs';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

// Environment variables
const {
  UPLOADCARE_PUBLIC_KEY,
  UPLOADCARE_SECRET_KEY,
  WALLET_PATH,
  SOLANA_NETWORK = 'devnet',
  EMAIL_HOST,
  EMAIL_PORT = '587',
  EMAIL_USER,
  EMAIL_PASS
} = process.env;

// Initialize clients and configuration
const uploadcareClient = new RestClient({
  publicKey: UPLOADCARE_PUBLIC_KEY as string,
  secretKey: UPLOADCARE_SECRET_KEY as string
});

const connection = new Connection(SOLANA_NETWORK === 'devnet' ? 'https://api.mainnet-beta.solana.com' : 'https://api.devnet.solana.com', 'confirmed');

const transporter = nodemailer.createTransport({
  host: EMAIL_HOST as string,
  port: parseInt(EMAIL_PORT, 10),
  secure: false,
  auth: {
    user: EMAIL_USER as string,
    pass: EMAIL_PASS as string
  }
});

const walletKeypair = Keypair.fromSecretKey(new Uint8Array(JSON.parse(fs.readFileSync(WALLET_PATH as string, 'utf-8'))));

// Helper function to upload file to Uploadcare
async function uploadToUploadcare(filePath: string): Promise<string> {
  try {
    const file = fs.readFileSync(filePath);
    const response = await uploadcareClient.uploadFile(file, { store: 'auto' });
    return response?.fileUrl ?? '';
  } catch (error) {
    console.error('Uploadcare upload error:', error.message);
    throw new Error('Failed to upload file to Uploadcare.');
  }
}

// Helper function to send email notifications
async function sendEmailNotification(to: string, subject: string, text: string) {
  try {
    await transporter.sendMail({
      from: EMAIL_USER as string,
      to,
      subject,
      text
    });
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Email sending error:', error.message);
  }
}

// Validate NFT metadata
function validateNftMetadata(metadata: { name: string; uri: string; royalty: number; attributes?: { trait_type: string; value: string }[]; collection?: { name: string; family: string } }) {
  if (!metadata.name || !metadata.uri) {
    throw new Error('Invalid NFT metadata: Name and URI are required.');
  }
  if (metadata.royalty < 0 || metadata.royalty > 100) {
    throw new Error('Invalid NFT metadata: Royalty must be between 0 and 100.');
  }
  if (metadata.attributes) {
    for (const attr of metadata.attributes) {
      if (!attr.trait_type || !attr.value) {
        throw new Error('Invalid NFT metadata: Each attribute must have a trait_type and value.');
      }
    }
  }
  if (metadata.collection && (!metadata.collection.name || !metadata.collection.family)) {
    throw new Error('Invalid NFT metadata: Collection name and family are required.');
  }
}

// Generate NFT metadata object
function generateNftMetadata(name: string, symbol: string, uri: string, royalty: number, attributes: { trait_type: string; value: string }[], collection?: { name: string; family: string }): object {
  validateNftMetadata({ name, uri, royalty, attributes, collection });
  return {
    name,
    symbol,
    uri,
    royalty: percentAmount(royalty),
    attributes,
    collection
  };
}

// Mint a single NFT
async function mintSingleNft(metadata: object, recipientEmail: string) {
  try {
    const metadataPath = path.join(__dirname, 'metadata.json');
    fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));

    const metadataUrl = await uploadToUploadcare(metadataPath);

    const umi = createUmi({
      identity: keypairIdentity(walletKeypair),
      connection,
      tokenProgram: sol
    });

    const nft = await createNft(umi, {
      metadataUri: metadataUrl,
      creator: walletKeypair.publicKey.toString(),
      royalty: metadata.royalty
    });

    await sendEmailNotification(recipientEmail, 'NFT Minted Successfully', `Your NFT has been minted! Check it out here: ${metadataUrl}`);
    console.log('NFT minted successfully:', nft);
  } catch (error) {
    console.error('NFT minting error:', error.message);
  }
}

// Mint multiple NFTs
async function mintMultipleNfts(nftDetails: { name: string; symbol: string; uri: string; royalty: number; attributes: { trait_type: string; value: string }[]; collection?: { name: string; family: string } }[], recipientEmail: string) {
  try {
    for (const details of nftDetails) {
      const metadata = generateNftMetadata(details.name, details.symbol, details.uri, details.royalty, details.attributes, details.collection);
      await mintSingleNft(metadata, recipientEmail);
    }
  } catch (error) {
    console.error('Batch NFT minting error:', error.message);
  }
}

// Staking NFT
async function stakeNft(nftMintAddress: PublicKey, ownerPublicKey: PublicKey) {
  try {
    const instruction = new TransactionInstruction({
      keys: [
        { pubkey: nftMintAddress, isSigner: false, isWritable: true },
        { pubkey: ownerPublicKey, isSigner: true, isWritable: false },
        { pubkey: new PublicKey('YourStakingProgramPublicKey'), isSigner: false, isWritable: true }
      ],
      programId: new PublicKey('YourStakingProgramPublicKey'),
      data: Buffer.alloc(0) // Replace with actual data for staking
    });

    const transaction = new Transaction().add(instruction);
    const signature = await sendAndConfirmTransaction(connection, transaction, [walletKeypair]);
    console.log('NFT staked successfully, transaction signature:', signature);
  } catch (error) {
    console.error('NFT staking error:', error.message);
  }
}

// Fractionalize NFT
async function fractionalizeNft(nftMintAddress: PublicKey, fractionCount: number) {
  try {
    const instruction = new TransactionInstruction({
      keys: [
        { pubkey: nftMintAddress, isSigner: false, isWritable: true },
        { pubkey: walletKeypair.publicKey, isSigner: true, isWritable: false },
        { pubkey: new PublicKey('YourFractionalizationProgramPublicKey'), isSigner: false, isWritable: true }
      ],
      programId: new PublicKey('YourFractionalizationProgramPublicKey'),
      data: Buffer.from([fractionCount]) // Replace with actual data for fractionalization
    });

    const transaction = new Transaction().add(instruction);
    const signature = await sendAndConfirmTransaction(connection, transaction, [walletKeypair]);
    console.log('NFT fractionalized successfully, transaction signature:', signature);
  } catch (error) {
    console.error('NFT fractionalization error:', error.message);
  }
}

// Initiate buyout for fractionalized NFT
async function initiateBuyout(nftMintAddress: PublicKey, buyoutPercentage: number) {
  try {
    const instruction = new TransactionInstruction({
      keys: [
        { pubkey: nftMintAddress, isSigner: false, isWritable: true },
        { pubkey: walletKeypair.publicKey, isSigner: true, isWritable: false },
        { pubkey: new PublicKey('YourBuyoutProgramPublicKey'), isSigner: false, isWritable: true }
      ],
      programId: new PublicKey('YourBuyoutProgramPublicKey'),
      data: Buffer.from([buyoutPercentage]) // Replace with actual data for buyout
    });

    const transaction = new Transaction().add(instruction);
    const signature = await sendAndConfirmTransaction(connection, transaction, [walletKeypair]);
    console.log('Buyout initiated successfully, transaction signature:', signature);
  } catch (error) {
    console.error('NFT buyout error:', error.message);
  }
}

// Example usage
(async () => {
  try {
    const metadataUrl = await uploadToUploadcare('./path/to/metadata.json');

    const nftDetails = [
      {
        name: 'BARK NFT 1',
        symbol: 'BARK1',
        uri: metadataUrl,
        royalty: 5,
        attributes: [{ trait_type: 'Background', value: 'Forest' }],
        collection: { name: 'BARK Collection', family: 'BARK' }
      },
      {
        name: 'BARK NFT 2',
        symbol: 'BARK2',
        uri: metadataUrl,
        royalty: 5,
        attributes: [{ trait_type: 'Background', value: 'Desert' }]
      }
    ];

    await mintMultipleNfts(nftDetails, 'recipient@example.com');
  } catch (error) {
    console.error('Error:', error.message);
  }
})();
