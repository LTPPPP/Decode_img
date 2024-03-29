
let dataURI;
let again = false;
//info
const ABI = [
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "identifier",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "uri",
                "type": "string"
            }
        ],
        "name": "URIUpdated",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "identifier",
                "type": "uint256"
            }
        ],
        "name": "getURI",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "identifier",
                "type": "uint256"
            },
            {
                "internalType": "string",
                "name": "uri",
                "type": "string"
            }
        ],
        "name": "setURI",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "uris",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];

const Address = "0xD7ACd2a9FD159E69Bb102A1ca21C9a3e3A5F771B";

// Function to create an image and encode it into a URI
function createimg() {
    if (!again) {
        const image = new Image();
        // const canvas = document.createElement('canvas');
        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');

        // Set canvas dimensions
        canvas.width = 100; // Set your desired width
        canvas.height = 100; // Set your desired height

        // Draw something on the canvas (for demonstration)
        // Loop through each pixel and set a random color
        for (let y = 0; y < canvas.height; y++) {
            for (let x = 0; x < canvas.width; x++) {
                const red = Math.floor(Math.random() * 256); // Generate random red value (0-255)
                const green = Math.floor(Math.random() * 256); // Generate random green value
                const blue = Math.floor(Math.random() * 256); // Generate random blue value
                const alpha = 1.0; // Set opacity to fully opaque
                ctx.fillStyle = `rgba(${red}, ${green}, ${blue}, ${alpha})`;
                ctx.fillRect(x, y, 1, 1); // Draw a single pixel at (x, y)
            }
        }

        // Convert canvas to data URI
        dataURI = canvas.toDataURL('image/png').substring(22); // Use PNG format for NFTs
        document.body.append(canvas);
        again = true;
        //show store uri
        let storeURI = document.getElementById('storeUri').style.display = 'inline';
        console.log(dataURI);
        // appendToFile("URI.txt", dataURI);
    }
}
//1- connect metamask
let account;
const connectMetamask = async () => {
    if (window.ethereum !== "undefined") {
        const accounts = await ethereum.request({ method: "eth_requestAccounts" });
        account = accounts[0];
        document.getElementById("accountArea").innerHTML = account;
    }
}

//2- connect to smart contract
const connectContract = async () => {
    document.getElementById("contractArea").innerHTML = "connected to smart contract";
}
//3-read data from smart contract
const readContract = async () => {
    if (!dataURI) {
        console.error("There are no images to store!");
        alert("There are no images to store");
        return;
    }
    const web3Provider = window.ethereum; // Assuming using MetaMask
    if (!web3Provider) {
        throw new Error("Please sign in with a Web3 provider like MetaMask!");
    }

    const web3 = new Web3(web3Provider);

    // Create a contract instance
    const contract = new web3.eth.Contract(ABI, Address);

    // Unlock user wallet (request user permission)
    const accounts = await web3.eth.requestAccounts();

    const signer = accounts[0];


    // Call the setURI function with the new URI
    const setURI = async (identifier, uri) => {
        await contract.methods.setURI(identifier, uri).send({
            from: signer,
            gas: 100000 // Adjust gas limit as needed
        });
        console.log("URI stored in the contract!");
    };
    // Call the getURI function
    const getURI = async (identifier) => {

        //Check the duplicate
        const existingURI = await getURI(0); // Check for identifier 0 (modify as needed)
        if (existingURI === dataURI) {
            console.log("Duplicate URI detected. Skipping write.");
            createimg();
            return;
        }
        const uri = await contract.methods.getURI(identifier).call();
        console.log('URI for identifier', identifier, ':', uri);
    };

    await setURI(0, dataURI); // Set URI with identifier 0
    await getURI(0); // Retrieve URI with identifier 0

};

// function appendToFile(filePath, data) {
//     writeFile(filePath, data, (err) => {
//         if (err) {
//             console.error('Error writing to file:', err);
//         } else {
//             console.log('Data appended successfully!');
//         }
//     });
// }
