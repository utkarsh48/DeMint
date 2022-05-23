import {
  NO_WALLET,
  CONNECTED,
  NOT_CONNECTED,
  WLT_ERROR,
  INCOMPLETE,
  FAILED,
  SUCCESS,
  DUPLICATE,
} from "../constants/status";
import { createFormData, createJSONData, pinToIPFS } from "./pinata.js";
require("dotenv").config();
const alchemyKey = process.env.REACT_APP_ALCHEMY_KEY;
const contractABI = require("../contract-abi.json");
const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(alchemyKey);

export const getWallet = async (current) => {
  if (window.ethereum) {
    try {
      const addressArray = await window.ethereum.request({
        method:
          current && current.connected ? "eth_accounts" : "eth_requestAccounts",
      });
      if (addressArray.length > 0) {
        return {
          address: addressArray[0],
          status: CONNECTED,
          link: "",
        };
      } else {
        return {
          address: "",
          status: NOT_CONNECTED,
          link: "",
        };
      }
    } catch (err) {
      return {
        address: "",
        status: WLT_ERROR,
        link: "",
      };
    }
  } else {
    return {
      address: "",
      status: NO_WALLET,
      link: "",
    };
  }
};

async function loadContract() {
  return new web3.eth.Contract(contractABI, contractAddress);
}

export const mintNFT = async (data, isFile) => {
  const { asset, name, description } = data;
  let requestData, responseData;

  const errors = {
    incomplete: {
      success: false,
      status: INCOMPLETE,
      link: "",
    },
    failed: {
      success: false,
      status: FAILED,
      link: "",
    },
    txError: {
      success: false,
      status: WLT_ERROR,
      link: "",
    },
    duplicate: {
      success: false,
      status: DUPLICATE,
      link: "",
    },
  };

  //make metadata
  if (name.trim() !== "" || description.trim() !== "" || !asset) {
    if (isFile && asset) {
      requestData = createFormData(asset, {
        name: `${name}_file_${asset.name || ""}`,
        description,
      });
    } else if (asset.trim() !== "") {
      requestData = createJSONData({ name, description, asset });
    } else return errors.incomplete;
    responseData = await pinToIPFS(requestData, isFile);
  } else return errors.incomplete;

  if (!responseData.success) {
    if (responseData.duplicate) return errors.duplicate;
    return errors.failed;
  }

  const tokenURI = responseData.pinataUrl;

  if (isFile) {
    return mintNFT({ name, description, asset: tokenURI });
  }

  window.contract = await new web3.eth.Contract(contractABI, contractAddress);

  const transactionParameters = {
    to: contractAddress, // Required except during contract publications.
    from: window.ethereum.selectedAddress, // must match user's active address.
    data: window.contract.methods
      .mintNFT(window.ethereum.selectedAddress, tokenURI)
      .encodeABI(),
  };

  try {
    const txHash = await window.ethereum.request({
      method: "eth_sendTransaction",
      params: [transactionParameters],
    });
    return {
      success: true,
      status:
        SUCCESS +
        ": Transaction sent to network. It may take some time to process.",
      link: "https://ropsten.etherscan.io/tx/" + txHash,
    };
  } catch (error) {
    return errors.txError;
  }
};
