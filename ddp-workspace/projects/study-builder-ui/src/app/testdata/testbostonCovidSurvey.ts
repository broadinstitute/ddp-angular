import { BasicActivityDef } from '../model/core/basicActivityDef';

/* eslint-disable max-len*/
export const TestBostonCovidSurvey: BasicActivityDef = {
  activityCode: 'BASELINE_COVID',
  activityType: 'FORMS',
  allowOndemandTrigger: false,
  allowUnauthenticated: false,
  closing: null,
  creationExpr: null,
  displayOrder: 2,
  editTimeoutSec: 604800,
  excludeFromDisplay: false,
  formType: 'GENERAL',
  introduction: null,
  listStyleHint: 'NONE',
  mappings: [],
  maxInstancesPerUser: 1,
  readonlyHintTemplate: null,
  sections: [
    {
      blocks: [
        {
          blockType: 'QUESTION',
          question: {
            additionalInfoFooterTemplate: null,
            additionalInfoHeaderTemplate: null,
            displayCalendar: false,
            fields: [
              'MONTH',
              'DAY',
              'YEAR'
            ],
            hideNumber: false,
            isDeprecated: false,
            isRestricted: false,
            picklistConfig: null,
            promptTemplate: {
              templateText: '$dob_prompt',
              templateType: 'HTML',
              variables: [
                {
                  name: 'dob_prompt',
                  translations: [
                    {
                      language: 'en',
                      text: 'What is your date of birth?'
                    },
                    {
                      language: 'es',
                      text: '[ES] What is your date of birth?'
                    },
                    {
                      language: 'ht',
                      text: '[HT] What is your date of birth?'
                    }
                  ]
                }
              ]
            },
            questionType: 'DATE',
            renderMode: 'PICKLIST',
            stableId: 'DOB',
            validations: [
              {
                hintTemplate: {
                  templateText: '$dob_req_hint',
                  templateType: 'TEXT',
                  variables: [
                    {
                      name: 'dob_req_hint',
                      translations: [
                        {
                          language: 'en',
                          text: 'Please enter your date of birth in MM DD YYYY format'
                        },
                        {
                          language: 'es',
                          text: '[ES] Please enter your date of birth in MM DD YYYY format'
                        },
                        {
                          language: 'ht',
                          text: '[HT] Please enter your date of birth in MM DD YYYY format'
                        }
                      ]
                    }
                  ]
                },
                ruleType: 'REQUIRED'
              },
              {
                endDate: null,
                hintTemplate: {
                  templateText: '$dob_range_hint',
                  templateType: 'TEXT',
                  variables: [
                    {
                      name: 'dob_range_hint',
                      translations: [
                        {
                          language: 'en',
                          text: 'Please enter your date of birth in MM DD YYYY format'
                        },
                        {
                          language: 'es',
                          text: '[ES] Please enter your date of birth in MM DD YYYY format'
                        },
                        {
                          language: 'ht',
                          text: '[HT] Please enter your date of birth in MM DD YYYY format'
                        }
                      ]
                    }
                  ]
                },
                ruleType: 'DATE_RANGE',
                startDate: '1898-01-01',
                useTodayAsEnd: true
              }
            ]
          },
          shownExpr: null
        },
        {
          blockType: 'QUESTION',
          question: {
            additionalInfoFooterTemplate: null,
            additionalInfoHeaderTemplate: null,
            groups: [],
            hideNumber: false,
            isDeprecated: false,
            isRestricted: false,
            picklistLabelTemplate: null,
            picklistOptions: [
              {
                optionLabelTemplate: {
                  templateText: '$sex_male',
                  templateType: 'TEXT',
                  variables: [
                    {
                      name: 'sex_male',
                      translations: [
                        {
                          language: 'en',
                          text: 'Male'
                        },
                        {
                          language: 'es',
                          text: '[ES] Male'
                        },
                        {
                          language: 'ht',
                          text: '[HT] Male'
                        }
                      ]
                    }
                  ]
                },
                stableId: 'SEX_MALE'
              },
              {
                optionLabelTemplate: {
                  templateText: '$sex_female',
                  templateType: 'TEXT',
                  variables: [
                    {
                      name: 'sex_female',
                      translations: [
                        {
                          language: 'en',
                          text: 'Female'
                        },
                        {
                          language: 'es',
                          text: '[ES] Female'
                        },
                        {
                          language: 'ht',
                          text: '[HT] Female'
                        }
                      ]
                    }
                  ]
                },
                stableId: 'SEX_FEMALE'
              },
              {
                optionLabelTemplate: {
                  templateText: '$sex_other',
                  templateType: 'TEXT',
                  variables: [
                    {
                      name: 'sex_other',
                      translations: [
                        {
                          language: 'en',
                          text: 'Other'
                        },
                        {
                          language: 'es',
                          text: '[ES] Other'
                        },
                        {
                          language: 'ht',
                          text: '[HT] Other'
                        }
                      ]
                    }
                  ]
                },
                stableId: 'OTHER'
              }
            ],
            promptTemplate: {
              templateText: '$sex_prompt',
              templateType: 'HTML',
              variables: [
                {
                  name: 'sex_prompt',
                  translations: [
                    {
                      language: 'en',
                      text: 'What sex were you assigned at birth?'
                    },
                    {
                      language: 'es',
                      text: '[ES] What sex were you assigned at birth?'
                    },
                    {
                      language: 'ht',
                      text: '[HT] What sex were you assigned at birth?'
                    }
                  ]
                }
              ]
            },
            questionType: 'PICKLIST',
            renderMode: 'LIST',
            selectMode: 'SINGLE',
            stableId: 'SEX',
            validations: []
          },
          shownExpr: null
        },
        {
          blockType: 'QUESTION',
          question: {
            additionalInfoFooterTemplate: null,
            additionalInfoHeaderTemplate: null,
            groups: [],
            hideNumber: false,
            isDeprecated: false,
            isRestricted: false,
            picklistLabelTemplate: null,
            picklistOptions: [
              {
                optionLabelTemplate: {
                  templateText: '$gender_man',
                  templateType: 'TEXT',
                  variables: [
                    {
                      name: 'gender_man',
                      translations: [
                        {
                          language: 'en',
                          text: 'Man'
                        },
                        {
                          language: 'es',
                          text: '[ES] Man'
                        },
                        {
                          language: 'ht',
                          text: '[HT] Man'
                        }
                      ]
                    }
                  ]
                },
                stableId: 'MAN'
              },
              {
                optionLabelTemplate: {
                  templateText: '$gender_woman',
                  templateType: 'TEXT',
                  variables: [
                    {
                      name: 'gender_woman',
                      translations: [
                        {
                          language: 'en',
                          text: 'Woman'
                        },
                        {
                          language: 'es',
                          text: '[ES] Woman'
                        },
                        {
                          language: 'ht',
                          text: '[HT] Woman'
                        }
                      ]
                    }
                  ]
                },
                stableId: 'WOMAN'
              },
              {
                optionLabelTemplate: {
                  templateText: '$gender_transgender',
                  templateType: 'TEXT',
                  variables: [
                    {
                      name: 'gender_transgender',
                      translations: [
                        {
                          language: 'en',
                          text: 'Transgender'
                        },
                        {
                          language: 'es',
                          text: '[ES] Transgender'
                        },
                        {
                          language: 'ht',
                          text: '[HT] Transgender'
                        }
                      ]
                    }
                  ]
                },
                stableId: 'TRANSGENDER'
              },
              {
                optionLabelTemplate: {
                  templateText: '$gender_transgender_woman',
                  templateType: 'TEXT',
                  variables: [
                    {
                      name: 'gender_transgender_woman',
                      translations: [
                        {
                          language: 'en',
                          text: 'Transgender Woman/Transgender Female'
                        },
                        {
                          language: 'es',
                          text: '[ES] Transgender Woman/Transgender Female'
                        },
                        {
                          language: 'ht',
                          text: '[HT] Transgender Woman/Transgender Female'
                        }
                      ]
                    }
                  ]
                },
                stableId: 'TRANSGENDER_WOMAN'
              },
              {
                optionLabelTemplate: {
                  templateText: '$gender_transgender_man',
                  templateType: 'TEXT',
                  variables: [
                    {
                      name: 'gender_transgender_man',
                      translations: [
                        {
                          language: 'en',
                          text: 'Transgender Man/Transgender Male'
                        },
                        {
                          language: 'es',
                          text: '[ES] Transgender Man/Transgender Male'
                        },
                        {
                          language: 'ht',
                          text: '[HT] Transgender Man/Transgender Male'
                        }
                      ]
                    }
                  ]
                },
                stableId: 'TRANSGENDER_MAN'
              },
              {
                optionLabelTemplate: {
                  templateText: '$gender_nonbinary',
                  templateType: 'TEXT',
                  variables: [
                    {
                      name: 'gender_nonbinary',
                      translations: [
                        {
                          language: 'en',
                          text: 'Nonbinary'
                        },
                        {
                          language: 'es',
                          text: '[ES] Nonbinary'
                        },
                        {
                          language: 'ht',
                          text: '[HT] Nonbinary'
                        }
                      ]
                    }
                  ]
                },
                stableId: 'NONBINARY'
              },
              {
                allowDetails: true,
                detailLabelTemplate: {
                  templateText: '$gender_other_details',
                  templateType: 'TEXT',
                  variables: [
                    {
                      name: 'gender_other_details',
                      translations: [
                        {
                          language: 'en',
                          text: 'Please provide details'
                        },
                        {
                          language: 'es',
                          text: '[ES] Please provide details'
                        },
                        {
                          language: 'ht',
                          text: '[HT] Please provide details'
                        }
                      ]
                    }
                  ]
                },
                optionLabelTemplate: {
                  templateText: '$gender_other',
                  templateType: 'TEXT',
                  variables: [
                    {
                      name: 'gender_other',
                      translations: [
                        {
                          language: 'en',
                          text: 'A gender not listed here'
                        },
                        {
                          language: 'es',
                          text: '[ES] A gender not listed here'
                        },
                        {
                          language: 'ht',
                          text: '[HT] A gender not listed here'
                        }
                      ]
                    }
                  ]
                },
                stableId: 'OTHER'
              }
            ],
            promptTemplate: {
              templateText: '$gender_prompt',
              templateType: 'HTML',
              variables: [
                {
                  name: 'gender_prompt',
                  translations: [
                    {
                      language: 'en',
                      text: 'What is your gender?'
                    },
                    {
                      language: 'es',
                      text: '[ES] What is your gender?'
                    },
                    {
                      language: 'ht',
                      text: '[HT] What is your gender?'
                    }
                  ]
                }
              ]
            },
            questionType: 'PICKLIST',
            renderMode: 'LIST',
            selectMode: 'SINGLE',
            stableId: 'GENDER',
            tooltipTemplate: {
              templateText: '$gender_tip',
              templateType: 'TEXT',
              variables: [
                {
                  name: 'gender_tip',
                  translations: [
                    {
                      language: 'en',
                      text: 'Some people have gender identities that differ from their sex assigned at birth. What is your gender identity?'
                    },
                    {
                      language: 'es',
                      text: '[ES] Some people have gender identities that differ from their sex assigned at birth. What is your gender identity?'
                    },
                    {
                      language: 'ht',
                      text: '[HT] Some people have gender identities that differ from their sex assigned at birth. What is your gender identity?'
                    }
                  ]
                }
              ]
            },
            validations: []
          },
          shownExpr: null
        },
        {
          blockType: 'QUESTION',
          question: {
            additionalInfoFooterTemplate: null,
            additionalInfoHeaderTemplate: null,
            groups: [],
            hideNumber: false,
            isDeprecated: false,
            isRestricted: false,
            picklistLabelTemplate: null,
            picklistOptions: [
              {
                optionLabelTemplate: {
                  templateText: '$race_asian',
                  templateType: 'TEXT',
                  variables: [
                    {
                      name: 'race_asian',
                      translations: [
                        {
                          language: 'en',
                          text: 'Asian'
                        },
                        {
                          language: 'es',
                          text: '[ES] Asian'
                        },
                        {
                          language: 'ht',
                          text: '[HT] Asian'
                        }
                      ]
                    }
                  ]
                },
                stableId: 'ASIAN'
              },
              {
                optionLabelTemplate: {
                  templateText: '$race_black',
                  templateType: 'TEXT',
                  variables: [
                    {
                      name: 'race_black',
                      translations: [
                        {
                          language: 'en',
                          text: 'Black or African American'
                        },
                        {
                          language: 'es',
                          text: '[ES] Black or African American'
                        },
                        {
                          language: 'ht',
                          text: '[HT] Black or African American'
                        }
                      ]
                    }
                  ]
                },
                stableId: 'BLACK'
              },
              {
                optionLabelTemplate: {
                  templateText: '$race_american_indian',
                  templateType: 'TEXT',
                  variables: [
                    {
                      name: 'race_american_indian',
                      translations: [
                        {
                          language: 'en',
                          text: 'American Indian or Alaska Native'
                        },
                        {
                          language: 'es',
                          text: '[ES] American Indian or Alaska Native'
                        },
                        {
                          language: 'ht',
                          text: '[HT] American Indian or Alaska Native'
                        }
                      ]
                    }
                  ]
                },
                stableId: 'AMERICAN_INDIAN'
              },
              {
                optionLabelTemplate: {
                  templateText: '$race_native_hawaiian',
                  templateType: 'TEXT',
                  variables: [
                    {
                      name: 'race_native_hawaiian',
                      translations: [
                        {
                          language: 'en',
                          text: 'Native Hawaiian or Pacific Islander'
                        },
                        {
                          language: 'es',
                          text: '[ES] Native Hawaiian or Pacific Islander'
                        },
                        {
                          language: 'ht',
                          text: '[HT] Native Hawaiian or Pacific Islander'
                        }
                      ]
                    }
                  ]
                },
                stableId: 'NATIVE_HAWAIIAN'
              },
              {
                optionLabelTemplate: {
                  templateText: '$race_white',
                  templateType: 'TEXT',
                  variables: [
                    {
                      name: 'race_white',
                      translations: [
                        {
                          language: 'en',
                          text: 'White'
                        },
                        {
                          language: 'es',
                          text: '[ES] White'
                        },
                        {
                          language: 'ht',
                          text: '[HT] White'
                        }
                      ]
                    }
                  ]
                },
                stableId: 'WHITE'
              },
              {
                optionLabelTemplate: {
                  templateText: '$race_other',
                  templateType: 'TEXT',
                  variables: [
                    {
                      name: 'race_other',
                      translations: [
                        {
                          language: 'en',
                          text: 'Other'
                        },
                        {
                          language: 'es',
                          text: '[ES] Other'
                        },
                        {
                          language: 'ht',
                          text: '[HT] Other'
                        }
                      ]
                    }
                  ]
                },
                stableId: 'OTHER'
              }
            ],
            promptTemplate: {
              templateText: '$race_prompt',
              templateType: 'HTML',
              variables: [
                {
                  name: 'race_prompt',
                  translations: [
                    {
                      language: 'en',
                      text: 'What is your race? (select all that apply)'
                    },
                    {
                      language: 'es',
                      text: '[ES] What is your race? (select all that apply)'
                    },
                    {
                      language: 'ht',
                      text: '[HT] What is your race? (select all that apply)'
                    }
                  ]
                }
              ]
            },
            questionType: 'PICKLIST',
            renderMode: 'LIST',
            selectMode: 'MULTIPLE',
            stableId: 'RACE',
            validations: []
          },
          shownExpr: null
        },
        {
          blockType: 'QUESTION',
          question: {
            additionalInfoFooterTemplate: null,
            additionalInfoHeaderTemplate: null,
            groups: [],
            hideNumber: false,
            isDeprecated: false,
            isRestricted: false,
            picklistLabelTemplate: null,
            picklistOptions: [
              {
                optionLabelTemplate: {
                  templateText: '$ethnicity_hispanic_latino',
                  templateType: 'TEXT',
                  variables: [
                    {
                      name: 'ethnicity_hispanic_latino',
                      translations: [
                        {
                          language: 'en',
                          text: 'Hispanic or Latino'
                        },
                        {
                          language: 'es',
                          text: '[ES] Hispanic or Latino'
                        },
                        {
                          language: 'ht',
                          text: '[HT] Hispanic or Latino'
                        }
                      ]
                    }
                  ]
                },
                stableId: 'HISPANIC_LATINO'
              },
              {
                optionLabelTemplate: {
                  templateText: '$ethnicity_not_hispanic_latino',
                  templateType: 'TEXT',
                  variables: [
                    {
                      name: 'ethnicity_not_hispanic_latino',
                      translations: [
                        {
                          language: 'en',
                          text: 'Not Hispanic or Latino'
                        },
                        {
                          language: 'es',
                          text: '[ES] Not Hispanic or Latino'
                        },
                        {
                          language: 'ht',
                          text: '[HT] Not Hispanic or Latino'
                        }
                      ]
                    }
                  ]
                },
                stableId: 'NOT_HISPANIC_LATINO'
              }
            ],
            promptTemplate: {
              templateText: '$ethnicity_prompt',
              templateType: 'HTML',
              variables: [
                {
                  name: 'ethnicity_prompt',
                  translations: [
                    {
                      language: 'en',
                      text: 'What is your ethnicity?'
                    },
                    {
                      language: 'es',
                      text: '[ES] What is your ethnicity?'
                    },
                    {
                      language: 'ht',
                      text: '[HT] What is your ethnicity?'
                    }
                  ]
                }
              ]
            },
            questionType: 'PICKLIST',
            renderMode: 'LIST',
            selectMode: 'SINGLE',
            stableId: 'ETHNICITY',
            validations: []
          },
          shownExpr: null
        },
        {
          blockType: 'CONDITIONAL',
          control: {
            additionalInfoFooterTemplate: null,
            additionalInfoHeaderTemplate: null,
            falseTemplate: {
              templateText: '$live_with_other_people_no',
              templateType: 'TEXT',
              variables: [
                {
                  name: 'live_with_other_people_no',
                  translations: [
                    {
                      language: 'en',
                      text: 'No'
                    },
                    {
                      language: 'es',
                      text: 'No'
                    },
                    {
                      language: 'ht',
                      text: 'Non'
                    }
                  ]
                }
              ]
            },
            hideNumber: false,
            isDeprecated: false,
            isRestricted: false,
            promptTemplate: {
              templateText: '$live_with_other_people_prompt',
              templateType: 'HTML',
              variables: [
                {
                  name: 'live_with_other_people_prompt',
                  translations: [
                    {
                      language: 'en',
                      text: 'Do you live with other people?'
                    },
                    {
                      language: 'es',
                      text: '[ES] Do you live with other people?'
                    },
                    {
                      language: 'ht',
                      text: '[HT] Do you live with other people?'
                    }
                  ]
                }
              ]
            },
            questionType: 'BOOLEAN',
            stableId: 'LIVE_WITH_OTHER_PEOPLE',
            trueTemplate: {
              templateText: '$live_with_other_people_yes',
              templateType: 'TEXT',
              variables: [
                {
                  name: 'live_with_other_people_yes',
                  translations: [
                    {
                      language: 'en',
                      text: 'Yes'
                    },
                    {
                      language: 'es',
                      text: 'Sí'
                    },
                    {
                      language: 'ht',
                      text: 'Wi'
                    }
                  ]
                }
              ]
            },
            validations: []
          },
          nested: [
            {
              blockType: 'QUESTION',
              question: {
                addButtonTemplate: {
                  templateText: '$household_list_add',
                  templateType: 'TEXT',
                  variables: [
                    {
                      name: 'household_list_add',
                      translations: [
                        {
                          language: 'en',
                          text: '+ Add another household member'
                        },
                        {
                          language: 'es',
                          text: '[ES] + Add another household member'
                        },
                        {
                          language: 'ht',
                          text: '[HT] + Add another household member'
                        }
                      ]
                    }
                  ]
                },
                additionalInfoFooterTemplate: null,
                additionalInfoHeaderTemplate: null,
                additionalItemTemplate: {
                  templateText: '$household_list_addl_item',
                  templateType: 'TEXT',
                  variables: [
                    {
                      name: 'household_list_addl_item',
                      translations: [
                        {
                          language: 'en',
                          text: 'Additional household member'
                        },
                        {
                          language: 'es',
                          text: '[ES] Additional household member'
                        },
                        {
                          language: 'ht',
                          text: '[HT] Additional household member'
                        }
                      ]
                    }
                  ]
                },
                allowMultiple: true,
                childOrientation: 'VERTICAL',
                children: [
                  {
                    additionalInfoFooterTemplate: null,
                    additionalInfoHeaderTemplate: null,
                    groups: [],
                    hideNumber: false,
                    isDeprecated: false,
                    isRestricted: false,
                    picklistLabelTemplate: null,
                    picklistOptions: [
                      {
                        optionLabelTemplate: {
                          templateText: '$household_member_adult',
                          templateType: 'TEXT',
                          variables: [
                            {
                              name: 'household_member_adult',
                              translations: [
                                {
                                  language: 'en',
                                  text: 'Adult'
                                },
                                {
                                  language: 'es',
                                  text: '[ES] Adult'
                                },
                                {
                                  language: 'ht',
                                  text: '[HT] Adult'
                                }
                              ]
                            }
                          ]
                        },
                        stableId: 'ADULT'
                      },
                      {
                        optionLabelTemplate: {
                          templateText: '$household_member_child',
                          templateType: 'TEXT',
                          variables: [
                            {
                              name: 'household_member_child',
                              translations: [
                                {
                                  language: 'en',
                                  text: 'Child'
                                },
                                {
                                  language: 'es',
                                  text: '[ES] Child'
                                },
                                {
                                  language: 'ht',
                                  text: '[HT] Child'
                                }
                              ]
                            }
                          ]
                        },
                        stableId: 'CHILD'
                      }
                    ],
                    promptTemplate: {
                      templateText: '$household_member_prompt',
                      templateType: 'HTML',
                      variables: [
                        {
                          name: 'household_member_prompt',
                          translations: [
                            {
                              language: 'en',
                              text: ''
                            },
                            {
                              language: 'es',
                              text: ''
                            },
                            {
                              language: 'ht',
                              text: ''
                            }
                          ]
                        }
                      ]
                    },
                    questionType: 'PICKLIST',
                    renderMode: 'LIST',
                    selectMode: 'SINGLE',
                    stableId: 'HOUSEHOLD_MEMBER',
                    validations: []
                  },
                  {
                    additionalInfoFooterTemplate: null,
                    additionalInfoHeaderTemplate: null,
                    hideNumber: false,
                    isDeprecated: false,
                    isRestricted: false,
                    numericType: 'INTEGER',
                    placeholderTemplate: {
                      templateText: '$household_member_age_placeholder',
                      templateType: 'HTML',
                      variables: [
                        {
                          name: 'household_member_age_placeholder',
                          translations: [
                            {
                              language: 'en',
                              text: 'This person\'s age'
                            },
                            {
                              language: 'es',
                              text: '[ES] This person\'s age'
                            },
                            {
                              language: 'ht',
                              text: '[HT] This person\'s age'
                            }
                          ]
                        }
                      ]
                    },
                    promptTemplate: {
                      templateText: '$household_member_age_prompt',
                      templateType: 'HTML',
                      variables: [
                        {
                          name: 'household_member_age_prompt',
                          translations: [
                            {
                              language: 'en',
                              text: ''
                            },
                            {
                              language: 'es',
                              text: ''
                            },
                            {
                              language: 'ht',
                              text: ''
                            }
                          ]
                        }
                      ]
                    },
                    questionType: 'NUMERIC',
                    stableId: 'HOUSEHOLD_MEMBER_AGE',
                    validations: [
                      {
                        max: 120,
                        min: 0,
                        ruleType: 'INT_RANGE'
                      }
                    ]
                  }
                ],
                hideNumber: false,
                isDeprecated: false,
                isRestricted: false,
                promptTemplate: {
                  templateText: '$household_list_prompt',
                  templateType: 'HTML',
                  variables: [
                    {
                      name: 'household_list_prompt',
                      translations: [
                        {
                          language: 'en',
                          text: 'Who do you live with?'
                        },
                        {
                          language: 'es',
                          text: '[ES] Who do you live with?'
                        },
                        {
                          language: 'ht',
                          text: '[HT] Who do you live with?'
                        }
                      ]
                    }
                  ]
                },
                questionType: 'COMPOSITE',
                stableId: 'HOUSEHOLD_LIST',
                unwrapOnExport: false,
                validations: []
              },
              shownExpr: 'user.studies["testboston"].forms["BASELINE_COVID"].questions["LIVE_WITH_OTHER_PEOPLE"].answers.hasTrue()'
            }
          ],
          shownExpr: null
        },
        {
          blockType: 'CONDITIONAL',
          control: {
            additionalInfoFooterTemplate: null,
            additionalInfoHeaderTemplate: null,
            groups: [],
            hideNumber: false,
            isDeprecated: false,
            isRestricted: false,
            picklistLabelTemplate: null,
            picklistOptions: [
              {
                optionLabelTemplate: {
                  templateText: '$covid_been_tested_yes',
                  templateType: 'TEXT',
                  variables: [
                    {
                      name: 'covid_been_tested_yes',
                      translations: [
                        {
                          language: 'en',
                          text: 'Yes'
                        },
                        {
                          language: 'es',
                          text: 'Sí'
                        },
                        {
                          language: 'ht',
                          text: 'Wi'
                        }
                      ]
                    }
                  ]
                },
                stableId: 'YES'
              },
              {
                optionLabelTemplate: {
                  templateText: '$covid_been_tested_no',
                  templateType: 'TEXT',
                  variables: [
                    {
                      name: 'covid_been_tested_no',
                      translations: [
                        {
                          language: 'en',
                          text: 'No'
                        },
                        {
                          language: 'es',
                          text: 'No'
                        },
                        {
                          language: 'ht',
                          text: 'Non'
                        }
                      ]
                    }
                  ]
                },
                stableId: 'NO'
              },
              {
                optionLabelTemplate: {
                  templateText: '$covid_been_tested_dk',
                  templateType: 'TEXT',
                  variables: [
                    {
                      name: 'covid_been_tested_dk',
                      translations: [
                        {
                          language: 'en',
                          text: 'I don\'t know'
                        },
                        {
                          language: 'es',
                          text: 'No sé'
                        },
                        {
                          language: 'ht',
                          text: 'Mwen pa konnen'
                        }
                      ]
                    }
                  ]
                },
                stableId: 'DK'
              },
              {
                optionLabelTemplate: {
                  templateText: '$covid_been_tested_prefer_not_answer',
                  templateType: 'TEXT',
                  variables: [
                    {
                      name: 'covid_been_tested_prefer_not_answer',
                      translations: [
                        {
                          language: 'en',
                          text: 'I prefer not to answer'
                        },
                        {
                          language: 'es',
                          text: 'Prefiero no responder'
                        },
                        {
                          language: 'ht',
                          text: 'Mwen pito pa reponn'
                        }
                      ]
                    }
                  ]
                },
                stableId: 'PREFER_NOT_ANSWER'
              }
            ],
            promptTemplate: {
              templateText: '$covid_been_tested_prompt',
              templateType: 'HTML',
              variables: [
                {
                  name: 'covid_been_tested_prompt',
                  translations: [
                    {
                      language: 'en',
                      text: 'Have you ever been tested for COVID-19?'
                    },
                    {
                      language: 'es',
                      text: '¿Alguna vez le hicieron una prueba de COVID-19?'
                    },
                    {
                      language: 'ht',
                      text: 'Èske w te fè tès pou COVID-19 deja?'
                    }
                  ]
                }
              ]
            },
            questionType: 'PICKLIST',
            renderMode: 'LIST',
            selectMode: 'SINGLE',
            stableId: 'COVID_BEEN_TESTED',
            validations: []
          },
          nested: [
            {
              blockType: 'QUESTION',
              question: {
                additionalInfoFooterTemplate: null,
                additionalInfoHeaderTemplate: null,
                groups: [],
                hideNumber: false,
                isDeprecated: false,
                isRestricted: false,
                picklistLabelTemplate: null,
                picklistOptions: [
                  {
                    optionLabelTemplate: {
                      templateText: '$covid_test_kind_viral_test',
                      templateType: 'TEXT',
                      variables: [
                        {
                          name: 'covid_test_kind_viral_test',
                          translations: [
                            {
                              language: 'en',
                              text: 'A viral test'
                            },
                            {
                              language: 'es',
                              text: 'Una prueba de detección del virus'
                            },
                            {
                              language: 'ht',
                              text: 'Yon tès viral'
                            }
                          ]
                        }
                      ]
                    },
                    stableId: 'VIRAL_TEST',
                    tooltipTemplate: {
                      templateText: '$covid_test_kind_viral_test_tip',
                      templateType: 'TEXT',
                      variables: [
                        {
                          name: 'covid_test_kind_viral_test_tip',
                          translations: [
                            {
                              language: 'en',
                              text: 'This is usually a swab of your nose or mouth, or a sample of your spit. This is the kind of test most people receive if they have symptoms or think they might be sick.'
                            },
                            {
                              language: 'es',
                              text: 'Suele ser un hisopado de la nariz o de la boca, o una muestra de saliva. Este es el tipo de prueba que se realiza la gente si tiene síntomas o cree que podría estar enferma.'
                            },
                            {
                              language: 'ht',
                              text: 'Se òdinèman yon echantiyon avèk yon aplikatè swa nan nen w oswa nan bouch ou, oswa yon echantiyon krache ou a. Se kalite tès sa a pifò moun resevwa si yo gen sentòm oswa yo panse yo ta ka malad.'
                            }
                          ]
                        }
                      ]
                    }
                  },
                  {
                    optionLabelTemplate: {
                      templateText: '$covid_test_kind_blood_test',
                      templateType: 'TEXT',
                      variables: [
                        {
                          name: 'covid_test_kind_blood_test',
                          translations: [
                            {
                              language: 'en',
                              text: 'A serology or antibody test'
                            },
                            {
                              language: 'es',
                              text: 'Una prueba serológica o de anticuerpos'
                            },
                            {
                              language: 'ht',
                              text: 'Yon tès sewoloji oswa antikò'
                            }
                          ]
                        }
                      ]
                    },
                    stableId: 'BLOOD_TEST',
                    tooltipTemplate: {
                      templateText: '$covid_test_kind_blood_test_tip',
                      templateType: 'TEXT',
                      variables: [
                        {
                          name: 'covid_test_kind_blood_test_tip',
                          translations: [
                            {
                              language: 'en',
                              text: 'This is usually a blood draw or finger stick.'
                            },
                            {
                              language: 'es',
                              text: 'Suele ser una extracción de sangre o un pinchazo en un dedo.'
                            },
                            {
                              language: 'ht',
                              text: 'Se òdinèman yon prelèvman san oswa pike nan pwent dwèt.'
                            }
                          ]
                        }
                      ]
                    }
                  },
                  {
                    exclusive: true,
                    optionLabelTemplate: {
                      templateText: '$covid_test_kind_not_sure',
                      templateType: 'TEXT',
                      variables: [
                        {
                          name: 'covid_test_kind_not_sure',
                          translations: [
                            {
                              language: 'en',
                              text: 'I\'m not sure'
                            },
                            {
                              language: 'es',
                              text: 'No lo sé con certeza'
                            },
                            {
                              language: 'ht',
                              text: 'Mwen pa fin konnen'
                            }
                          ]
                        }
                      ]
                    },
                    stableId: 'NOT_SURE'
                  }
                ],
                promptTemplate: {
                  templateText: '$covid_test_kind_prompt',
                  templateType: 'HTML',
                  variables: [
                    {
                      name: 'covid_test_kind_prompt',
                      translations: [
                        {
                          language: 'en',
                          text: 'What kind of test(s) did you get? (Check all that apply)'
                        },
                        {
                          language: 'es',
                          text: '¿Qué tipo(s) de pruebas le realizaron? (Marque todas las opciones que correspondan).'
                        },
                        {
                          language: 'ht',
                          text: 'Ki kalite tès ou te fè? (Tcheke tout sa ki valab)'
                        }
                      ]
                    }
                  ]
                },
                questionType: 'PICKLIST',
                renderMode: 'LIST',
                selectMode: 'MULTIPLE',
                stableId: 'COVID_TEST_KIND',
                validations: []
              },
              shownExpr: 'user.studies["testboston"].forms["BASELINE_COVID"].questions["COVID_BEEN_TESTED"].answers.hasOption("YES")'
            },
            {
              blockType: 'QUESTION',
              question: {
                additionalInfoFooterTemplate: null,
                additionalInfoHeaderTemplate: null,
                displayCalendar: false,
                fields: [
                  'MONTH',
                  'DAY',
                  'YEAR'
                ],
                hideNumber: false,
                isDeprecated: false,
                isRestricted: false,
                picklistConfig: {
                  allowFutureYears: false,
                  firstSelectedYear: 2020,
                  useMonthNames: true,
                  yearAnchor: 2019,
                  yearsBack: 0,
                  yearsForward: 100
                },
                promptTemplate: {
                  templateText: '$covid_test_date_prompt',
                  templateType: 'HTML',
                  variables: [
                    {
                      name: 'covid_test_date_prompt',
                      translations: [
                        {
                          language: 'en',
                          text: 'When did you get tested?'
                        },
                        {
                          language: 'es',
                          text: '¿Cuándo se realizó la prueba?'
                        },
                        {
                          language: 'ht',
                          text: 'Kilè ou te fè tès la?'
                        }
                      ]
                    }
                  ]
                },
                questionType: 'DATE',
                renderMode: 'PICKLIST',
                stableId: 'COVID_TEST_DATE',
                validations: [
                  {
                    hintTemplate: {
                      templateText: '$covid_test_date_month_hint',
                      templateType: 'TEXT',
                      variables: [
                        {
                          name: 'covid_test_date_month_hint',
                          translations: [
                            {
                              language: 'en',
                              text: 'Please select the month'
                            },
                            {
                              language: 'es',
                              text: 'Seleccione el mes.'
                            },
                            {
                              language: 'ht',
                              text: 'Tanpri, chwazi mwa a'
                            }
                          ]
                        }
                      ]
                    },
                    ruleType: 'MONTH_REQUIRED'
                  },
                  {
                    hintTemplate: {
                      templateText: '$covid_test_date_year_hint',
                      templateType: 'TEXT',
                      variables: [
                        {
                          name: 'covid_test_date_year_hint',
                          translations: [
                            {
                              language: 'en',
                              text: 'Please select the year'
                            },
                            {
                              language: 'es',
                              text: 'Seleccione el año.'
                            },
                            {
                              language: 'ht',
                              text: 'Tanpri, chwazi ane a'
                            }
                          ]
                        }
                      ]
                    },
                    ruleType: 'YEAR_REQUIRED'
                  },
                  {
                    endDate: null,
                    hintTemplate: {
                      templateText: '$covid_test_date_range_hint',
                      templateType: 'TEXT',
                      variables: [
                        {
                          name: 'covid_test_date_range_hint',
                          translations: [
                            {
                              language: 'en',
                              text: 'Please select a valid date'
                            },
                            {
                              language: 'es',
                              text: 'Seleccione una fecha válida.'
                            },
                            {
                              language: 'ht',
                              text: 'Tanpri, chwazi yon dat ki valab'
                            }
                          ]
                        }
                      ]
                    },
                    ruleType: 'DATE_RANGE',
                    startDate: '2019-01-01',
                    useTodayAsEnd: true
                  }
                ]
              },
              shownExpr: '\n                user.studies["testboston"].forms["BASELINE_COVID"].questions["COVID_BEEN_TESTED"].answers.hasOption("YES")\n                && user.studies["testboston"].forms["BASELINE_COVID"].questions["COVID_TEST_KIND"].answers.hasOption("NOT_SURE")\n              '
            },
            {
              blockType: 'QUESTION',
              question: {
                additionalInfoFooterTemplate: null,
                additionalInfoHeaderTemplate: null,
                groups: [],
                hideNumber: false,
                isDeprecated: false,
                isRestricted: false,
                picklistLabelTemplate: null,
                picklistOptions: [
                  {
                    optionLabelTemplate: {
                      templateText: '$covid_test_result_pos',
                      templateType: 'TEXT',
                      variables: [
                        {
                          name: 'covid_test_result_pos',
                          translations: [
                            {
                              language: 'en',
                              text: 'Positive'
                            },
                            {
                              language: 'es',
                              text: 'Positivo'
                            },
                            {
                              language: 'ht',
                              text: 'Pozitif'
                            }
                          ]
                        }
                      ]
                    },
                    stableId: 'POS'
                  },
                  {
                    optionLabelTemplate: {
                      templateText: '$covid_test_result_neg',
                      templateType: 'TEXT',
                      variables: [
                        {
                          name: 'covid_test_result_neg',
                          translations: [
                            {
                              language: 'en',
                              text: 'Negative'
                            },
                            {
                              language: 'es',
                              text: 'Negativo'
                            },
                            {
                              language: 'ht',
                              text: 'Negatif'
                            }
                          ]
                        }
                      ]
                    },
                    stableId: 'NEG'
                  },
                  {
                    optionLabelTemplate: {
                      templateText: '$covid_test_result_dk',
                      templateType: 'TEXT',
                      variables: [
                        {
                          name: 'covid_test_result_dk',
                          translations: [
                            {
                              language: 'en',
                              text: 'I don\'t know'
                            },
                            {
                              language: 'es',
                              text: 'No sé'
                            },
                            {
                              language: 'ht',
                              text: 'Mwen pa konnen'
                            }
                          ]
                        }
                      ]
                    },
                    stableId: 'DK'
                  }
                ],
                promptTemplate: {
                  templateText: '$covid_test_result_prompt',
                  templateType: 'HTML',
                  variables: [
                    {
                      name: 'covid_test_result_prompt',
                      translations: [
                        {
                          language: 'en',
                          text: 'What was the result of your COVID-19 test?'
                        },
                        {
                          language: 'es',
                          text: '¿Cuál fue el resultado de su prueba de COVID-19?'
                        },
                        {
                          language: 'ht',
                          text: 'Kisa rezilta tès COVID-19 ou a te ye?'
                        }
                      ]
                    }
                  ]
                },
                questionType: 'PICKLIST',
                renderMode: 'LIST',
                selectMode: 'SINGLE',
                stableId: 'COVID_TEST_RESULT',
                validations: []
              },
              shownExpr: '\n                user.studies["testboston"].forms["BASELINE_COVID"].questions["COVID_BEEN_TESTED"].answers.hasOption("YES")\n                && user.studies["testboston"].forms["BASELINE_COVID"].questions["COVID_TEST_KIND"].answers.hasOption("NOT_SURE")\n              '
            },
            {
              blockType: 'QUESTION',
              question: {
                addButtonTemplate: {
                  templateText: '$viral_test_list_add_button',
                  templateType: 'TEXT',
                  variables: [
                    {
                      name: 'viral_test_list_add_button',
                      translations: [
                        {
                          language: 'en',
                          text: '+ Add another viral test'
                        },
                        {
                          language: 'es',
                          text: '+ Agregar otra prueba de detección del virus'
                        },
                        {
                          language: 'ht',
                          text: '+ Ajoute yon lòt tès viral'
                        }
                      ]
                    }
                  ]
                },
                additionalInfoFooterTemplate: null,
                additionalInfoHeaderTemplate: null,
                additionalItemTemplate: null,
                allowMultiple: true,
                childOrientation: 'VERTICAL',
                children: [
                  {
                    additionalInfoFooterTemplate: null,
                    additionalInfoHeaderTemplate: null,
                    groups: [],
                    hideNumber: false,
                    isDeprecated: false,
                    isRestricted: false,
                    picklistLabelTemplate: null,
                    picklistOptions: [
                      {
                        optionLabelTemplate: {
                          templateText: '$viral_test_result_pos',
                          templateType: 'TEXT',
                          variables: [
                            {
                              name: 'viral_test_result_pos',
                              translations: [
                                {
                                  language: 'en',
                                  text: 'Positive'
                                },
                                {
                                  language: 'es',
                                  text: 'Positivo'
                                },
                                {
                                  language: 'ht',
                                  text: 'Pozitif'
                                }
                              ]
                            }
                          ]
                        },
                        stableId: 'POS'
                      },
                      {
                        optionLabelTemplate: {
                          templateText: '$viral_test_result_neg',
                          templateType: 'TEXT',
                          variables: [
                            {
                              name: 'viral_test_result_neg',
                              translations: [
                                {
                                  language: 'en',
                                  text: 'Negative'
                                },
                                {
                                  language: 'es',
                                  text: 'Negativo'
                                },
                                {
                                  language: 'ht',
                                  text: 'Negatif'
                                }
                              ]
                            }
                          ]
                        },
                        stableId: 'NEG'
                      },
                      {
                        optionLabelTemplate: {
                          templateText: '$viral_test_result_dk',
                          templateType: 'TEXT',
                          variables: [
                            {
                              name: 'viral_test_result_dk',
                              translations: [
                                {
                                  language: 'en',
                                  text: 'I don\'t know'
                                },
                                {
                                  language: 'es',
                                  text: 'No sé'
                                },
                                {
                                  language: 'ht',
                                  text: 'Mwen pa konnen'
                                }
                              ]
                            }
                          ]
                        },
                        stableId: 'DK'
                      }
                    ],
                    promptTemplate: {
                      templateText: '$viral_test_result_prompt',
                      templateType: 'HTML',
                      variables: [
                        {
                          name: 'viral_test_result_prompt',
                          translations: [
                            {
                              language: 'en',
                              text: 'Viral test result:'
                            },
                            {
                              language: 'es',
                              text: 'Resultado de la prueba de detección del virus:'
                            },
                            {
                              language: 'ht',
                              text: 'Rezilta tès viral la:'
                            }
                          ]
                        }
                      ]
                    },
                    questionType: 'PICKLIST',
                    renderMode: 'LIST',
                    selectMode: 'SINGLE',
                    stableId: 'VIRAL_TEST_RESULT',
                    validations: []
                  },
                  {
                    additionalInfoFooterTemplate: null,
                    additionalInfoHeaderTemplate: null,
                    displayCalendar: false,
                    fields: [
                      'MONTH',
                      'DAY',
                      'YEAR'
                    ],
                    hideNumber: false,
                    isDeprecated: false,
                    isRestricted: false,
                    picklistConfig: {
                      allowFutureYears: false,
                      firstSelectedYear: 2020,
                      useMonthNames: true,
                      yearAnchor: 2019,
                      yearsBack: 0,
                      yearsForward: 100
                    },
                    promptTemplate: {
                      templateText: '$viral_test_date_prompt',
                      templateType: 'HTML',
                      variables: [
                        {
                          name: 'viral_test_date_prompt',
                          translations: [
                            {
                              language: 'en',
                              text: 'Viral test date:'
                            },
                            {
                              language: 'es',
                              text: 'Fecha de la prueba de detección del virus:'
                            },
                            {
                              language: 'ht',
                              text: 'Dat tès viral la:'
                            }
                          ]
                        }
                      ]
                    },
                    questionType: 'DATE',
                    renderMode: 'PICKLIST',
                    stableId: 'VIRAL_TEST_DATE',
                    validations: [
                      {
                        hintTemplate: {
                          templateText: '$viral_test_date_month_hint',
                          templateType: 'TEXT',
                          variables: [
                            {
                              name: 'viral_test_date_month_hint',
                              translations: [
                                {
                                  language: 'en',
                                  text: 'Please select the month'
                                },
                                {
                                  language: 'es',
                                  text: 'Seleccione el mes.'
                                },
                                {
                                  language: 'ht',
                                  text: 'Tanpri, chwazi mwa a'
                                }
                              ]
                            }
                          ]
                        },
                        ruleType: 'MONTH_REQUIRED'
                      },
                      {
                        hintTemplate: {
                          templateText: '$viral_test_date_year_hint',
                          templateType: 'TEXT',
                          variables: [
                            {
                              name: 'viral_test_date_year_hint',
                              translations: [
                                {
                                  language: 'en',
                                  text: 'Please select the year'
                                },
                                {
                                  language: 'es',
                                  text: 'Seleccione el año.'
                                },
                                {
                                  language: 'ht',
                                  text: 'Tanpri, chwazi ane a'
                                }
                              ]
                            }
                          ]
                        },
                        ruleType: 'YEAR_REQUIRED'
                      },
                      {
                        endDate: null,
                        hintTemplate: {
                          templateText: '$viral_test_date_range_hint',
                          templateType: 'TEXT',
                          variables: [
                            {
                              name: 'viral_test_date_range_hint',
                              translations: [
                                {
                                  language: 'en',
                                  text: 'Please select a valid date'
                                },
                                {
                                  language: 'es',
                                  text: 'Seleccione una fecha válida.'
                                },
                                {
                                  language: 'ht',
                                  text: 'Tanpri, chwazi yon dat ki valab'
                                }
                              ]
                            }
                          ]
                        },
                        ruleType: 'DATE_RANGE',
                        startDate: '1920-01-01',
                        useTodayAsEnd: true
                      }
                    ]
                  }
                ],
                hideNumber: false,
                isDeprecated: false,
                isRestricted: false,
                promptTemplate: {
                  templateText: '$viral_test_list_prompt',
                  templateType: 'HTML',
                  variables: [
                    {
                      name: 'viral_test_list_prompt',
                      translations: [
                        {
                          language: 'en',
                          text: ''
                        },
                        {
                          language: 'es',
                          text: ''
                        },
                        {
                          language: 'ht',
                          text: ''
                        }
                      ]
                    }
                  ]
                },
                questionType: 'COMPOSITE',
                stableId: 'VIRAL_TEST_LIST',
                unwrapOnExport: false,
                validations: []
              },
              shownExpr: '\n                user.studies["testboston"].forms["BASELINE_COVID"].questions["COVID_BEEN_TESTED"].answers.hasOption("YES")\n                && user.studies["testboston"].forms["BASELINE_COVID"].questions["COVID_TEST_KIND"].answers.hasOption("VIRAL_TEST")\n              '
            },
            {
              blockType: 'QUESTION',
              question: {
                addButtonTemplate: {
                  templateText: '$blood_test_list_add_button',
                  templateType: 'TEXT',
                  variables: [
                    {
                      name: 'blood_test_list_add_button',
                      translations: [
                        {
                          language: 'en',
                          text: '+ Add another antibody (blood) test'
                        },
                        {
                          language: 'es',
                          text: '+ Agregar otra prueba de anticuerpos (sangre)'
                        },
                        {
                          language: 'ht',
                          text: '+ Ajoute yon lòt tès (san) antikò'
                        }
                      ]
                    }
                  ]
                },
                additionalInfoFooterTemplate: null,
                additionalInfoHeaderTemplate: null,
                additionalItemTemplate: null,
                allowMultiple: true,
                childOrientation: 'VERTICAL',
                children: [
                  {
                    additionalInfoFooterTemplate: null,
                    additionalInfoHeaderTemplate: null,
                    groups: [],
                    hideNumber: false,
                    isDeprecated: false,
                    isRestricted: false,
                    picklistLabelTemplate: null,
                    picklistOptions: [
                      {
                        optionLabelTemplate: {
                          templateText: '$blood_test_result_pos',
                          templateType: 'TEXT',
                          variables: [
                            {
                              name: 'blood_test_result_pos',
                              translations: [
                                {
                                  language: 'en',
                                  text: 'Positive'
                                },
                                {
                                  language: 'es',
                                  text: 'Positivo'
                                },
                                {
                                  language: 'ht',
                                  text: 'Pozitif'
                                }
                              ]
                            }
                          ]
                        },
                        stableId: 'POS'
                      },
                      {
                        optionLabelTemplate: {
                          templateText: '$blood_test_result_neg',
                          templateType: 'TEXT',
                          variables: [
                            {
                              name: 'blood_test_result_neg',
                              translations: [
                                {
                                  language: 'en',
                                  text: 'Negative'
                                },
                                {
                                  language: 'es',
                                  text: 'Negativo'
                                },
                                {
                                  language: 'ht',
                                  text: 'Negatif'
                                }
                              ]
                            }
                          ]
                        },
                        stableId: 'NEG'
                      },
                      {
                        optionLabelTemplate: {
                          templateText: '$blood_test_result_inconclusive',
                          templateType: 'TEXT',
                          variables: [
                            {
                              name: 'blood_test_result_inconclusive',
                              translations: [
                                {
                                  language: 'en',
                                  text: 'Inconclusive'
                                },
                                {
                                  language: 'es',
                                  text: 'No concluyente'
                                },
                                {
                                  language: 'ht',
                                  text: 'Endetèmine'
                                }
                              ]
                            }
                          ]
                        },
                        stableId: 'INCONCLUSIVE'
                      },
                      {
                        optionLabelTemplate: {
                          templateText: '$blood_test_result_dk',
                          templateType: 'TEXT',
                          variables: [
                            {
                              name: 'blood_test_result_dk',
                              translations: [
                                {
                                  language: 'en',
                                  text: 'I don\'t know'
                                },
                                {
                                  language: 'es',
                                  text: 'No sé'
                                },
                                {
                                  language: 'ht',
                                  text: 'Mwen pa konnen'
                                }
                              ]
                            }
                          ]
                        },
                        stableId: 'DK'
                      }
                    ],
                    promptTemplate: {
                      templateText: '$blood_test_result_prompt',
                      templateType: 'HTML',
                      variables: [
                        {
                          name: 'blood_test_result_prompt',
                          translations: [
                            {
                              language: 'en',
                              text: 'Antibody (blood) test result:'
                            },
                            {
                              language: 'es',
                              text: 'Resultado de la prueba de anticuerpos (sangre):'
                            },
                            {
                              language: 'ht',
                              text: 'Rezilta tès (san) antikò:'
                            }
                          ]
                        }
                      ]
                    },
                    questionType: 'PICKLIST',
                    renderMode: 'LIST',
                    selectMode: 'SINGLE',
                    stableId: 'BLOOD_TEST_RESULT',
                    validations: []
                  },
                  {
                    additionalInfoFooterTemplate: null,
                    additionalInfoHeaderTemplate: null,
                    displayCalendar: false,
                    fields: [
                      'MONTH',
                      'DAY',
                      'YEAR'
                    ],
                    hideNumber: false,
                    isDeprecated: false,
                    isRestricted: false,
                    picklistConfig: {
                      allowFutureYears: false,
                      firstSelectedYear: 2020,
                      useMonthNames: true,
                      yearAnchor: 2019,
                      yearsBack: 0,
                      yearsForward: 100
                    },
                    promptTemplate: {
                      templateText: '$blood_test_date_prompt',
                      templateType: 'HTML',
                      variables: [
                        {
                          name: 'blood_test_date_prompt',
                          translations: [
                            {
                              language: 'en',
                              text: 'Antibody (blood) test date:'
                            },
                            {
                              language: 'es',
                              text: 'Fecha de la prueba de anticuerpos (sangre):'
                            },
                            {
                              language: 'ht',
                              text: 'Dat tès (san) antikò:'
                            }
                          ]
                        }
                      ]
                    },
                    questionType: 'DATE',
                    renderMode: 'PICKLIST',
                    stableId: 'BLOOD_TEST_DATE',
                    validations: [
                      {
                        hintTemplate: {
                          templateText: '$blood_test_date_month_hint',
                          templateType: 'TEXT',
                          variables: [
                            {
                              name: 'blood_test_date_month_hint',
                              translations: [
                                {
                                  language: 'en',
                                  text: 'Please select the month'
                                },
                                {
                                  language: 'es',
                                  text: 'Seleccione el mes.'
                                },
                                {
                                  language: 'ht',
                                  text: 'Tanpri, chwazi mwa a'
                                }
                              ]
                            }
                          ]
                        },
                        ruleType: 'MONTH_REQUIRED'
                      },
                      {
                        hintTemplate: {
                          templateText: '$blood_test_date_year_hint',
                          templateType: 'TEXT',
                          variables: [
                            {
                              name: 'blood_test_date_year_hint',
                              translations: [
                                {
                                  language: 'en',
                                  text: 'Please select the year'
                                },
                                {
                                  language: 'es',
                                  text: 'Seleccione el año.'
                                },
                                {
                                  language: 'ht',
                                  text: 'Tanpri, chwazi ane a'
                                }
                              ]
                            }
                          ]
                        },
                        ruleType: 'YEAR_REQUIRED'
                      },
                      {
                        endDate: null,
                        hintTemplate: {
                          templateText: '$blood_test_date_range_hint',
                          templateType: 'TEXT',
                          variables: [
                            {
                              name: 'blood_test_date_range_hint',
                              translations: [
                                {
                                  language: 'en',
                                  text: 'Please select a valid date'
                                },
                                {
                                  language: 'es',
                                  text: 'Seleccione una fecha válida.'
                                },
                                {
                                  language: 'ht',
                                  text: 'Tanpri, chwazi yon dat ki valab'
                                }
                              ]
                            }
                          ]
                        },
                        ruleType: 'DATE_RANGE',
                        startDate: '1920-01-01',
                        useTodayAsEnd: true
                      }
                    ]
                  }
                ],
                hideNumber: false,
                isDeprecated: false,
                isRestricted: false,
                promptTemplate: {
                  templateText: '$blood_test_list_prompt',
                  templateType: 'HTML',
                  variables: [
                    {
                      name: 'blood_test_list_prompt',
                      translations: [
                        {
                          language: 'en',
                          text: ''
                        },
                        {
                          language: 'es',
                          text: ''
                        },
                        {
                          language: 'ht',
                          text: ''
                        }
                      ]
                    }
                  ]
                },
                questionType: 'COMPOSITE',
                stableId: 'BLOOD_TEST_LIST',
                unwrapOnExport: false,
                validations: []
              },
              shownExpr: '\n                user.studies["testboston"].forms["BASELINE_COVID"].questions["COVID_BEEN_TESTED"].answers.hasOption("YES")\n                && user.studies["testboston"].forms["BASELINE_COVID"].questions["COVID_TEST_KIND"].answers.hasOption("BLOOD_TEST")\n              '
            }
          ],
          shownExpr: null
        },
        {
          blockType: 'QUESTION',
          question: {
            additionalInfoFooterTemplate: null,
            additionalInfoHeaderTemplate: null,
            groups: [],
            hideNumber: false,
            isDeprecated: false,
            isRestricted: false,
            picklistLabelTemplate: null,
            picklistOptions: [
              {
                optionLabelTemplate: {
                  templateText: '$current_symptoms_cough',
                  templateType: 'TEXT',
                  variables: [
                    {
                      name: 'current_symptoms_cough',
                      translations: [
                        {
                          language: 'en',
                          text: 'Cough'
                        },
                        {
                          language: 'es',
                          text: 'Tos'
                        },
                        {
                          language: 'ht',
                          text: 'Tous'
                        }
                      ]
                    }
                  ]
                },
                stableId: 'COUGH'
              },
              {
                optionLabelTemplate: {
                  templateText: '$current_symptoms_fever',
                  templateType: 'TEXT',
                  variables: [
                    {
                      name: 'current_symptoms_fever',
                      translations: [
                        {
                          language: 'en',
                          text: 'Fever'
                        },
                        {
                          language: 'es',
                          text: 'Fiebre'
                        },
                        {
                          language: 'ht',
                          text: 'Lafyèv'
                        }
                      ]
                    }
                  ]
                },
                stableId: 'FEVER'
              },
              {
                optionLabelTemplate: {
                  templateText: '$current_symptoms_sore_throat',
                  templateType: 'TEXT',
                  variables: [
                    {
                      name: 'current_symptoms_sore_throat',
                      translations: [
                        {
                          language: 'en',
                          text: 'Sore throat'
                        },
                        {
                          language: 'es',
                          text: 'Dolor de garganta'
                        },
                        {
                          language: 'ht',
                          text: 'Malgòj'
                        }
                      ]
                    }
                  ]
                },
                stableId: 'SORE_THROAT'
              },
              {
                optionLabelTemplate: {
                  templateText: '$current_symptoms_short_breath',
                  templateType: 'TEXT',
                  variables: [
                    {
                      name: 'current_symptoms_short_breath',
                      translations: [
                        {
                          language: 'en',
                          text: 'Shortness of breath or difficulty breathing'
                        },
                        {
                          language: 'es',
                          text: 'Falta de aire o dificultad para respirar'
                        },
                        {
                          language: 'ht',
                          text: 'Souf kout oswa difikilte pou respire'
                        }
                      ]
                    }
                  ]
                },
                stableId: 'SHORT_BREATH'
              },
              {
                optionLabelTemplate: {
                  templateText: '$current_symptoms_tight_chest',
                  templateType: 'TEXT',
                  variables: [
                    {
                      name: 'current_symptoms_tight_chest',
                      translations: [
                        {
                          language: 'en',
                          text: 'Chest tightness'
                        },
                        {
                          language: 'es',
                          text: 'Opresión en el pecho'
                        },
                        {
                          language: 'ht',
                          text: 'Pwatrin sere'
                        }
                      ]
                    }
                  ]
                },
                stableId: 'TIGHT_CHEST'
              },
              {
                optionLabelTemplate: {
                  templateText: '$current_symptoms_fatigue',
                  templateType: 'TEXT',
                  variables: [
                    {
                      name: 'current_symptoms_fatigue',
                      translations: [
                        {
                          language: 'en',
                          text: 'Fatigue'
                        },
                        {
                          language: 'es',
                          text: 'Cansancio'
                        },
                        {
                          language: 'ht',
                          text: 'Fatig'
                        }
                      ]
                    }
                  ]
                },
                stableId: 'FATIGUE'
              },
              {
                optionLabelTemplate: {
                  templateText: '$current_symptoms_muscle_ache',
                  templateType: 'TEXT',
                  variables: [
                    {
                      name: 'current_symptoms_muscle_ache',
                      translations: [
                        {
                          language: 'en',
                          text: 'Muscle aches'
                        },
                        {
                          language: 'es',
                          text: 'Dolores musculares'
                        },
                        {
                          language: 'ht',
                          text: 'Doulè nan misk'
                        }
                      ]
                    }
                  ]
                },
                stableId: 'MUSCLE_ACHE'
              },
              {
                optionLabelTemplate: {
                  templateText: '$current_symptoms_sensory_loss',
                  templateType: 'TEXT',
                  variables: [
                    {
                      name: 'current_symptoms_sensory_loss',
                      translations: [
                        {
                          language: 'en',
                          text: 'New loss of taste or smell'
                        },
                        {
                          language: 'es',
                          text: 'Pérdida del gusto o del olfato'
                        },
                        {
                          language: 'ht',
                          text: 'Vin pa ka pran gou oswa pran sant'
                        }
                      ]
                    }
                  ]
                },
                stableId: 'SENSORY_LOSS'
              },
              {
                optionLabelTemplate: {
                  templateText: '$current_symptoms_nausea',
                  templateType: 'TEXT',
                  variables: [
                    {
                      name: 'current_symptoms_nausea',
                      translations: [
                        {
                          language: 'en',
                          text: 'Nausea, vomiting, or diarrhea'
                        },
                        {
                          language: 'es',
                          text: 'Náuseas, vómitos o diarrea'
                        },
                        {
                          language: 'ht',
                          text: 'Kèplen, vomisman, oswa dyare'
                        }
                      ]
                    }
                  ]
                },
                stableId: 'NAUSEA'
              },
              {
                optionLabelTemplate: {
                  templateText: '$current_symptoms_congestion',
                  templateType: 'TEXT',
                  variables: [
                    {
                      name: 'current_symptoms_congestion',
                      translations: [
                        {
                          language: 'en',
                          text: 'Runny nose or congestion'
                        },
                        {
                          language: 'es',
                          text: 'Goteo nasal o congestión'
                        },
                        {
                          language: 'ht',
                          text: 'Nen k ap koule oswa konjesyon'
                        }
                      ]
                    }
                  ]
                },
                stableId: 'CONGESTION'
              },
              {
                optionLabelTemplate: {
                  templateText: '$current_symptoms_headache',
                  templateType: 'TEXT',
                  variables: [
                    {
                      name: 'current_symptoms_headache',
                      translations: [
                        {
                          language: 'en',
                          text: 'Headache'
                        },
                        {
                          language: 'es',
                          text: '[ES] Headache'
                        },
                        {
                          language: 'ht',
                          text: '[HT] Headache'
                        }
                      ]
                    }
                  ]
                },
                stableId: 'HEADACHE'
              },
              {
                exclusive: true,
                optionLabelTemplate: {
                  templateText: '$current_symptoms_none',
                  templateType: 'TEXT',
                  variables: [
                    {
                      name: 'current_symptoms_none',
                      translations: [
                        {
                          language: 'en',
                          text: 'None of the above'
                        },
                        {
                          language: 'es',
                          text: 'Ninguno de los anteriores'
                        },
                        {
                          language: 'ht',
                          text: 'Okenn nan sa ki anwo a'
                        }
                      ]
                    }
                  ]
                },
                stableId: 'NONE'
              },
              {
                exclusive: true,
                optionLabelTemplate: {
                  templateText: '$current_symptoms_prefer_not_answer',
                  templateType: 'TEXT',
                  variables: [
                    {
                      name: 'current_symptoms_prefer_not_answer',
                      translations: [
                        {
                          language: 'en',
                          text: 'I prefer not to answer'
                        },
                        {
                          language: 'es',
                          text: 'Prefiero no responder'
                        },
                        {
                          language: 'ht',
                          text: 'Mwen pito pa reponn'
                        }
                      ]
                    }
                  ]
                },
                stableId: 'PREFER_NOT_ANSWER'
              }
            ],
            promptTemplate: {
              templateText: '$current_symptoms_prompt',
              templateType: 'HTML',
              variables: [
                {
                  name: 'current_symptoms_prompt',
                  translations: [
                    {
                      language: 'en',
                      text: 'Do you currently have any of the following symptoms? (check all that apply)'
                    },
                    {
                      language: 'es',
                      text: '¿En la actualidad tiene alguno de los siguientes síntomas? (Marque todas las opciones que correspondan).'
                    },
                    {
                      language: 'ht',
                      text: 'Èske w gen nenpòt nan sentòm annapre la yo aktyèlman? (tcheke tout sa ki valab)'
                    }
                  ]
                }
              ]
            },
            questionType: 'PICKLIST',
            renderMode: 'LIST',
            selectMode: 'MULTIPLE',
            stableId: 'CURRENT_SYMPTOMS',
            validations: []
          },
          shownExpr: null
        },
        {
          blockType: 'QUESTION',
          question: {
            additionalInfoFooterTemplate: null,
            additionalInfoHeaderTemplate: null,
            groups: [],
            hideNumber: false,
            isDeprecated: false,
            isRestricted: false,
            picklistLabelTemplate: null,
            picklistOptions: [
              {
                optionLabelTemplate: {
                  templateText: '$past_symptoms_cough',
                  templateType: 'TEXT',
                  variables: [
                    {
                      name: 'past_symptoms_cough',
                      translations: [
                        {
                          language: 'en',
                          text: 'Cough'
                        },
                        {
                          language: 'es',
                          text: 'Tos'
                        },
                        {
                          language: 'ht',
                          text: 'Tous'
                        }
                      ]
                    }
                  ]
                },
                stableId: 'COUGH'
              },
              {
                optionLabelTemplate: {
                  templateText: '$past_symptoms_fever',
                  templateType: 'TEXT',
                  variables: [
                    {
                      name: 'past_symptoms_fever',
                      translations: [
                        {
                          language: 'en',
                          text: 'Fever'
                        },
                        {
                          language: 'es',
                          text: 'Fiebre'
                        },
                        {
                          language: 'ht',
                          text: 'Lafyèv'
                        }
                      ]
                    }
                  ]
                },
                stableId: 'FEVER'
              },
              {
                optionLabelTemplate: {
                  templateText: '$past_symptoms_sore_throat',
                  templateType: 'TEXT',
                  variables: [
                    {
                      name: 'past_symptoms_sore_throat',
                      translations: [
                        {
                          language: 'en',
                          text: 'Sore throat'
                        },
                        {
                          language: 'es',
                          text: 'Dolor de garganta'
                        },
                        {
                          language: 'ht',
                          text: 'Malgòj'
                        }
                      ]
                    }
                  ]
                },
                stableId: 'SORE_THROAT'
              },
              {
                optionLabelTemplate: {
                  templateText: '$past_symptoms_short_breath',
                  templateType: 'TEXT',
                  variables: [
                    {
                      name: 'past_symptoms_short_breath',
                      translations: [
                        {
                          language: 'en',
                          text: 'Shortness of breath or difficulty breathing'
                        },
                        {
                          language: 'es',
                          text: 'Falta de aire o dificultad para respirar'
                        },
                        {
                          language: 'ht',
                          text: 'Souf kout oswa difikilte pou respire'
                        }
                      ]
                    }
                  ]
                },
                stableId: 'SHORT_BREATH'
              },
              {
                optionLabelTemplate: {
                  templateText: '$past_symptoms_tight_chest',
                  templateType: 'TEXT',
                  variables: [
                    {
                      name: 'past_symptoms_tight_chest',
                      translations: [
                        {
                          language: 'en',
                          text: 'Chest tightness'
                        },
                        {
                          language: 'es',
                          text: 'Opresión en el pecho'
                        },
                        {
                          language: 'ht',
                          text: 'Pwatrin sere'
                        }
                      ]
                    }
                  ]
                },
                stableId: 'TIGHT_CHEST'
              },
              {
                optionLabelTemplate: {
                  templateText: '$past_symptoms_fatigue',
                  templateType: 'TEXT',
                  variables: [
                    {
                      name: 'past_symptoms_fatigue',
                      translations: [
                        {
                          language: 'en',
                          text: 'Fatigue'
                        },
                        {
                          language: 'es',
                          text: 'Cansancio'
                        },
                        {
                          language: 'ht',
                          text: 'Fatig'
                        }
                      ]
                    }
                  ]
                },
                stableId: 'FATIGUE'
              },
              {
                optionLabelTemplate: {
                  templateText: '$past_symptoms_muscle_ache',
                  templateType: 'TEXT',
                  variables: [
                    {
                      name: 'past_symptoms_muscle_ache',
                      translations: [
                        {
                          language: 'en',
                          text: 'Muscle aches'
                        },
                        {
                          language: 'es',
                          text: 'Dolores musculares'
                        },
                        {
                          language: 'ht',
                          text: 'Doulè nan misk'
                        }
                      ]
                    }
                  ]
                },
                stableId: 'MUSCLE_ACHE'
              },
              {
                optionLabelTemplate: {
                  templateText: '$past_symptoms_sensory_loss',
                  templateType: 'TEXT',
                  variables: [
                    {
                      name: 'past_symptoms_sensory_loss',
                      translations: [
                        {
                          language: 'en',
                          text: 'New loss of taste or smell'
                        },
                        {
                          language: 'es',
                          text: 'Pérdida del gusto o del olfato'
                        },
                        {
                          language: 'ht',
                          text: 'Vin pa ka pran gou oswa pran sant'
                        }
                      ]
                    }
                  ]
                },
                stableId: 'SENSORY_LOSS'
              },
              {
                optionLabelTemplate: {
                  templateText: '$past_symptoms_nausea',
                  templateType: 'TEXT',
                  variables: [
                    {
                      name: 'past_symptoms_nausea',
                      translations: [
                        {
                          language: 'en',
                          text: 'Nausea, vomiting, or diarrhea'
                        },
                        {
                          language: 'es',
                          text: 'Náuseas, vómitos o diarrea'
                        },
                        {
                          language: 'ht',
                          text: 'Kèplen, vomisman, oswa dyare'
                        }
                      ]
                    }
                  ]
                },
                stableId: 'NAUSEA'
              },
              {
                optionLabelTemplate: {
                  templateText: '$past_symptoms_congestion',
                  templateType: 'TEXT',
                  variables: [
                    {
                      name: 'past_symptoms_congestion',
                      translations: [
                        {
                          language: 'en',
                          text: 'Runny nose or congestion'
                        },
                        {
                          language: 'es',
                          text: 'Goteo nasal o congestión'
                        },
                        {
                          language: 'ht',
                          text: 'Nen k ap koule oswa konjesyon'
                        }
                      ]
                    }
                  ]
                },
                stableId: 'CONGESTION'
              },
              {
                optionLabelTemplate: {
                  templateText: '$past_symptoms_headache',
                  templateType: 'TEXT',
                  variables: [
                    {
                      name: 'past_symptoms_headache',
                      translations: [
                        {
                          language: 'en',
                          text: 'Headache'
                        },
                        {
                          language: 'es',
                          text: '[ES] Headache'
                        },
                        {
                          language: 'ht',
                          text: '[HT] Headache'
                        }
                      ]
                    }
                  ]
                },
                stableId: 'HEADACHE'
              },
              {
                optionLabelTemplate: {
                  templateText: '$past_symptoms_fainting',
                  templateType: 'TEXT',
                  variables: [
                    {
                      name: 'past_symptoms_fainting',
                      translations: [
                        {
                          language: 'en',
                          text: 'Fainting'
                        },
                        {
                          language: 'es',
                          text: 'Desmayos'
                        },
                        {
                          language: 'ht',
                          text: 'Endispozisyon'
                        }
                      ]
                    }
                  ]
                },
                stableId: 'FAINTING'
              },
              {
                optionLabelTemplate: {
                  templateText: '$past_symptoms_confusion',
                  templateType: 'TEXT',
                  variables: [
                    {
                      name: 'past_symptoms_confusion',
                      translations: [
                        {
                          language: 'en',
                          text: 'Unexplained episodes of confusion'
                        },
                        {
                          language: 'es',
                          text: 'Episodios de confusión sin causa aparente'
                        },
                        {
                          language: 'ht',
                          text: 'Epizòd konfizyon san esplikasyon'
                        }
                      ]
                    }
                  ]
                },
                stableId: 'CONFUSION'
              },
              {
                exclusive: true,
                optionLabelTemplate: {
                  templateText: '$past_symptoms_none',
                  templateType: 'TEXT',
                  variables: [
                    {
                      name: 'past_symptoms_none',
                      translations: [
                        {
                          language: 'en',
                          text: 'None of the above'
                        },
                        {
                          language: 'es',
                          text: 'Ninguno de los anteriores'
                        },
                        {
                          language: 'ht',
                          text: 'Okenn nan sa ki anwo a'
                        }
                      ]
                    }
                  ]
                },
                stableId: 'NONE'
              },
              {
                exclusive: true,
                optionLabelTemplate: {
                  templateText: '$past_symptoms_prefer_not_answer',
                  templateType: 'TEXT',
                  variables: [
                    {
                      name: 'past_symptoms_prefer_not_answer',
                      translations: [
                        {
                          language: 'en',
                          text: 'I prefer not to answer'
                        },
                        {
                          language: 'es',
                          text: 'Prefiero no responder'
                        },
                        {
                          language: 'ht',
                          text: 'Mwen pito pa reponn'
                        }
                      ]
                    }
                  ]
                },
                stableId: 'PREFER_NOT_ANSWER'
              }
            ],
            promptTemplate: {
              templateText: '$past_symptoms_prompt',
              templateType: 'HTML',
              variables: [
                {
                  name: 'past_symptoms_prompt',
                  translations: [
                    {
                      language: 'en',
                      text: 'In the past 4 weeks, have you had the following symptoms? (check all that apply)'
                    },
                    {
                      language: 'es',
                      text: 'En las últimas cuatro semanas, ¿tuvo los siguientes síntomas? (Marque todas las opciones que correspondan).'
                    },
                    {
                      language: 'ht',
                      text: 'Nan 4 semèn ki sot pase yo, èske w te gen sentòm annapre la yo? (tcheke tout sa ki valab)'
                    }
                  ]
                }
              ]
            },
            questionType: 'PICKLIST',
            renderMode: 'LIST',
            selectMode: 'MULTIPLE',
            stableId: 'PAST_SYMPTOMS',
            validations: []
          },
          shownExpr: null
        },
        {
          blockType: 'QUESTION',
          question: {
            additionalInfoFooterTemplate: null,
            additionalInfoHeaderTemplate: null,
            groups: [],
            hideNumber: false,
            isDeprecated: false,
            isRestricted: false,
            picklistLabelTemplate: null,
            picklistOptions: [
              {
                optionLabelTemplate: {
                  templateText: '$household_diagnosed_yes',
                  templateType: 'TEXT',
                  variables: [
                    {
                      name: 'household_diagnosed_yes',
                      translations: [
                        {
                          language: 'en',
                          text: 'Yes'
                        },
                        {
                          language: 'es',
                          text: 'Sí'
                        },
                        {
                          language: 'ht',
                          text: 'Wi'
                        }
                      ]
                    }
                  ]
                },
                stableId: 'YES'
              },
              {
                optionLabelTemplate: {
                  templateText: '$household_diagnosed_no',
                  templateType: 'TEXT',
                  variables: [
                    {
                      name: 'household_diagnosed_no',
                      translations: [
                        {
                          language: 'en',
                          text: 'No'
                        },
                        {
                          language: 'es',
                          text: 'No'
                        },
                        {
                          language: 'ht',
                          text: 'Non'
                        }
                      ]
                    }
                  ]
                },
                stableId: 'NO'
              },
              {
                optionLabelTemplate: {
                  templateText: '$household_diagnosed_dk',
                  templateType: 'TEXT',
                  variables: [
                    {
                      name: 'household_diagnosed_dk',
                      translations: [
                        {
                          language: 'en',
                          text: 'I don\'t know'
                        },
                        {
                          language: 'es',
                          text: 'No sé'
                        },
                        {
                          language: 'ht',
                          text: 'Mwen pa konnen'
                        }
                      ]
                    }
                  ]
                },
                stableId: 'DK'
              },
              {
                optionLabelTemplate: {
                  templateText: '$household_diagnosed_prefer_not_answer',
                  templateType: 'TEXT',
                  variables: [
                    {
                      name: 'household_diagnosed_prefer_not_answer',
                      translations: [
                        {
                          language: 'en',
                          text: 'I prefer not to answer'
                        },
                        {
                          language: 'es',
                          text: 'Prefiero no responder'
                        },
                        {
                          language: 'ht',
                          text: 'Mwen pito pa reponn'
                        }
                      ]
                    }
                  ]
                },
                stableId: 'PREFER_NOT_ANSWER'
              }
            ],
            promptTemplate: {
              templateText: '$household_diagnosed_prompt',
              templateType: 'HTML',
              variables: [
                {
                  name: 'household_diagnosed_prompt',
                  translations: [
                    {
                      language: 'en',
                      text: 'Has anyone that you live with been tested and diagnosed with COVID-19?'
                    },
                    {
                      language: 'es',
                      text: '¿Alguna de las personas que viven con usted se realizó una prueba de COVID-19 y obtuvo un diagnóstico positivo?'
                    },
                    {
                      language: 'ht',
                      text: 'Èske nenpòt moun w ap viv avèk li te fè tès epi te gen yon dyagnostik COVID-19?'
                    }
                  ]
                }
              ]
            },
            questionType: 'PICKLIST',
            renderMode: 'LIST',
            selectMode: 'SINGLE',
            stableId: 'HOUSEHOLD_DIAGNOSED',
            tooltipTemplate: {
              templateText: '$household_diagnosed_tip',
              templateType: 'TEXT',
              variables: [
                {
                  name: 'household_diagnosed_tip',
                  translations: [
                    {
                      language: 'en',
                      text: ' By "people you live with", we mean people of any age who live in the same household with you full time or part time, whether or not you are related to them.'
                    },
                    {
                      language: 'es',
                      text: 'Cuando decimos “personas que viven con usted”, nos referimos a personas de cualquier edad que compartan una vivienda con usted de forma permanente o temporal, independientemente de que sean parientes o no.'
                    },
                    {
                      language: 'ht',
                      text: 'Lè nou di "moun w ap viv avèk li", nou vle di moun nenpòt laj k ap viv nan menm kòkay avèk ou a plentan oswa a tan pasyèl, kit wi ou non moun lan se fanmi w.'
                    }
                  ]
                }
              ]
            },
            validations: []
          },
          shownExpr: null
        },
        {
          blockType: 'QUESTION',
          question: {
            additionalInfoFooterTemplate: null,
            additionalInfoHeaderTemplate: null,
            groups: [],
            hideNumber: false,
            isDeprecated: false,
            isRestricted: false,
            picklistLabelTemplate: null,
            picklistOptions: [
              {
                optionLabelTemplate: {
                  templateText: '$contact_diagnosed_yes',
                  templateType: 'TEXT',
                  variables: [
                    {
                      name: 'contact_diagnosed_yes',
                      translations: [
                        {
                          language: 'en',
                          text: 'Yes'
                        },
                        {
                          language: 'es',
                          text: 'Sí'
                        },
                        {
                          language: 'ht',
                          text: 'Wi'
                        }
                      ]
                    }
                  ]
                },
                stableId: 'YES'
              },
              {
                optionLabelTemplate: {
                  templateText: '$contact_diagnosed_no',
                  templateType: 'TEXT',
                  variables: [
                    {
                      name: 'contact_diagnosed_no',
                      translations: [
                        {
                          language: 'en',
                          text: 'No'
                        },
                        {
                          language: 'es',
                          text: 'No'
                        },
                        {
                          language: 'ht',
                          text: 'Non'
                        }
                      ]
                    }
                  ]
                },
                stableId: 'NO'
              },
              {
                optionLabelTemplate: {
                  templateText: '$contact_diagnosed_dk',
                  templateType: 'TEXT',
                  variables: [
                    {
                      name: 'contact_diagnosed_dk',
                      translations: [
                        {
                          language: 'en',
                          text: 'I don\'t know'
                        },
                        {
                          language: 'es',
                          text: 'No sé'
                        },
                        {
                          language: 'ht',
                          text: 'Mwen pa konnen'
                        }
                      ]
                    }
                  ]
                },
                stableId: 'DK'
              },
              {
                optionLabelTemplate: {
                  templateText: '$contact_diagnosed_prefer_not_answer',
                  templateType: 'TEXT',
                  variables: [
                    {
                      name: 'contact_diagnosed_prefer_not_answer',
                      translations: [
                        {
                          language: 'en',
                          text: 'I prefer not to answer'
                        },
                        {
                          language: 'es',
                          text: 'Prefiero no responder'
                        },
                        {
                          language: 'ht',
                          text: 'Mwen pito pa reponn'
                        }
                      ]
                    }
                  ]
                },
                stableId: 'PREFER_NOT_ANSWER'
              }
            ],
            promptTemplate: {
              templateText: '$contact_diagnosed_prompt',
              templateType: 'HTML',
              variables: [
                {
                  name: 'contact_diagnosed_prompt',
                  translations: [
                    {
                      language: 'en',
                      text: 'In the last 4 weeks, have you been in close contact with anyone with active COVID-19 infection (this means someone who had COVID-19 at the same time you were with them)?'
                    },
                    {
                      language: 'es',
                      text: 'En las últimas cuatro semanas, ¿estuvo en contacto cercano con alguien que tenga una infección de COVID-19 activa (es decir, alguna persona que tenía COVID-19 cuando usted estuvo con ella)?'
                    },
                    {
                      language: 'ht',
                      text: 'Nan 4 semèn ki sot pase yo, èske w te nan kontak pwòch avèk nenpòt moun ki gen enfeksyon COVID-19 aktif (sa vle di yon moun ki te gen COVID-19 nan moman ou te ansanm avèk li)?'
                    }
                  ]
                }
              ]
            },
            questionType: 'PICKLIST',
            renderMode: 'LIST',
            selectMode: 'SINGLE',
            stableId: 'CONTACT_DIAGNOSED',
            tooltipTemplate: {
              templateText: '$contact_diagnosed_tip',
              templateType: 'TEXT',
              variables: [
                {
                  name: 'contact_diagnosed_tip',
                  translations: [
                    {
                      language: 'en',
                      text: 'By "close contact", we mean anyone that you have come within 6 feet of for 15 minutes or more.'
                    },
                    {
                      language: 'es',
                      text: 'Cuando decimos “contacto cercano”, nos referimos a que estuvo con esa persona a menos de 6 pies de distancia durante 15 minutos o más.'
                    },
                    {
                      language: 'ht',
                      text: 'Lè nou di "kontak pwòch", nou vle di nenpòt moun ou te pwoche nan mwens ke 6 pye pandan 15 minit oswa plis.'
                    }
                  ]
                }
              ]
            },
            validations: []
          },
          shownExpr: null
        },
        {
          blockType: 'QUESTION',
          question: {
            additionalInfoFooterTemplate: null,
            additionalInfoHeaderTemplate: null,
            falseTemplate: {
              templateText: '$interested_continuing_no',
              templateType: 'TEXT',
              variables: [
                {
                  name: 'interested_continuing_no',
                  translations: [
                    {
                      language: 'en',
                      text: 'No'
                    },
                    {
                      language: 'es',
                      text: 'No'
                    },
                    {
                      language: 'ht',
                      text: 'Non'
                    }
                  ]
                }
              ]
            },
            hideNumber: false,
            isDeprecated: false,
            isRestricted: false,
            promptTemplate: {
              templateText: '$interested_continuing_prompt',
              templateType: 'HTML',
              variables: [
                {
                  name: 'interested_continuing_prompt',
                  translations: [
                    {
                      language: 'en',
                      text: 'Thank you. Would you be interested in continuing to be a part of this COVID-19 study for the next 5 months?'
                    },
                    {
                      language: 'es',
                      text: 'Gracias. ¿Le interesaría continuar participando en este estudio de COVID-19 durante los siguientes cinco meses?'
                    },
                    {
                      language: 'ht',
                      text: 'Mèsi. Èske w ta enterese kontinye patisipe nan etid COVID-19 sa a pandan 5 pwochen mwa yo?'
                    }
                  ]
                }
              ]
            },
            questionType: 'BOOLEAN',
            stableId: 'INTERESTED_CONTINUING',
            tooltipTemplate: {
              templateText: '$interested_continuing_tip',
              templateType: 'TEXT',
              variables: [
                {
                  name: 'interested_continuing_tip',
                  translations: [
                    {
                      language: 'en',
                      text: 'If you click yes, a member of the study team will contact you regarding next steps.'
                    },
                    {
                      language: 'es',
                      text: 'Si hace clic en “Sí”, un integrante del equipo del estudio se comunicará con usted para explicarle lo que debe hacer.'
                    },
                    {
                      language: 'ht',
                      text: 'Si w klike sou wi, yon manm nan ekip etid la pral kontakte w konsènan pwochen etap yo.'
                    }
                  ]
                }
              ]
            },
            trueTemplate: {
              templateText: '$interested_continuing_yes',
              templateType: 'TEXT',
              variables: [
                {
                  name: 'interested_continuing_yes',
                  translations: [
                    {
                      language: 'en',
                      text: 'Yes'
                    },
                    {
                      language: 'es',
                      text: 'Sí'
                    },
                    {
                      language: 'ht',
                      text: 'Wi'
                    }
                  ]
                }
              ]
            },
            validations: []
          },
          shownExpr: null
        }
      ],
      icons: [],
      nameTemplate: null
    }
  ],
  snapshotSubstitutionsOnSubmit: false,
  studyGuid: 'testboston',
  translatedDescriptions: [],
  translatedNames: [
    {
      language: 'en',
      text: 'Covid Survey'
    },
    {
      language: 'es',
      text: 'Encuesta sobre COVID-19'
    },
    {
      language: 'ht',
      text: 'Sondaj sou covid'
    }
  ],
  translatedSecondNames: [],
  translatedSubtitles: [],
  translatedSummaries: [],
  translatedTitles: [
    {
      language: 'en',
      text: '<span>Covid-19 Survey <span class="activity-header__text">Please tell us about your experience with COVID-19</span></span>'
    },
    {
      language: 'es',
      text: '<span>Encuesta sobre COVID-19 <span class="activity-header__text">Cuéntenos su experiencia con COVID-19</span></span>'
    },
    {
      language: 'ht',
      text: '<span>Sondaj covid-19 <span class="activity-header__text">Tanpri, pale nou de eksperyans ou avèk COVID-19</span></span>'
    }
  ],
  validations: [],
  versionTag: 'v1',
  writeOnce: false
};
