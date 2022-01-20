declare const $;
declare const config: Record<string, any>;

interface Language {
  code: string;
  name: string;
}

export class Translator {
  languages: Language[];
  currentLangCode: string;
  currentDictionary: Record<string, any>;

  constructor(private baseUrl: string) {}

  static create(baseUrl: string): Translator {
    const translator = new Translator(baseUrl);
    translator.loadLanguages();

    return translator;
  }

  loadLanguages(): void {
    $.getJSON(`${this.baseUrl}/languages.json`, (languages: Language[]) => {
      this.languages = languages;
      this.populateLanguagesDropdown();
      this.checkLangPreferences();
    });
  }

  changeLanguage(langCode: string): void {
    console.log(`Changing language to ${langCode}`);

    this.currentLangCode = langCode;
    window.localStorage.setItem('lang', langCode);

    $.getJSON(
      `${this.baseUrl}/auth-${langCode}.json`,
      (dictionary: Record<string, any>) => {
        this.currentDictionary = dictionary;
        this.translateElements();
      }
    );
  }

  private populateLanguagesDropdown(): void {
    const languagesContainer = $('.languages');
    let content = '';

    this.languages.forEach(
      language =>
        (content += `
      <li>
        <a
          href="#"
          class="green-hover change-language"
          data-language="${language.code.split('-')[0]}"
        >${language.name}</a>
      </li>
    `)
    );

    languagesContainer.empty();
    languagesContainer.append(content);
  }

  private checkLangPreferences(): void {
    $(document).ready(() => {
      const langCode = window.localStorage.getItem('lang');

      if (langCode) {
        console.log(`Initialized language as "${langCode}" from local storage`);

        return this.changeLanguage(langCode);
      }

      if (config && config.extraParams && config.extraParams.language) {
        const langCodeFromConfig = config.extraParams.language;

        console.log(`Initialized language as "${langCodeFromConfig}" from config`);

        return this.changeLanguage(langCodeFromConfig);
      }

      console.log('Initializing default "en" language');

      this.changeLanguage('en');
    });
  }

  private translateElements(): void {
    const lang = this.languages.find(
      language => language.code === this.currentLangCode
    );

    if (lang) {
      $('#current-language').text(lang.name);
    }

    $('[data-translate]').each((_: number, el: any) => {
      const $el = $(el);
      const key = $el.data('translate');
      let text = '';

      if (key.indexOf('.') !== -1) {
        const pathKeys = key.split('.');

        try {
          text = pathKeys.reduce(
            (prev, curr) => prev[curr],
            this.currentDictionary
          );
        } catch (e) {
          console.log(e);
        }
      } else {
        text = this.currentDictionary[key];
      }

      $el.text(text);
    });
  }
}
