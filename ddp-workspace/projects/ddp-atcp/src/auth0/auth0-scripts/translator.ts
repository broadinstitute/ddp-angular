declare const $;

const onTranslate = (dictionary) => {
  $('[data-translate]').each((i, el) => {
    const $el = $(el);
    const key = $el.data('translate');
    let text = '';
    if (key.indexOf('.') !== - 1) {
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

const onChange = (baseUrl: string, language: string, cb: (list: any[]) => void) => {
  $.getJSON(baseUrl + '/auth-' + language + '.json', data => {
    onTranslate(data);
    cb(data);
  });
};

const loadLanguagesList = (baseUrl: string) => {
  $.getJSON(baseUrl + '/languages.json', (languages: any[]) => {
    const $container = $('.languages');
    let items = '';
    languages.forEach(item => {
      items += '<li><a class="green-hover change-language" href="#" data-language="' + item.code.split('-')[0] + '">' + item.name + '</a></li>';
    });
    $container.empty();
    $container.append(items);
  });
};

export const translatorCreator = (url: string, cb: (dictionary) => void) => {
  loadLanguagesList(url);
  return {
      changeTranslate: (language: string) => onChange(url, language, cb),
  };
};
