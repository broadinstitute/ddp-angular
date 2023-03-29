import {expect, test} from '@playwright/test';
import {login} from 'authentication/auth-dsm';
import {Study} from 'lib/component/dsm/navigation/enums/selectStudyNav.enum';
import {Navigation} from 'lib/component/dsm/navigation/navigation';
import Table, {SortOrder} from 'lib/component/table';
import {WelcomePage} from 'pages/dsm/welcome-page';


test('DSM.... @visual @enrollment @rgp',
    async ({ page }) => {
      await login(page);

      const welcomePage = new WelcomePage(page);
      await welcomePage.selectStudy(Study.RGP);

      const navigation = new Navigation(page);
      await navigation.selectMiscellaneous('Mailing List');



      const table = new Table(page, {cssClassAttribute:'.table'});
      await table.waitForReady()

          await table.sort('Date signed up', SortOrder.DESC);

      await expect(await table.findCell('Email', 'ungwudik+514875539@broad.dev', 'Email')).toBeTruthy();

      const datecolumn = await table.findCell('Email', 'ungwudik+514875539@broad.dev', 'Date signed up', { exactMatch: false });
      console.log( await datecolumn?.innerText())
    });
