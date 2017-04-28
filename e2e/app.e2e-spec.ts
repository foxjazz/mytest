import { MytryPage } from './app.po';

describe('mytry App', () => {
  let page: MytryPage;

  beforeEach(() => {
    page = new MytryPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
