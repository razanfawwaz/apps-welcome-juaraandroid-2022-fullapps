const devGoogleUrl =
  "https://developers.google.com/profile/u/114689305090957800631";

// devgoogle.ts
import chromium from "chrome-aws-lambda";
import puppeteer from "puppeteer-core";

import {
  fetchProfileName,
  fetchNodeList,
  filterBadge,
  calculateTiers,
} from "./src/lib/utils/validator-devgoogle.js";

const fetchDataAsJson = async (devGoogleUrl) => {
  const browser = await puppeteer.launch({
    args: chromium.args,
    executablePath:
      process.env.CHROME_EXECUTABLE_PATH || (await chromium.executablePath),
    headless: true,
  });

  const page = await browser.newPage();
  await page.goto(devGoogleUrl);

  const profileName = await fetchProfileName(page);
  const nodeList = await fetchNodeList(page);
  const validBadges = await filterBadge(nodeList);

  const tiers = calculateTiers(validBadges);

  // Finalize all
  await browser.close();

  return {
    profileName: profileName,
    tiers,
    validBadges: validBadges.length,
    detailValidBadges: validBadges,
  };
};
// end of devgoogle.ts

console.log(await fetchDataAsJson(devGoogleUrl));