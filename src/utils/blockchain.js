import toast from 'react-hot-toast';

// SIMULATED Wallet Connection (Always succeeds)
export const connectWallet = async () => {
    // We just return a fake signer object to satisfy any checks
    return { address: "0xSimulatedWalletAddress12345" };
};

// SIMULATED Blockchain Record
export const recordSkillOnChain = async (project) => {
    const tid = toast.loading("Connecting to Polygon Network...");

    return new Promise((resolve) => {
        // 1. Simulate Network Delay (2 seconds)
        setTimeout(() => {

            // 2. Generate a FAKE Transaction Hash
            // This creates a random string like "0x7f9a2..."
            const randomHex = [...Array(64)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
            const mockHash = `0x${randomHex}`;

            toast.success("Minted Successfully! (Simulated)", { id: tid });

            // 3. Return the fake hash to the app
            resolve(mockHash);

        }, 2000);
    });
};