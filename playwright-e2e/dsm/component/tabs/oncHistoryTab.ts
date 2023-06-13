import {expect, Locator, Page} from '@playwright/test';

export default class OncHistoryTab {
    constructor(private readonly page: Page) {}

    /**
     * This tab collects information such as the participant's diagnosis, where and when diagnosis was acquired,
     * and whether further information from the listed facility has been requested for, received, etc.
     * Note: The day that information is first inputted into this tab for a participant is automatically used as the Onc History Created Date
     */
}
