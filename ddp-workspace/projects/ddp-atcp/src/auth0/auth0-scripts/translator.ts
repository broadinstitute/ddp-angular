declare const $;
declare const config: Record<string, any>;

interface Language {
  code: string;
  name: string;
}

// let languagesList: Language[];

// const onTranslate = (dictionary: Record<string, any>, langCode: string) => {
//   const selectedLang = languagesList.find(lang => lang.code === langCode);

//   if (selectedLang) {
//     $('#current-language').text(selectedLang.name);
//   }

//   $('[data-translate]').each((i, el) => {
//     const $el = $(el);
//     const key = $el.data('translate');
//     let text = '';
//     if (key.indexOf('.') !== -1) {
//       const pathKeys = key.split('.');
//       try {
//         text = pathKeys.reduce((prev, curr) => prev[curr], dictionary);
//       } catch (e) {
//         console.log(e);
//       }
//     } else {
//       text = dictionary[key];
//     }
//     $el.text(text);
//   });
// };

// const onChange = (
//   baseUrl: string,
//   language: string,
//   cb: (list: any[]) => void
// ) => {
//   $.getJSON(baseUrl + '/auth-' + language + '.json', data => {
//     onTranslate(data, language);
//     cb(data);
//   });
// };

// const loadLanguagesList = (baseUrl: string, cb: () => void) => {
//   $.getJSON(baseUrl + '/languages.json', (languages: Language[]) => {
//     languagesList = languages;

//     const $container = $('.languages');
//     let items = '';
//     languages.forEach(item => {
//       items +=
//         '<li><a class="green-hover change-language" href="#" data-language="' +
//         item.code.split('-')[0] +
//         '">' +
//         item.name +
//         '</a></li>';
//     });
//     $container.empty();
//     $container.append(items);
//   });
// };

// export const translatorCreator = (url: string, cb: (dictionary) => void) => {
//   // loadLanguagesList(url);
//   return {
//     changeTranslate: (language: string) => {
//       window.localStorage.setItem('lang', language);
//       onChange(url, language, cb);
//     },
//   };
// };

export class Translator {
  languages: Language[];
  currentLangCode: string;
  currentDictionary: Record<string, any>;

  constructor(private baseUrl: string) {}

  loadLanguages(): void {
    $.getJSON(`${this.baseUrl}/languages.json`, (languages: Language[]) => {
      this.languages = languages;
      this.populateLanguagesDropdown();
      this.checkLangPreferences();
    });
  }

  changeLanguage(langCode: string): void {
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
    const languagesContainer = $('.container');
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
        return this.changeLanguage(langCode);
      }

      if (config && config.extraParams && config.extraParams.language) {
        const langCode = config.extraParams.language;

        return this.changeLanguage(langCode);
      }

      this.changeLanguage('en');
    });
  }

  private translateElements(): void {
    const lang = this.languages.find(
      lang => lang.code === this.currentLangCode
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
