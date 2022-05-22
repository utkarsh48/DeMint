require('dotenv').config();
const key = process.env.REACT_APP_PINATA_KEY;
const secret = process.env.REACT_APP_PINATA_SECRET;
const axios = require('axios');

export const pinToIPFS = async(requestData, isFile) => {
    const url = isFile ? `https://api.pinata.cloud/pinning/pinFileToIPFS` : `https://api.pinata.cloud/pinning/pinJSONToIPFS`;
    return axios
        .post(url, requestData, {
            headers: {
                pinata_api_key: key,
                pinata_secret_api_key: secret,
            }
        })
        .then(function (response) {
            if (response.data.isDuplicate) return {
                success: false,
                duplicate: true,
            }
            return {
                success: true,
                pinataUrl: "https://gateway.pinata.cloud/ipfs/" + response.data.IpfsHash
            };
        })
        .catch(function (error) {
            console.log(error)
            return {
                success: false,
                message: error.message,
            }
           
        });
};

export const createFormData = (file, jsonMetaData) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('pinataMetadata', JSON.stringify(jsonMetaData));
    return formData;
};

export const createJSONData = (data) => {
    const {name, description, asset} = data;
    return {name, description, asset, pinataMetadata: {name, description}, pinataContent: data};
};
