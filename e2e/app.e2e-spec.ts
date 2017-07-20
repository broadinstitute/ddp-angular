import { CmiPage } from './app.po';

describe('cmi App', () => {
  let page: CmiPage;

  beforeEach(() => {
    page = new CmiPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
