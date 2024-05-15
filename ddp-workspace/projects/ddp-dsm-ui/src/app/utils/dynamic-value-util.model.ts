export class DynamicValueUtilModel{

  static camelCaseRegEx = new RegExp('(([a-z])+([A-z])+(.)*)*');
  static convertToCamelCase(str: string): string {
    if (!str)
      {return str;}
    str = String(str);  // Ensure str is treated as a string
    const splittedWords = str.split('_');
    if (splittedWords.length < 2) {
      //in case there is no underscore in the column name, assume it is an older column name which is all uppercase
      return this.handleAllUppercase(str);
    }
    return this.makeCamelCaseFrom(this.makeWordsLowerCase(splittedWords));
  }

  private static handleAllUppercase(word: string): string {
    return this.isCamelCase(word) ? word : word.toLowerCase();
  }

  private static isCamelCase(word: string): boolean {
    return this.camelCaseRegEx.exec(word).filter((value) => value === word).length > 0;
  }

  private static makeCamelCaseFrom(words: string[]): string {
    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      if (i !== 0 && words.length > 0) {
        words[i] = this.makeFirstLetterUpperCase(word);
      }
    }
    return words.join('');
  }

  private static makeFirstLetterUpperCase(word: string): string {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }

  private static makeWordsLowerCase(splittedWords: string[]): Array<string> {
    const lowerCaseWords = splittedWords.map(word => word.toLowerCase());
    return lowerCaseWords;
  }

  public static isObjectEmpty(obj: Object): boolean {
    return Object.keys(obj).length === 0;
  }

}
