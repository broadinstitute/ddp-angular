declare const $;

interface Language {
  code: string;
  name: string;
}

let languagesList: Language[];

const onTranslate = (dictionary: Record<string, any>, langCode: string) => {
  const selectedLang = languagesList.find(lang => lang.code === langCode);

  if (selectedLang) {
    $('#current-language').text(selectedLang.name);
  }

  $('[data-translate]').each((i, el) => {
    const $el = $(el);
    const key = $el.data('translate');
    let text = '';
    if (key.indexOf('.') !== -1) {
      const pathKeys = key.split('.');
      try {
        text = pathKeys.reduce((prev, curr) => prev[curr], dictionary);
      } catch (e) {
        console.log(e);
      }
    } else {
      text = dictionary[key];
    }
    $el.text(text);
  });
};

const onChange = (
  baseUrl: string,
  language: string,
  cb: (list: any[]) => void
) => {
  $.getJSON(baseUrl + '/auth-' + language + '.json', data => {
    onTranslate(data, language);
    cb(data);
  });
};

const loadLanguagesList = (baseUrl: string) => {
  $.getJSON(baseUrl + '/languages.json', (languages: Language[]) => {
    languagesList = languages;

    const $container = $('.languages');
    let items = '';
    languages.forEach(item => {
      items +=
        '<li><a class="green-hover change-language" href="#" data-language="' +
        item.code.split('-')[0] +
        '">' +
        item.name +
        '</a></li>';
    });
    $container.empty();
    $container.append(items);
  });
};

export const translatorCreator = (url: string, cb: (dictionary) => void) => {
  loadLanguagesList(url);
  return {
    changeTranslate: (language: string) => {
      window.localStorage.setItem('lang', language);
      onChange(url, language, cb);
    },
  };
};
