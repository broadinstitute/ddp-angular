import { PlaywrightTestConfig } from "@playwright/test";
import testConfig from "playwright.config";

const pancanConfig: PlaywrightTestConfig = {
    ...testConfig,
    testDir: './'
  };

  export default pancanConfig;