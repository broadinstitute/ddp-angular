import { Injectable } from '@angular/core';
import { NameValue } from './name-value.model';

/**
 * Language list from
 * Anatoly Mironov (mirontoli)
 * http://sharepointkunskap.wordpress.com
 * http://www.bool.se
 *
 * http://stackoverflow.com/questions/3605495/generate-a-list-of-localized-language-names-with-links-to-google-translate/14800384#14800384
 * http://stackoverflow.com/questions/10997128/language-name-from-iso-639-1-code-in-javascript/14800499#14800499
 *
 * Example: getLanguageName("cv-RU") --> Chuvash
 */

@Injectable()
export class Language {

  /**
   * @author Phil Teare
   * using wikipedia data
   */
   static isoLangs: Map<string, NameValue> = new Map([
    ['ab', new NameValue('ab', 'Abkhaz')],
    ['aa', new NameValue('aa', 'Afar')],
    ['af', new NameValue('af', 'Afrikaans')],
    ['ak', new NameValue('ak', 'Akan')],
    ['sq', new NameValue('sq', 'Albanian')],
    ['am', new NameValue('am', 'Amharic')],
    ['ar', new NameValue('ar', 'Arabic')],
    ['an', new NameValue('an', 'Aragonese')],
    ['hy', new NameValue('hy', 'Armenian')],
    ['as', new NameValue('as', 'Assamese')],
    ['av', new NameValue('av', 'Avaric')],
    ['ae', new NameValue('ae', 'Avestan')],
    ['ay', new NameValue('ay', 'Aymara')],
    ['az', new NameValue('az', 'Azerbaijani')],
    ['bm', new NameValue('bm', 'Bambara')],
    ['ba', new NameValue('ba', 'Bashkir')],
    ['eu', new NameValue('eu', 'Basque')],
    ['be', new NameValue('be', 'Belarusian')],
    ['bn', new NameValue('bn', 'Bengali')],
    ['bh', new NameValue('bh', 'Bihari')],
    ['bi', new NameValue('bi', 'Bislama')],
    ['bs', new NameValue('bs', 'Bosnian')],
    ['br', new NameValue('br', 'Breton')],
    ['bg', new NameValue('bg', 'Bulgarian')],
    ['my', new NameValue('my', 'Burmese')],
    ['ca', new NameValue('ca', 'Catalan; Valencian')],
    ['ch', new NameValue('ch', 'Chamorro')],
    ['ce', new NameValue('ce', 'Chechen')],
    ['ny', new NameValue('ny', 'Chichewa; Chewa; Nyanja')],
    ['zh', new NameValue('zh', 'Chinese')],
    ['cv', new NameValue('cv', 'Chuvash')],
    ['kw', new NameValue('kw', 'Cornish')],
    ['co', new NameValue('co', 'Corsican')],
    ['cr', new NameValue('cr', 'Cree')],
    ['hr', new NameValue('hr', 'Croatian')],
    ['cs', new NameValue('cs', 'Czech')],
    ['da', new NameValue('da', 'Danish')],
    ['dv', new NameValue('dv', 'Divehi; Dhivehi; Maldivian')],
    ['nl', new NameValue('nl', 'Dutch')],
    ['en', new NameValue('en', 'English')],
    ['eo', new NameValue('eo', 'Esperanto')],
    ['et', new NameValue('et', 'Estonian')],
    ['ee', new NameValue('ee', 'Ewe')],
    ['fo', new NameValue('fo', 'Faroese')],
    ['fj', new NameValue('fj', 'Fijian')],
    ['fi', new NameValue('fi', 'Finnish')],
    ['fr', new NameValue('fr', 'French')],
    ['ff', new NameValue('ff', 'Fula; Fulah; Pulaar; Pular')],
    ['gl', new NameValue('gl', 'Galician')],
    ['ka', new NameValue('ka', 'Georgian')],
    ['de', new NameValue('de', 'German')],
    ['el', new NameValue('el', 'Greek, Modern')],
    ['gn', new NameValue('gn', 'Guaraní')],
    ['gu', new NameValue('gu', 'Gujarati')],
    ['ht', new NameValue('ht', 'Haitian; Haitian Creole')],
    ['ha', new NameValue('ha', 'Hausa')],
    ['he', new NameValue('he', 'Hebrew (modern)')],
    ['hz', new NameValue('hz', 'Herero')],
    ['hi', new NameValue('hi', 'Hindi')],
    ['ho', new NameValue('ho', 'Hiri Motu')],
    ['hu', new NameValue('hu', 'Hungarian')],
    ['ia', new NameValue('ia', 'Interlingua')],
    ['id', new NameValue('id', 'Indonesian')],
    ['ie', new NameValue('ie', 'Interlingue')],
    ['ga', new NameValue('ga', 'Irish')],
    ['ig', new NameValue('ig', 'Igbo')],
    ['ik', new NameValue('ik', 'Inupiaq')],
    ['io', new NameValue('io', 'Ido')],
    ['is', new NameValue('is', 'Icelandic')],
    ['it', new NameValue('it', 'Italian')],
    ['iu', new NameValue('iu', 'Inuktitut')],
    ['ja', new NameValue('ja', 'Japanese')],
    ['jv', new NameValue('jv', 'Javanese')],
    ['kl', new NameValue('kl', 'Kalaallisut, Greenlandic')],
    ['kn', new NameValue('kn', 'Kannada')],
    ['kr', new NameValue('kr', 'Kanuri')],
    ['ks', new NameValue('ks', 'Kashmiri')],
    ['kk', new NameValue('kk', 'Kazakh')],
    ['km', new NameValue('km', 'Khmer')],
    ['ki', new NameValue('ki', 'Kikuyu, Gikuyu')],
    ['rw', new NameValue('rw', 'Kinyarwanda')],
    ['ky', new NameValue('ky', 'Kirghiz, Kyrgyz')],
    ['kv', new NameValue('kv', 'Komi')],
    ['kg', new NameValue('kg', 'Kongo')],
    ['ko', new NameValue('ko', 'Korean')],
    ['ku', new NameValue('ku', 'Kurdish')],
    ['kj', new NameValue('kj', 'Kwanyama, Kuanyama')],
    ['la', new NameValue('la', 'Latin')],
    ['lb', new NameValue('lb', 'Luxembourgish, Letzeburgesch')],
    ['lg', new NameValue('lg', 'Luganda')],
    ['li', new NameValue('li', 'Limburgish, Limburgan, Limburger')],
    ['ln', new NameValue('ln', 'Lingala')],
    ['lo', new NameValue('lo', 'Lao')],
    ['lt', new NameValue('lt', 'Lithuanian')],
    ['lu', new NameValue('lu', 'Luba-Katanga')],
    ['lv', new NameValue('lv', 'Latvian')],
    ['gv', new NameValue('gv', 'Manx')],
    ['mk', new NameValue('mk', 'Macedonian')],
    ['mg', new NameValue('mg', 'Malagasy')],
    ['ms', new NameValue('ms', 'Malay')],
    ['ml', new NameValue('ml', 'Malayalam')],
    ['mt', new NameValue('mt', 'Maltese')],
    ['mi', new NameValue('mi', 'Māori')],
    ['mr', new NameValue('mr', 'Marathi (Marāṭhī)')],
    ['mh', new NameValue('mh', 'Marshallese')],
    ['mn', new NameValue('mn', 'Mongolian')],
    ['na', new NameValue('na', 'Nauru')],
    ['nv', new NameValue('nv', 'Navajo, Navaho')],
    ['nb', new NameValue('nb', 'Norwegian Bokmål')],
    ['nd', new NameValue('nd', 'North Ndebele')],
    ['ne', new NameValue('ne', 'Nepali')],
    ['ng', new NameValue('ng', 'Ndonga')],
    ['nn', new NameValue('nn', 'Norwegian Nynorsk')],
    ['no', new NameValue('no', 'Norwegian')],
    ['ii', new NameValue('ii', 'Nuosu')],
    ['nr', new NameValue('nr', 'South Ndebele')],
    ['oc', new NameValue('oc', 'Occitan')],
    ['oj', new NameValue('oj', 'Ojibwe, Ojibwa')],
    ['cu', new NameValue('cu', 'Old Church Slavonic, Church Slavic, Church Slavonic, Old Bulgarian, Old Slavonic')],
    ['om', new NameValue('om', 'Oromo')],
    ['or', new NameValue('or', 'Oriya')],
    ['os', new NameValue('os', 'Ossetian, Ossetic')],
    ['pa', new NameValue('pa', 'Panjabi, Punjabi')],
    ['pi', new NameValue('pi', 'Pāli')],
    ['fa', new NameValue('fa', 'Persian')],
    ['pl', new NameValue('pl', 'Polish')],
    ['ps', new NameValue('ps', 'Pashto, Pushto')],
    ['pt', new NameValue('pt', 'Portuguese')],
    ['qu', new NameValue('qu', 'Quechua')],
    ['rm', new NameValue('rm', 'Romansh')],
    ['rn', new NameValue('rn', 'Kirundi')],
    ['ro', new NameValue('ro', 'Romanian, Moldavian, Moldovan')],
    ['ru', new NameValue('ru', 'Russian')],
    ['sa', new NameValue('sa', 'Sanskrit (Saṁskṛta)')],
    ['sc', new NameValue('sc', 'Sardinian')],
    ['sd', new NameValue('sd', 'Sindhi')],
    ['se', new NameValue('se', 'Northern Sami')],
    ['sg', new NameValue('sg', 'Sango')],
    ['sr', new NameValue('sr', 'Serbian')],
    ['gd', new NameValue('gd', 'Scottish Gaelic; Gaelic')],
    ['sn', new NameValue('sn', 'Shona')],
    ['si', new NameValue('si', 'Sinhala, Sinhalese')],
    ['sk', new NameValue('sk', 'Slovak')],
    ['sl', new NameValue('sl', 'Slovene')],
    ['so', new NameValue('so', 'Somali')],
    ['st', new NameValue('st', 'Southern Sotho')],
    ['es', new NameValue('es', 'Spanish; Castilian')],
    ['su', new NameValue('su', 'Sundanese')],
    ['sw', new NameValue('sw', 'Swahili')],
    ['ss', new NameValue('ss', 'Swati')],
    ['sv', new NameValue('sv', 'Swedish')],
    ['ta', new NameValue('ta', 'Tamil')],
    ['te', new NameValue('te', 'Telugu')],
    ['tg', new NameValue('tg', 'Tajik')],
    ['th', new NameValue('th', 'Thai')],
    ['ti', new NameValue('ti', 'Tigrinya')],
    ['bo', new NameValue('bo', 'Tibetan Standard, Tibetan, Central')],
    ['tk', new NameValue('tk', 'Turkmen')],
    ['tl', new NameValue('tl', 'Tagalog')],
    ['tn', new NameValue('tn', 'Tswana')],
    ['to', new NameValue('to', 'Tonga (Tonga Islands)')],
    ['tr', new NameValue('tr', 'Turkish')],
    ['ts', new NameValue('ts', 'Tsonga')],
    ['tt', new NameValue('tt', 'Tatar')],
    ['tw', new NameValue('tw', 'Twi')],
    ['ty', new NameValue('ty', 'Tahitian')],
    ['ug', new NameValue('ug', 'Uighur, Uyghur')],
    ['uk', new NameValue('uk', 'Ukrainian')],
    ['ur', new NameValue('ur', 'Urdu')],
    ['uz', new NameValue('uz', 'Uzbek')],
    ['ve', new NameValue('ve', 'Venda')],
    ['vi', new NameValue('vi', 'Vietnamese')],
    ['vo', new NameValue('vo', 'Volapük')],
    ['wa', new NameValue('wa', 'Walloon')],
    ['cy', new NameValue('cy', 'Welsh')],
    ['wo', new NameValue('wo', 'Wolof')],
    ['fy', new NameValue('fy', 'Western Frisian')],
    ['xh', new NameValue('xh', 'Xhosa')],
    ['yi', new NameValue('yi', 'Yiddish')],
    ['yo', new NameValue('yo', 'Yoruba')],
    ['za', new NameValue('za', 'Zhuang, Chuang')],
   ]);

  public static getLanguageOptions(): NameValue[] {
    return Array.from(this.isoLangs.values());
  }

  public getLanguageName(key: string): string {
    key = key.slice(0, 2);
    const lang: NameValue = Language.isoLangs.get(key);
    return lang ? lang.value : undefined;
  }
}
