/* eslint-disable no-extend-native */
import PartialConstants from "../constants/partial.constants";
import { v4 as uuidv4 } from "uuid";

import invariant from "tiny-invariant";
import warning from "tiny-warning";
import JSBI from "jsbi";
import { getAddress, isAddress } from "@ethersproject/address";

import {
  ZERO,
  ONE,
  TWO,
  THREE,
  SolidityType,
  SOLIDITY_TYPE_MAXIMA,
} from "../constants/swap.constants";

import { find } from "lodash";
import { ERC20_ABI } from "../abis/ERC20";

var CryptoJS = require("crypto-js");

export function truncate(str, maxDecimalDigits) {
  if (/^\d+\.?\d*$/.test(str) === false) {
    return str;
  }

  if (str.includes(".")) {
    const parts = str.split(".");
    return parts[0] + "." + parts[1].slice(0, maxDecimalDigits);
  }

  return str;
}

export function checkLengthDecimalPoint(valueStr, digits) {
  const stringArr = valueStr.toString().split(".");
  if (stringArr[1] && stringArr[1].length >= digits) {
    return true;
  }
  return false;
}

export function fixedBalanceEtherZero(valueStr) {
  const stringArr = valueStr.toString().split(".");
  if (stringArr[1] === "0") {
    return stringArr[0];
  }
  return valueStr;
}

export function formatLocaleString(x, digits, isFixed) {
  if (isFixed && checkLengthDecimalPoint(x, digits)) {
    x = Number(x).toFixed(digits);
  }
  return x.toLocaleString("en-IN", {
    currency: "USD",
    maximumSignificantDigits: digits || 10,
  });
}

export function formatBalanceString(x) {
  return Number(x).toLocaleString();
}

