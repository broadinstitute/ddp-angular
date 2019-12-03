export interface ValidationFailure {
  /**
   * The questions related to failed validation rule
   */
  stableIds: Array<string>;
  /**
   * The message
   */
  message: string;
}
