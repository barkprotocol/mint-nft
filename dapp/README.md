# BARK NFT Minting Dapp

Welcome to the BARK NFT Minting Dapp! This application enables users to mint NFTs on the Solana blockchain using a full-stack TypeScript solution. The frontend is built with Next.js, and the backend service handles the NFT minting process and interacts with Solana and Uploadcare.

## Project Structure

- `backend/`: Contains the backend service implemented in TypeScript.
- `frontend/`: Contains the Next.js frontend application.

## Features

- **Mint NFTs**: Create unique NFTs with detailed metadata on Solana.
- **Staking and Fractionalization**: Manage NFT staking and fractionalization (not fully implemented; see [future enhancements](#future-enhancements)).
- **Uploadcare Integration**: Upload NFT metadata and assets to Uploadcare for storage.

## Backend Setup

### Prerequisites

- Node.js
- npm

### Installation

1. **Navigate to the `backend` directory:**

    ```bash
    cd backend
    ```

2. **Install dependencies:**

    ```bash
    npm install
    ```

3. **Set up environment variables:**

   Create a `.env` file in the `backend` directory with the following content:

    ```plaintext
    SOLANA_NETWORK=mainnet-beta
    UPLOADCARE_PUBLIC_KEY=your-uploadcare-public-key
    UPLOADCARE_SECRET_KEY=your-uploadcare-secret-key
    ```

4. **Build and start the backend service:**

    ```bash
    npm run build
    npm start
    ```

   The backend service will be available at `http://localhost:3001`.

## Frontend Setup

### Prerequisites

- Node.js
- npm

### Installation

1. **Navigate to the `frontend` directory:**

    ```bash
    cd frontend
    ```

2. **Install dependencies:**

    ```bash
    npm install
    ```

3. **Set up environment variables:**

   Create a `.env.local` file in the `frontend` directory with the following content:

    ```plaintext
    NEXT_PUBLIC_API_URL=http://localhost:3001
    ```

4. **Start the Next.js development server:**

    ```bash
    npm run dev
    ```

   The frontend application will be available at `http://localhost:3000`.

## API Endpoints

### Mint NFT

- **URL:** `/api/mint`
- **Method:** `POST`
- **Request Body:**

    ```json
    {
      "metadata": {
        "name": "NFT Name",
        "symbol": "NFT Symbol",
        "uri": "Metadata URI",
        "royalty": 5,
        "attributes": "Attributes",
        "collection": "Collection",
        "creator": "Creator",
        "description": "Description",
        "image": "Image URL",
        "external_url": "External URL"
      }
    }
    ```

- **Response:**

    ```json
    {
      "message": "NFT Minted",
      "mintAddress": "Mint Public Key Address"
    }
    ```

## Development

### Adding Features

- **Staking and Fractionalization:** Implement additional logic for staking and fractionalization in the backend service as needed.
- **Error Handling:** Improve error handling and validation in both frontend and backend.

### Testing

- Ensure that both frontend and backend are properly tested on Solana’s devnet or testnet before deploying to the mainnet.

## Deployment

1. **Backend Deployment:** Deploy the backend service to a cloud provider like Heroku, AWS, or DigitalOcean.

2. **Frontend Deployment:** Deploy the Next.js application to Vercel or another hosting provider.

## Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature`).
3. Commit your changes (`git commit -am 'Add new feature'`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Create a new Pull Request.

## License

The MIT License - see the [LICENSE](LICENSE) file for details.

## Future Enhancements

- **Complete Staking and Fractionalization Logic:** Develop staking and fractionalization features according to project requirements.
- **UI/UX Improvements:** Enhance the frontend interface for a better user experience.
- **Optimizations:** Implement performance optimizations and caching for improved efficiency.
