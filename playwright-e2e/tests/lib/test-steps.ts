import _ from 'lodash';
import { BrowserContext, Download, expect, Locator, Page } from '@playwright/test';

import Input from 'lib/widget/Input';
import Select from 'lib/widget/select';
import { makeRandomTelephone } from 'utils/string-utils';
import { STATES } from 'data/constants';
import axios from 'axios';

/**
 * Download (fake) Consent form
 * @param context
 * @param locator
 */
export async function downloadConsentPdf(context: BrowserContext, locator: Locator): Promise<Download | void> {
  // Use axis to fetch pdf directly
  const downloadHref = await locator.getAttribute('href');
  expect(downloadHref).not.toBeNull();
  expect(downloadHref).toMatch(
    new RegExp(/https:\/\/storage\.googleapis\.com\/singular-(dev|staging)-assets\/consent_self.pdf/)
  );
  const response = await axios.get(downloadHref as string);
  const fileData = Buffer.from(response.data);
  expect(fileData && fileData.length).toBeTruthy();

  // Ensure new page opens when click on link
  await Promise.all([context.waitForEvent('page'), locator.click()]);
  expect(context.pages()).toHaveLength(2);
  const [, newPage] = context.pages();
  await newPage.close();
}

/**
 * Filling out address with fake data.
 * @param page
 * @param opts
 */
export async function enterMailingAddress(
  page: Page,
  opts: {
    fullName: string;
    country?: string;
    state?: string;
    street?: string;
    city?: string;
    zipCode?: string;
    telephone?: string | number;
  }
): Promise<void> {
  const {
    fullName,
    country = 'UNITED STATES',
    state = _.shuffle(STATES)[0],
    street = 'Broadway Street',
    city = 'Cambridge',
    zipCode = '01876',
    telephone = makeRandomTelephone()
  } = opts;

  const getFullName = (): Locator => {
    return new Input(page, { label: 'Full Name' }).toLocator();
  };

  const getStreet = (): Locator => {
    return new Input(page, { label: 'Street Address' }).toLocator();
  };

  const getCountry = (): Select => {
    return new Select(page, { label: 'Country' });
  };

  const getState = (): Select => {
    return new Select(page, { label: 'State' });
  };

  const getCity = (): Locator => {
    return new Input(page, { label: 'City' }).toLocator();
  };

  const getZipCode = (): Locator => {
    return new Input(page, { label: 'Zip Code' }).toLocator();
  };

  const getTelephone = (): Locator => {
    return new Input(page, { label: 'Telephone Contact Number' }).toLocator();
  };

  // Fill out address fields
  await getFullName().fill(fullName);
  await getCountry().selectOption(country.toUpperCase());
  await getStreet().fill(street.toUpperCase());
  await getCity().fill(city.toUpperCase());
  await getState().selectOption(state.toUpperCase());
  await getZipCode().fill(zipCode);
  await getTelephone().fill(telephone.toString());
}