export function numberWithCommas(num) {
  num = num.toLocaleString("en-IN", { maximumSignificantDigits: 10 });
  let x = num.toString().split(".");
  x[0] = x[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return x.join(".");
}

String.prototype.isMatch = function (pattern) {
  return pattern.test(this);
};
/**
 * This function is used to compare ignore cases of string.
 * @param {otherString} otherString is the string that need to be compared with this string
 * @returns true if the string is equal, false if it's not.
 */
String.prototype.equals = function (otherString) {
  return this.toLowerCase() === otherString?.toString().toLowerCase();
};

export const getDeadline = () => Math.round(new Date().getTime() / 1000) + 3600;

export const getTimeStamp = () => new Date().getTime().toString();

export function formatUriSecure(url) {
  const currentDate = new Date();
  const secureKey = process.env.REACT_APP_SECURE_KEY;
  const secureTime = process.env.REACT_APP_SECURE_TIME;

  let expireTime = currentDate.getTime() / 1000 + Number(secureTime);
  expireTime = Math.round(expireTime);

  let secure_link = `${secureKey}${expireTime}${url}`;
  secure_link = CryptoJS.MD5(secure_link, "binary").toString(
    CryptoJS.enc.Base64
  );
  secure_link = secure_link.replaceAll("+", "-");
  secure_link = secure_link.replaceAll("/", "_");
  secure_link = secure_link.replace(/=/g, "");

  return url + `?st=${secure_link}&e=${expireTime}`;
}

export function nFormatter(num, digits = 8) {
  var si = [
    { value: 1, symbol: "" },
    { value: 1e3, symbol: "k" },
    { value: 1e6, symbol: "M" },
    { value: 1e9, symbol: "G" },
    { value: 1e12, symbol: "T" },
    { value: 1e15, symbol: "P" },
    { value: 1e18, symbol: "E" },
  ];
  var rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  var i;
  for (i = si.length - 1; i > 0; i--) {
    if (num >= si[i].value) {
      break;
    }
  }
  return (num / si[i].value).toFixed(digits).replace(rx, "$1") + si[i].symbol;
}

export const isContainVET = (...ags) =>
  [...ags].includes(process.env.REACT_APP_TOKEN_WVET);

/**
 * Get the decimal number of the given asset tokens
 * @param {assetsAddress} assetsAddress is the address of the asset that we need to get the decimal value from
 * @returns the corresponding decimal value of the asset that
 */
export const getDecimalForAsset = (assetsAddress) =>
  assetsAddress.toLocaleUpperCase() ===
  process.env.REACT_APP_TOKEN_VEUSD.toLocaleUpperCase()
    ? PartialConstants.VEUSD_DECIMAL
    : PartialConstants.DEFAULT_ASSET_DECIMAL;

export const typeOf = (value) => Object.prototype.toString.call(value);

export const getWeiUnitByDecimal = (decimal) => {
  switch (decimal) {
    case 6:
      return "mwei";
    case 12:
      return "micro";
    case 18:
      return "ether";
    default:
      return "";
  }
};

export const getAmountInWeiFormatted = (web3, amount, decimalNumber) => {
  if (!web3) throw new Error("Web3 is required");
  else if (!amount || amount === 0 || amount === 0.0)
    throw new Error("Amount is required");
  else if (!decimalNumber) throw new Error("DecimalNumber is required");

  if (decimalNumber < PartialConstants.DEFAULT_ASSET_DECIMAL)
    amount = Number(amount).toFixed(decimalNumber);

  return web3?.utils.toWei(
    amount.toString(),
    getWeiUnitByDecimal(decimalNumber)
  );
};

export const getDecimalForAssetPair = (firstAssetAddress, secondAssetAddress) =>
  [firstAssetAddress, secondAssetAddress].includes(
    process.env.REACT_APP_TOKEN_VEUSD
  )
    ? PartialConstants.LIQUIDITY_PAIR_CONTAIN_VET_DECIMAL
    : PartialConstants.DEFAULT_ASSET_DECIMAL;

export async function copyTextToClipboard(text) {
  if ("clipboard" in navigator) {
    return await navigator.clipboard.writeText(text);
  } else {
    return document.execCommand("copy", true, text);
  }
}

export const randomKeyUUID = () => {
  return uuidv4();
};

export const addressWalletCompact = (address) => {
  return `${address.slice(0, 6)}...${address.slice(
    address.length - 4,
    address.length
  )}`;
};
export const compareString = (a, b) => {
  return a?.toString().toLowerCase() === b?.toString().toLowerCase();
};

export const checkCharacterZero = (input) => {
  const stringArr = input.toString().split("");
  for (let i = 0; i < stringArr.length; i++) {
    if (stringArr[i] !== "0") {
      if (stringArr[i] !== ".") {
        return false;
      }
    }
  }
  return true;
};

export const checkLengthDecimal = (input, address) => {
  const stringArr = input.toString().split(".");
  if (stringArr && stringArr.length > 1) {
    const isVeusd =
      getDecimalForAsset(address) === PartialConstants.VEUSD_DECIMAL;
    if (stringArr[1].length > (isVeusd ? 6 : 18)) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
};

export const formatInputDecimal = (input, address) => {
  const stringArr = input.toString().split(".");
  if (stringArr && stringArr.length > 1) {
    const isVeusd =
      getDecimalForAsset(address) === PartialConstants.VEUSD_DECIMAL;
    if (stringArr[1].length > (isVeusd ? 6 : 18)) {
      return Number(input).toFixed(isVeusd ? 6 : 18);
    } else {
      return input.toString();
    }
  } else {
    return input.toString();
  }
};

export function toFixedLargeNumber(x) {
  if (Math.abs(x) < 1.0) {
    var e = parseInt(x.toString().split("e-")[1]);
    if (e) {
      x *= Math.pow(10, e - 1);
      x = "0." + new Array(e).join("0") + x.toString().substring(2);
    }
  } else {
    var _e = parseInt(x.toString().split("+")[1]);
    if (_e > 20) {
      _e -= 20;
      x /= Math.pow(10, _e);
      x += new Array(_e + 1).join("0");
    }
  }
  return x;
}

export const checkDotEndText = (input) => {
  if (!input) {
    return false;
  }
  const inputArray = input.toString().split("");
  if (inputArray && inputArray.length > 1) {
    if (inputArray.at(-1) === ".") {
      return true;
    }
  }
  return false;
};

export function format_number(number, meaning_length) {
  if (Number.isInteger(number)) {
    number = number.toFixed(2);
  }

  let _parse_str = String(number);
  let _split_items = _parse_str.split(".");

  if (_split_items[0].length > meaning_length) {
    _split_items[0] =
      parseInt(_split_items[0]) -
      0.5 * Math.pow(10, _split_items[0].length - meaning_length);
  } else {
    let rest_meaning_length;
    if (meaning_length === _split_items[0].length) {
      rest_meaning_length = 0;
    } else {
      rest_meaning_length = meaning_length - _split_items[0].length;
    }
    console.log(rest_meaning_length);
    _split_items[1] =
      parseInt(_split_items[1]) -
      0.5 * Math.pow(10, _split_items[1].length - rest_meaning_length);
  }
  return parseFloat(_split_items[0] + "." + _split_items[1]);
}

export function validateSolidityTypeInstance(value, solidityType) {
  invariant(
    JSBI.greaterThanOrEqual(value, ZERO),
    `${value} is not a ${solidityType}.`
  );
  invariant(
    JSBI.lessThanOrEqual(value, SOLIDITY_TYPE_MAXIMA[solidityType]),
    `${value} is not a ${solidityType}.`
  );
}

// warns if addresses are not checksummed
export function validateAndParseAddress(address) {
  try {
    const checkSummedAddress = getAddress(address);
    warning(address === checkSummedAddress, `${address} is not checksummed.`);
    return checkSummedAddress;
  } catch (error) {
    invariant(false, `${address} is not a valid address.`);
  }
}

export function parseBigintIsh(bigintIsh) {
  return bigintIsh instanceof JSBI
    ? bigintIsh
    : typeof bigintIsh === "bigint"
    ? JSBI.BigInt(bigintIsh.toString())
    : JSBI.BigInt(bigintIsh);
}

// mock the on-chain sqrt function
export function sqrt(y) {
  validateSolidityTypeInstance(y, SolidityType.uint256);
  let z = ZERO;
  let x;
  if (JSBI.greaterThan(y, THREE)) {
    z = y;
    x = JSBI.add(JSBI.divide(y, TWO), ONE);
    while (JSBI.lessThan(x, z)) {
      z = x;
      x = JSBI.divide(JSBI.add(JSBI.divide(y, x), x), TWO);
    }
  } else if (JSBI.notEqual(y, ZERO)) {
    z = ONE;
  }
  return z;
}

// given an array of items sorted by `comparator`, insert an item into its sort index and constrain the size to
// `maxSize` by removing the last item
export function sortedInsert(items, add, maxSize, comparator) {
  invariant(maxSize > 0, "MAX_SIZE_ZERO");
  // this is an invariant because the interface cannot return multiple removed items if items.length exceeds maxSize
  invariant(items.length <= maxSize, "ITEMS_SIZE");

  // short circuit first item add
  if (items.length === 0) {
    items.push(add);
    return null;
  } else {
    const isFull = items.length === maxSize;
    // short circuit if full and the additional item does not come before the last item
    if (isFull && comparator(items[items.length - 1], add) <= 0) {
      return add;
    }

    let lo = 0,
      hi = items.length;

    while (lo < hi) {
      const mid = (lo + hi) >>> 1;
      if (comparator(items[mid], add) <= 0) {
        lo = mid + 1;
      } else {
        hi = mid;
      }
    }
    items.splice(lo, 0, add);
    return isFull ? items.pop() : null;
  }
}

// get token name
export async function getTokenName(tokenAddress, library) {
  if (!isAddress(tokenAddress)) {
    throw Error(`Invalid 'tokenAddress' parameter '${tokenAddress}'.`);
  }

  const abi = find(ERC20_ABI, { name: "name" });
  const method = library.thor.account(tokenAddress).method(abi);

  return method
    .call()
    .then(({ decoded }) => decoded[0])
    .catch((error) => {
      error.code = 100;
      throw error;
    });
}

// get token symbol
export async function getTokenSymbol(tokenAddress, library) {
  if (!isAddress(tokenAddress)) {
    throw Error(`Invalid 'tokenAddress' parameter '${tokenAddress}'.`);
  }

  const abi = find(ERC20_ABI, { name: "symbol" });
  const method = library.thor.account(tokenAddress).method(abi);

  return method
    .call()
    .then(({ decoded }) => decoded[0])
    .catch((error) => {
      error.code = 101;
      throw error;
    });
}

// get token decimals
export async function getTokenDecimals(tokenAddress, library) {
  if (!isAddress(tokenAddress)) {
    throw Error(`Invalid 'tokenAddress' parameter '${tokenAddress}'.`);
  }

  const abi = find(ERC20_ABI, { name: "decimals" });
  const method = library.thor.account(tokenAddress).method(abi);

  return method
    .call()
    .then(({ decoded }) => Number(decoded[0]))
    .catch((error) => {
      error.code = 102;
      throw error;
    });
}


export function timeSinceAgo(date) {

  var seconds = Math.floor((new Date() - date) / 1000);

  var interval = seconds / 31536000;

  if (interval > 1) {
    return Math.floor(interval) + " years";
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return Math.floor(interval) + " months";
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + " days";
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + " hours";
  }
  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + " min";
  }
  return Math.floor(seconds) + " sec";
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];


function getFormattedDate(date, prefomattedDate = false, hideYear = false) {
  const day = date.getDate();
  const month = MONTH_NAMES[date.getMonth()];
  const year = date.getFullYear();
  const hours = date.getHours();
  let minutes = date.getMinutes();

  if (minutes < 10) {
    // Adding leading zero to minutes
    minutes = `0${ minutes }`;
  }

  if (prefomattedDate) {
    // Today at 10:20
    // Yesterday at 10:20
    return `${ prefomattedDate } at ${ hours }:${ minutes }`;
  }

  if (hideYear) {
    // 10. January at 10:20
    return `${ day }. ${ month } at ${ hours }:${ minutes }`;
  }

  // 10. January 2017. at 10:20
  return `${ day }. ${ month } ${ year }. at ${ hours }:${ minutes }`;
}


// --- Main function
function timeAgo(dateParam) {
  if (!dateParam) {
    return null;
  }

  const date = typeof dateParam === 'object' ? dateParam : new Date(dateParam);
  const DAY_IN_MS = 86400000; // 24 * 60 * 60 * 1000
  const today = new Date();
  const yesterday = new Date(today - DAY_IN_MS);
  const seconds = Math.round((today - date) / 1000);
  const minutes = Math.round(seconds / 60);
  const isToday = today.toDateString() === date.toDateString();
  const isYesterday = yesterday.toDateString() === date.toDateString();
  const isThisYear = today.getFullYear() === date.getFullYear();


  if (seconds < 5) {
    return 'now';
  } else if (seconds < 60) {
    return `${ seconds } seconds ago`;
  } else if (seconds < 90) {
    return 'about a minute ago';
  } else if (minutes < 60) {
    return `${ minutes } minutes ago`;
  } else if (isToday) {
    return getFormattedDate(date, 'Today'); // Today at 10:20
  } else if (isYesterday) {
    return getFormattedDate(date, 'Yesterday'); // Yesterday at 10:20
  } else if (isThisYear) {
    return getFormattedDate(date, false, true); // 10. January at 10:20
  }

  return getFormattedDate(date); // 10. January 2017. at 10:20
}