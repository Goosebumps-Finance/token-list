import fs from "fs";
import path from "path";
import { getAddress } from "@ethersproject/address";
import pancakeswapDefault from "./tokens/goosebumps-default.json";
import pancakeswapExtended from "./tokens/goosebumps-extended.json";
import pancakeswapTop100 from "./tokens/goosebumps-top-100.json";
import pancakeswapTop15 from "./tokens/goosebumps-top-15.json";
import coingecko from "./tokens/coingecko.json";
import cmc from "./tokens/cmc.json";
import pancakeswapMini from "./tokens/goosebumps-mini.json";
import pancakeswapMiniExtended from "./tokens/goosebumps-mini-extended.json";

const lists = {
  "goosebumps-default": pancakeswapDefault,
  "goosebumps-extended": pancakeswapExtended,
  "goosebumps-top-100": pancakeswapTop100,
  "goosebumps-top-15": pancakeswapTop15,
  coingecko,
  cmc,
  "goosebumps-mini": pancakeswapMini,
  "goosebumps-mini-extended": pancakeswapMiniExtended,
};

const checksumAddresses = (listName: string): void => {
  let badChecksumCount = 0;
  const listToChecksum = lists[listName];
  const updatedList = listToChecksum.reduce((tokenList, token) => {
    const checksummedAddress = getAddress(token.address);
    if (checksummedAddress !== token.address) {
      badChecksumCount += 1;
      const updatedToken = { ...token, address: checksummedAddress };
      return [...tokenList, updatedToken];
    }
    return [...tokenList, token];
  }, []);

  if (badChecksumCount > 0) {
    console.info(`Found and fixed ${badChecksumCount} non-checksummed addreses`);
    const tokenListPath = `${path.resolve()}/src/tokens/${listName}.json`;
    console.info("Saving updated list to ", tokenListPath);
    const stringifiedList = JSON.stringify(updatedList, null, 2);
    fs.writeFileSync(tokenListPath, stringifiedList);
    console.info("Checksumming done!");
  } else {
    console.info("All addresses are already checksummed");
  }
};

export default checksumAddresses;
