import fs from "fs";
import path from "path";
import { getAddress } from "@ethersproject/address";
import goosebumpsDefault from "./tokens/goosebumps-default.json";
import goosebumpsExtended from "./tokens/goosebumps-extended.json";
import goosebumpsTop100 from "./tokens/goosebumps-top-100.json";
import goosebumpsTop15 from "./tokens/goosebumps-top-15.json";
import coingecko from "./tokens/coingecko.json";
import cmc from "./tokens/cmc.json";
import goosebumpsMini from "./tokens/goosebumps-mini.json";
import goosebumpsMiniExtended from "./tokens/goosebumps-mini-extended.json";

const lists = {
  "goosebumps-default": goosebumpsDefault,
  "goosebumps-extended": goosebumpsExtended,
  "goosebumps-top-100": goosebumpsTop100,
  "goosebumps-top-15": goosebumpsTop15,
  coingecko,
  cmc,
  "goosebumps-mini": goosebumpsMini,
  "goosebumps-mini-extended": goosebumpsMiniExtended,
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
