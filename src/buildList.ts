import fs from "fs";
import path from "path";
import { TokenList } from "@uniswap/token-lists";
import { version as goosebumpsDefaultVersion } from "../lists/goosebumps-default.json";
import { version as goosebumpsExtendedVersion } from "../lists/goosebumps-extended.json";
import { version as goosebumpsTop15Version } from "../lists/goosebumps-top-15.json";
import { version as goosebumpsTop100Version } from "../lists/goosebumps-top-100.json";
import { version as coingeckoVersion } from "../lists/coingecko.json";
import { version as cmcVersion } from "../lists/cmc.json";
import { version as goosebumpsMiniVersion } from "../lists/goosebumps-mini.json";
import { version as goosebumpsMiniExtendedVersion } from "../lists/goosebumps-mini-extended.json";
import goosebumpsDefault from "./tokens/goosebumps-default.json";
import goosebumpsExtended from "./tokens/goosebumps-extended.json";
import goosebumpsTop100 from "./tokens/goosebumps-top-100.json";
import goosebumpsTop15 from "./tokens/goosebumps-top-15.json";
import coingecko from "./tokens/coingecko.json";
import cmc from "./tokens/cmc.json";
import goosebumpsMini from "./tokens/goosebumps-mini.json";
import goosebumpsMiniExtended from "./tokens/goosebumps-mini-extended.json";

export enum VersionBump {
  "major" = "major",
  "minor" = "minor",
  "patch" = "patch",
}

type Version = {
  major: number;
  minor: number;
  patch: number;
};

const lists = {
  "goosebumps-default": {
    list: goosebumpsDefault,
    name: "GooseBumps Default",
    keywords: ["goosebumps", "default"],
    logoURI: "https://goosebumps.finance/logo.png",
    sort: false,
    currentVersion: goosebumpsDefaultVersion,
  },
  "goosebumps-extended": {
    list: goosebumpsExtended,
    name: "GooseBumps Extended",
    keywords: ["goosebumps", "extended"],
    logoURI: "https://goosebumps.finance/logo.png",
    sort: true,
    currentVersion: goosebumpsExtendedVersion,
  },
  "goosebumps-top-100": {
    list: goosebumpsTop100,
    name: "GooseBumps Top 100",
    keywords: ["goosebumps", "top 100"],
    logoURI: "https://goosebumps.finance/logo.png",
    sort: true,
    currentVersion: goosebumpsTop100Version,
  },
  "goosebumps-top-15": {
    list: goosebumpsTop15,
    name: "GooseBumps Top 15",
    keywords: ["goosebumps", "top 15"],
    logoURI: "https://goosebumps.finance/logo.png",
    sort: true,
    currentVersion: goosebumpsTop15Version,
  },
  coingecko: {
    list: coingecko,
    name: "CoinGecko",
    keywords: ["defi"],
    logoURI:
      "https://www.coingecko.com/assets/thumbnail-007177f3eca19695592f0b8b0eabbdae282b54154e1be912285c9034ea6cbaf2.png",
    sort: true,
    currentVersion: coingeckoVersion,
  },
  cmc: {
    list: cmc,
    name: "CoinMarketCap",
    keywords: ["defi"],
    logoURI: "https://ipfs.io/ipfs/QmQAGtNJ2rSGpnP6dh6PPKNSmZL8RTZXmgFwgTdy5Nz5mx",
    sort: true,
    currentVersion: cmcVersion,
  },
  "goosebumps-mini": {
    list: goosebumpsMini,
    name: "GooseBumps Mini",
    keywords: ["goosebumps", "binance", "mini program", "mini"],
    logoURI: "https://goosebumps.finance/logo.png",
    sort: true,
    currentVersion: goosebumpsMiniVersion,
  },
  "goosebumps-mini-extended": {
    list: goosebumpsMiniExtended,
    name: "GooseBumps Mini Ext",
    keywords: ["goosebumps", "binance", "mini program", "mini", "extended"],
    logoURI: "https://goosebumps.finance/logo.png",
    sort: true,
    currentVersion: goosebumpsMiniExtendedVersion,
  },
};

const getNextVersion = (currentVersion: Version, versionBump?: VersionBump) => {
  const { major, minor, patch } = currentVersion;
  switch (versionBump) {
    case VersionBump.major:
      return { major: major + 1, minor, patch };
    case VersionBump.minor:
      return { major, minor: minor + 1, patch };
    case VersionBump.patch:
    default:
      return { major, minor, patch: patch + 1 };
  }
};

export const buildList = (listName: string, versionBump?: VersionBump): TokenList => {
  const { list, name, keywords, logoURI, sort, currentVersion } = lists[listName];
  const version = getNextVersion(currentVersion, versionBump);
  return {
    name,
    timestamp: new Date().toISOString(),
    version,
    logoURI,
    keywords,
    // sort them by symbol for easy readability (not applied to default list)
    tokens: sort
      ? list.sort((t1, t2) => {
          if (t1.chainId === t2.chainId) {
            // CAKE first in extended list
            if ((t1.symbol === "CAKE") !== (t2.symbol === "CAKE")) {
              return t1.symbol === "CAKE" ? -1 : 1;
            }
            return t1.symbol.toLowerCase() < t2.symbol.toLowerCase() ? -1 : 1;
          }
          return t1.chainId < t2.chainId ? -1 : 1;
        })
      : list,
  };
};

export const saveList = (tokenList: TokenList, listName: string): void => {
  const tokenListPath = `${path.resolve()}/lists/${listName}.json`;
  const stringifiedList = JSON.stringify(tokenList, null, 2);
  fs.writeFileSync(tokenListPath, stringifiedList);
  console.info("Token list saved to ", tokenListPath);
};
