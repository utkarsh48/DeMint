import axios from 'axios';
import abiDecoder from 'abi-decoder';

const eScanApiKey = process.env.REACT_APP_ETHERSCAN_API_KEY;
const contractABI = require("../contract-abi.json");

const reqParams = {
  module: 'account',
  action: 'txlist',
  page: 1, // will be managed later
  offset: 100,
  startblock: 0,
  endblock: 99999999,
  sort: 'desc',
  apikey: eScanApiKey,
};

export const getTransactionsOf = (walletAddress) => {
  return axios
    .get('https://api-ropsten.etherscan.io/api', {params: {
      ...reqParams,
      address: walletAddress,
    }})
    .then((data) => {
      console.log(data);
      return data;
    })
    .catch((err) => console.log(err));
};

export const decodeTransaction = (input) => {
  abiDecoder.addABI(contractABI);
  return abiDecoder.decodeMethod(input);
}
