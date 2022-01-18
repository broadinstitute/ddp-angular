import { ConsentActivityDef } from '../model/core/consentActivityDef';

/* eslint-disable max-len*/
export const TestBostonConsent: ConsentActivityDef = {
  activityCode: 'CONSENT',
  activityType: 'FORMS',
  allowOndemandTrigger: false,
  allowUnauthenticated: false,
  closing: null,
  consentedExpr: '\n    user.studies["testboston"].forms["CONSENT"].questions["SELF_SIGNATURE"].answers.hasText()\n    || user.studies["testboston"].forms["CONSENT"].questions["STAFF_SIGNATURE"].answers.hasText()\n  ',
  creationExpr: null,
  displayOrder: 1,
  editTimeoutSec: null,
  elections: [
    {
      selectedExpr: 'user.studies["testboston"].forms["CONSENT"].questions["STORE_SAMPLE"].answers.hasTrue()',
      stableId: 'STORE_SAMPLE'
    }
  ],
  excludeFromDisplay: false,
  formType: 'CONSENT',
  introduction: null,
  lastUpdated: '2020-08-07T00:00:00',
  lastUpdatedTextTemplate: {
    templateText: '$tb_consent_last_updated',
    templateType: 'HTML',
    variables: [
      {
        name: 'tb_consent_last_updated',
        translations: [
          {
            language: 'en',
            text: 'TestBoston Version 4.0'
          },
          {
            language: 'es',
            text: 'TestBoston Versión 4.0'
          },
          {
            language: 'ht',
            text: 'TestBoston Vèsyon 4.0'
          }
        ]
      }
    ]
  },
  listStyleHint: 'NONE',
  mappings: [],
  maxInstancesPerUser: 1,
  readonlyHintTemplate: {
    templateText: '<p class="no-margin">$tb_consent_readonly_hint</p>',
    templateType: 'HTML',
    variables: [
      {
        name: 'tb_consent_readonly_hint',
        translations: [
          {
            language: 'en',
            text: 'Thank you for signing your consent form. If you would like to make any changes, please reach out to the study team.'
          },
          {
            language: 'es',
            text: 'Gracias por firmar el formulario de consentimiento. Si desea hacer alguna modificación, comuníquese con el equipo del estudio.'
          },
          {
            language: 'ht',
            text: 'Mèsi poutèt ou siyen fòmilè konsantman ou an. Si w ta renmen fè nenpòt chanjman, tanpri kontakte ekip etid la.'
          }
        ]
      }
    ]
  },
  sections: [
    {
      blocks: [
        {
          blockType: 'CONTENT',
          bodyTemplate: {
            templateText: '\n          <p>$tb_consent_s1_p1</p>\n          <p>$tb_consent_s1_p2</p>\n          <p>$tb_consent_s1_p3</p>\n          <p>$tb_consent_s1_p4</p>\n        ',
            templateType: 'HTML',
            variables: [
              {
                name: 'tb_consent_s1_p1',
                translations: [
                  {
                    language: 'en',
                    text: 'Please read this form carefully. It tells you important information about a research study. A member of our research team will also talk to you about taking part in this research study. People who agree to take part in research studies are called "subjects." This term will be used throughout this consent form.'
                  },
                  {
                    language: 'es',
                    text: 'Lea detenidamente este formulario. Allí encontrará información importante sobre un estudio de investigación. Además, un integrante de nuestro equipo de investigación le hablará sobre cómo participar en dicho estudio. Las personas que aceptan participar en estudios de investigación reciben el nombre de “participantes voluntarios” de investigación. Este término se utilizará a lo largo de todo el formulario de consentimiento.'
                  },
                  {
                    language: 'ht',
                    text: 'Tanpri li fòmilè sa a avèk anpil atansyon. Li ba w enfòmasyon enpòtan apwopo yon etid rechèch. Yon manm ekip rechèch nou a pral pale avèk ou tou sou patisipasyon w nan etid rechèch sa a. Yo rele moun ki aksepte patisipe nan etid rechèch yo "sijè". Nou pral itilize tèm sa a nan tout fòmilè konsantman sa a.'
                  }
                ]
              },
              {
                name: 'tb_consent_s1_p2',
                translations: [
                  {
                    language: 'en',
                    text: 'Partners HealthCare System is made up of Partners hospitals, health care providers, and researchers. In the rest of this consent form, we refer to the Partners system simply as "Partners."'
                  },
                  {
                    language: 'es',
                    text: 'Partners HealthCare System se compone de los hospitales, los profesionales sanitarios y los investigadores de Partners. En el resto del formulario de consentimiento, para referirnos al sistema de Partners diremos simplemente “Partners”.'
                  },
                  {
                    language: 'ht',
                    text: 'Sistèm Partners HealthCare gen ladan lopital, founisè swen sante, ak chèchè Partners yo. Nan rès la fòmilè konsantman sa a, nou rele sistèm Partners lan tou senpleman "Partners."'
                  }
                ]
              },
              {
                name: 'tb_consent_s1_p3',
                translations: [
                  {
                    language: 'en',
                    text: 'If you decide to take part in this research study, you must sign this form to show that you want to take part. We will give you a signed copy of this form to keep.'
                  },
                  {
                    language: 'es',
                    text: 'Si decide participar en el estudio de investigación, debe firmar este formulario para demostrar que desea formar parte del estudio. Le daremos una copia firmada de este formulario para que la guarde.'
                  },
                  {
                    language: 'ht',
                    text: 'Si w deside patisipe nan etid rechèch sa a, ou dwe siyen fòmilè sa a pou montre ou vle patisipe ladan. Nou pral ba w yon kopi fòmilè sa a ki siyen pou w konsève.'
                  }
                ]
              },
              {
                name: 'tb_consent_s1_p4',
                translations: [
                  {
                    language: 'en',
                    text: 'This study is being conducted by researchers at the Broad Institute of MIT and Harvard, a nonprofit research institute, and researchers at Brigham and Women\'s Hospital.'
                  },
                  {
                    language: 'es',
                    text: 'El estudio será llevado a cabo por investigadores de Broad Institute of MIT and Harvard, un instituto de investigación sin fines de lucro, y por investigadores de Brigham and Women\'s Hospital.'
                  },
                  {
                    language: 'ht',
                    text: 'Moun k ap dirije etid sa a se chèchè nan Broad Institute of MIT and Harvard, yon enstiti rechèch ki pa pou fè pwofi, epi chèchè nan Brigham and Women\'s Hospital.'
                  }
                ]
              }
            ]
          },
          titleTemplate: {
            templateText: '<h2>$tb_consent_s1_title</h2>',
            templateType: 'HTML',
            variables: [
              {
                name: 'tb_consent_s1_title',
                translations: [
                  {
                    language: 'en',
                    text: 'About this consent form'
                  },
                  {
                    language: 'es',
                    text: 'Información sobre este formulario de consentimiento'
                  },
                  {
                    language: 'ht',
                    text: 'Apwopo fòmilè konsantman sa a'
                  }
                ]
              }
            ]
          }
        }
      ],
      icons: [],
      nameTemplate: {
        templateText: '$tb_consent_s1_name',
        templateType: 'TEXT',
        variables: [
          {
            name: 'tb_consent_s1_name',
            translations: [
              {
                language: 'en',
                text: 'Introduction'
              },
              {
                language: 'es',
                text: 'Introducción'
              },
              {
                language: 'ht',
                text: 'Entwodiksyon'
              }
            ]
          }
        ]
      }
    },
    {
      blocks: [
        {
          blockType: 'CONTENT',
          bodyTemplate: {
            templateText: '\n          <p>$tb_consent_s2_p1</p>\n          <p>$tb_consent_s2_p2</p>\n        ',
            templateType: 'HTML',
            variables: [
              {
                name: 'tb_consent_s2_p1',
                translations: [
                  {
                    language: 'en',
                    text: 'Taking part in this research study is up to you. You can decide not to take part. If you decide to take part now, you can change your mind and drop out later. Your decision won\'t change the medical care you get within Partners now or in the future.'
                  },
                  {
                    language: 'es',
                    text: 'La decisión de participar en este estudio de investigación es suya. Puede optar por no participar. Si ahora decide participar, más adelante puede cambiar de opinión y abandonar el estudio. Su decisión no afectará la atención médica que reciba con Partners ahora ni más adelante.'
                  },
                  {
                    language: 'ht',
                    text: 'Patisipasyon nan etid rechèch sa a se nan men w li ye. Ou kapab deside pou w pa patisipe. Si w deside patisipe kounye a, ou ka chanje lide epi w abandone pita. Desizyon ou p ap chanje swen medikal ou jwenn nan Partners kounye a oswa pi devan.'
                  }
                ]
              },
              {
                name: 'tb_consent_s2_p2',
                translations: [
                  {
                    language: 'en',
                    text: 'The following key information is to help you decide whether or not to take part in this research study. We have included more details about the research in the Detailed Information section that follows the key information.'
                  },
                  {
                    language: 'es',
                    text: 'La siguiente información clave tiene el fin de ayudarle a decidir si desea participar en este estudio de investigación o no. Hemos incluido más detalles sobre la investigación en la sección Información detallada, que se encuentra después de la información clave.'
                  },
                  {
                    language: 'ht',
                    text: 'Enfòmasyon kle sa yo se pou ede w deside si wi ou non ou dwe patisipe nan etid rechèch sa a. Nou mete plis detay sou rechèch la nan seksyon enfòmasyon detaye ki apre enfòmasyon kle yo.'
                  }
                ]
              }
            ]
          },
          titleTemplate: {
            templateText: '<h2>$tb_consent_s2_title</h2>',
            templateType: 'HTML',
            variables: [
              {
                name: 'tb_consent_s2_title',
                translations: [
                  {
                    language: 'en',
                    text: 'Key Information'
                  },
                  {
                    language: 'es',
                    text: 'Información clave'
                  },
                  {
                    language: 'ht',
                    text: 'Enfòmasyon kle'
                  }
                ]
              }
            ]
          }
        },
        {
          blockType: 'CONTENT',
          bodyTemplate: {
            templateText: '<p>$tb_consent_s2_purpose_p1</p>',
            templateType: 'HTML',
            variables: [
              {
                name: 'tb_consent_s2_purpose_p1',
                translations: [
                  {
                    language: 'en',
                    text: 'In this research study we want to learn more about how many adults in Massachusetts have COVID-19. We want to know how common it is to get COVID-19 but not have symptoms. We will try to learn more about how to better estimate the infection rate. We will study how to track the infection rate and how to respond if there are new outbreaks of COVID-19 in the coming months. We also want to understand whether people who get COVID-19 are less likely to get it again a second time. This study will also develop a good system for implementing at-home COVID-19 testing so that large numbers of people can be tested.'
                  },
                  {
                    language: 'es',
                    text: 'En este estudio nos proponemos averiguar más sobre la cantidad de adultos de Massachusetts que tienen COVID-19. Queremos saber qué tan habitual es que la población se contagie de COVID-19 y no presente síntomas. Trataremos de averiguar más sobre cómo calcular mejor la tasa de infección. Estudiaremos cómo hacer un seguimiento de la tasa de infección y qué hacer si hay nuevos brotes de COVID-19 en los próximos meses. También queremos saber si las personas que se contagian de COVID-19 tienen menos probabilidades de contagiarse por segunda vez. En este estudio también se desarrollará un sistema aceptable para implementar pruebas de detección de COVID-19 en el hogar, de modo que sea posible analizar a una gran cantidad de personas.'
                  },
                  {
                    language: 'ht',
                    text: 'Nan etid rechèch sa a nou vle aprann plis sou kantite granmoun nan Massachusetts ki gen COVID-19. Nou vle konnen nan ki pwen li komen pou trape COVID-19 san w pa gen okenn sentòm. Nou pral eseye aprann plis fason pou fè yon meyè estimasyon to enfeksyon an. Nou pral etidye fason pou suiv pousantaj enfeksyon yo ak fason pou reyaji si gen nouvo epidemi COVID-19 nan mwa k ap vini yo. Nou vle konprann tou si moun ki trape COVID-19 gen mwens chans pou yo genyen li ankò yon dezyèm fwa. Etid sa a ap devlope tou yon bon sistèm pou mete an plas tès pou COVID-19 nan kay dekwa pou yo kapab teste yon gwo kantite moun.'
                  }
                ]
              }
            ]
          },
          titleTemplate: {
            templateText: '<h3>$tb_consent_s2_purpose_title</h3>',
            templateType: 'HTML',
            variables: [
              {
                name: 'tb_consent_s2_purpose_title',
                translations: [
                  {
                    language: 'en',
                    text: 'Why is this research study being done?'
                  },
                  {
                    language: 'es',
                    text: '¿Por qué se realiza este estudio de investigación?'
                  },
                  {
                    language: 'ht',
                    text: 'Poukisa y ap fè etid rechèch sa a?'
                  }
                ]
              }
            ]
          }
        },
        {
          blockType: 'CONTENT',
          bodyTemplate: {
            templateText: '<p>$tb_consent_s2_timing_p1</p>',
            templateType: 'HTML',
            variables: [
              {
                name: 'tb_consent_s2_timing_p1',
                translations: [
                  {
                    language: 'en',
                    text: 'If you decide to join this research study, it will take you about <strong>6 months</strong> to complete the study. During your study participation, we will not ask you to make any study visits to Brigham and Women\'s Hospital.'
                  },
                  {
                    language: 'es',
                    text: 'Si decide incorporarse a este estudio de investigación, le llevará <strong>6 meses</strong> realizarlo en su totalidad. [ES: During your study participation, we will not ask you to make any study visits to Brigham and Women\'s Hospital.]'
                  },
                  {
                    language: 'ht',
                    text: 'Si w deside antre nan etid rechèch sa a, ou pral bezwen apeprè <strong>6 mwa</strong> pou w fini etid la. [HT: During your study participation, we will not ask you to make any study visits to Brigham and Women\'s Hospital.]'
                  }
                ]
              }
            ]
          },
          titleTemplate: {
            templateText: '<h3>$tb_consent_s2_timing_title</h3>',
            templateType: 'HTML',
            variables: [
              {
                name: 'tb_consent_s2_timing_title',
                translations: [
                  {
                    language: 'en',
                    text: 'How long will you take part in this research study?'
                  },
                  {
                    language: 'es',
                    text: '¿Cuánto tiempo participará en este estudio de investigación?'
                  },
                  {
                    language: 'ht',
                    text: 'Ki kantite tan ou pral patisipe nan etid rechèch sa a?'
                  }
                ]
              }
            ]
          }
        },
        {
          blockType: 'CONTENT',
          bodyTemplate: {
            templateText: '\n          <p>$tb_consent_s2_expect_p1</p>\n          <p>$tb_consent_s2_expect_p2</p>\n          <p>$tb_consent_s2_expect_p3</p>\n        ',
            templateType: 'HTML',
            variables: [
              {
                name: 'tb_consent_s2_expect_p1',
                translations: [
                  {
                    language: 'en',
                    text: 'If you decide to join this research study, the following things will happen.'
                  },
                  {
                    language: 'es',
                    text: 'Si decide incorporarse a este estudio de investigación, sucederá lo siguiente.'
                  },
                  {
                    language: 'ht',
                    text: 'Si w deside antre nan etid rechèch sa a, bagay annapre la yo pral rive.'
                  }
                ]
              },
              {
                name: 'tb_consent_s2_expect_p2',
                translations: [
                  {
                    language: 'en',
                    text: 'We will ask you to answer a few questions which include how you have recently been feeling and your recent medical history. We will send you an at-home COVID-19 test kit with instructions and a pre-paid return packet. We will ask you to collect 2 samples: a sample from inside your nose and a sample of blood from your finger. These samples will then be shipped back to the Broad Institute in Cambridge, MA in a return packet so that we can test them to see if there is evidence of active COVID-19 virus and/or a positive antibody. After the first month, if you choose to be contacted again, we will send you a COVID-19 test kit monthly and ask you to complete a short health questionnaire for the subsequent 5 months. If you start to feel sick with COVID-19 symptoms at any time during the study, you can request an immediate test.'
                  },
                  {
                    language: 'es',
                    text: 'Le pediremos que responda algunas preguntas, por ejemplo, cómo se ha sentido últimamente. También solicitaremos sus antecedentes médicos recientes. Le enviaremos un kit de pruebas de detección de COVID-19 en el hogar con instrucciones y un sobre con porte prepagado para devolverlas. Le solicitaremos que tome dos muestras: una del interior de la nariz y una muestra de sangre de un dedo. Luego, esas muestras se deben enviar en el sobre provisto a Broad Institute (Cambridge, MA) para que podamos analizarlas y determinar si hay indicios de un virus activo de COVID-19 o de un anticuerpo positivo. [ES: After the first month, if you choose to be contacted again, we will send you a COVID-19 test kit monthly and ask you to complete a short health questionnaire for the subsequent 5 months. If you start to feel sick with COVID-19 symptoms at any time during the study, you can request an immediate test.]'
                  },
                  {
                    language: 'ht',
                    text: 'Nou pral mande pou w reponn kèk kesyon ki gen ladan fason ou santi w ye dènyèman ak istorik medikal resan ou an. Nou pral voye pou ou yon kit tès pou COVID-19 pou fè lakay ou avèk machasuiv epi yon pakè retou ki tou peye. Nou pral mande pou w pran 2 echantiyon: yon echantiyon nan andedan nen w ak yon echantiyon san nan dwèt ou. Apre sa, ou pral voye echantiyon sa yo tounen nan Broad Institute nan Cambridge, MA nan yon pake retou pou nou ka teste yo pou wè si gen prèv viris COVID-19 aktif ak/oswa yon antikò pozitif. [HT: After the first month, if you choose to be contacted again, we will send you a COVID-19 test kit monthly and ask you to complete a short health questionnaire for the subsequent 5 months. If you start to feel sick with COVID-19 symptoms at any time during the study, you can request an immediate test.]'
                  }
                ]
              },
              {
                name: 'tb_consent_s2_expect_p3',
                translations: [
                  {
                    language: 'en',
                    text: 'We will also review your medical records.'
                  },
                  {
                    language: 'es',
                    text: '[ES: We will also review your medical records.]'
                  },
                  {
                    language: 'ht',
                    text: '[HT: We will also review your medical records.]'
                  }
                ]
              }
            ]
          },
          titleTemplate: {
            templateText: '<h3>$tb_consent_s2_expect_title</h3>',
            templateType: 'HTML',
            variables: [
              {
                name: 'tb_consent_s2_expect_title',
                translations: [
                  {
                    language: 'en',
                    text: 'What will happen if you take part in this research study?'
                  },
                  {
                    language: 'es',
                    text: '¿Qué sucederá si participa en este estudio de investigación?'
                  },
                  {
                    language: 'ht',
                    text: 'Kisa ki pral rive si w patisipe nan etid rechèch sa a?'
                  }
                ]
              }
            ]
          }
        },
        {
          blockType: 'CONTENT',
          bodyTemplate: {
            templateText: '<p>$tb_consent_s2_choose_p1</p>',
            templateType: 'HTML',
            variables: [
              {
                name: 'tb_consent_s2_choose_p1',
                translations: [
                  {
                    language: 'en',
                    text: 'While you may not directly benefit from participating in this study, others with and without COVID-19 may benefit in the future from what we learn in this study.'
                  },
                  {
                    language: 'es',
                    text: 'Si bien es probable que usted no obtenga ningún beneficio directo por participar en este estudio, más adelante otras personas con y sin COVID-19 podrían sacarle provecho a la información que reunamos.'
                  },
                  {
                    language: 'ht',
                    text: 'Byenke ou gendwa pa benefisye dirèkteman nan patisipasyon w nan etid sa a, lòt moun ki gen COVID-19 ak moun ki pa genyen l ka benefisye alavni nan sa nou aprann nan etid sa a.'
                  }
                ]
              }
            ]
          },
          titleTemplate: {
            templateText: '<h3>$tb_consent_s2_choose_title</h3>',
            templateType: 'HTML',
            variables: [
              {
                name: 'tb_consent_s2_choose_title',
                translations: [
                  {
                    language: 'en',
                    text: 'Why might you choose to take part in this study?'
                  },
                  {
                    language: 'es',
                    text: '¿Por qué optaría por participar en este estudio?'
                  },
                  {
                    language: 'ht',
                    text: 'Poukisa ou ta ka chwazi pou w patisipe nan etid sa a?'
                  }
                ]
              }
            ]
          }
        },
        {
          blockType: 'CONTENT',
          bodyTemplate: {
            templateText: '\n          <p>$tb_consent_s2_not_choose_p1</p>\n          <p>$tb_consent_s2_not_choose_p2</p>\n          <p>$tb_consent_s2_not_choose_p3</p>\n        ',
            templateType: 'HTML',
            variables: [
              {
                name: 'tb_consent_s2_not_choose_p1',
                translations: [
                  {
                    language: 'en',
                    text: 'Taking part in this research study has some minimal risks that you should consider carefully.'
                  },
                  {
                    language: 'es',
                    text: 'La participación en este estudio de investigación conlleva algunos riesgos mínimos que debe analizar seriamente.'
                  },
                  {
                    language: 'ht',
                    text: 'Patisipasyon nan etid rechèch sa a gen kèk risk minim ou ta dwe konsidere ak anpil atansyon.'
                  }
                ]
              },
              {
                name: 'tb_consent_s2_not_choose_p2',
                translations: [
                  {
                    language: 'en',
                    text: 'Important risks and possible discomforts to know about include discomfort from collecting your own specimen. There may be some physical discomfort when the nasal swab or blood is collected. There is a small chance that you will develop a bruise, feel lightheaded, faint, or develop an infection at the site. There is a low risk of loss of confidentiality. We will take additional measures to protect your privacy.'
                  },
                  {
                    language: 'es',
                    text: 'Entre los riesgos importantes y las posibles molestias que debe tener en cuenta se encuentran las molestias causadas al recolectar su propia muestra. Quizás sienta algunas molestias físicas al realizar el hisopado nasal o tomar la muestra de sangre. Existe una leve posibilidad de que le salga un moretón, sienta un ligero mareo, se desmaye o desarrolle una infección en el lugar del pinchazo. [ES: There is a low risk of loss of confidentiality. We will take additional measures to protect your privacy.]'
                  },
                  {
                    language: 'ht',
                    text: 'Risk ki enpòtan ak malalèz ki posib pou ou konnen gen ladan malèz lè w ap pran pwòp echantiyon pa w. Gendwa gen kèk malèz fizik lè w pran echantiyon an avèk aplikatè nazal la oswa nan priz san an. Gen yon ti chans pou ou vin gen vyann mètri, santi ou toudi, endispoze, oswa devlope yon enfeksyon nan anplasman an. [HT: There is a low risk of loss of confidentiality. We will take additional measures to protect your privacy.]'
                  }
                ]
              },
              {
                name: 'tb_consent_s2_not_choose_p3',
                translations: [
                  {
                    language: 'en',
                    text: 'A detailed description of side effects, risks, and possible discomforts can be found later in this consent form in the section called “What are the risks and possible discomforts from being in this research study?”'
                  },
                  {
                    language: 'es',
                    text: '[ES: A detailed description of side effects, risks, and possible discomforts can be found later in this consent form in the section called “What are the risks and possible discomforts from being in this research study?”]'
                  },
                  {
                    language: 'ht',
                    text: '[HT: A detailed description of side effects, risks, and possible discomforts can be found later in this consent form in the section called “What are the risks and possible discomforts from being in this research study?”]'
                  }
                ]
              }
            ]
          },
          titleTemplate: {
            templateText: '<h3>$tb_consent_s2_not_choose_title</h3>',
            templateType: 'HTML',
            variables: [
              {
                name: 'tb_consent_s2_not_choose_title',
                translations: [
                  {
                    language: 'en',
                    text: 'Why might you choose NOT to take part in this study?'
                  },
                  {
                    language: 'es',
                    text: '¿Por qué optaría por NO participar en este estudio?'
                  },
                  {
                    language: 'ht',
                    text: 'Poukisa ou ta ka chwazi pou w PA patisipe nan etid sa a?'
                  }
                ]
              }
            ]
          }
        },
        {
          blockType: 'CONTENT',
          bodyTemplate: {
            templateText: '<p>$tb_consent_s2_treatment_p1</p>',
            templateType: 'HTML',
            variables: [
              {
                name: 'tb_consent_s2_treatment_p1',
                translations: [
                  {
                    language: 'en',
                    text: 'You do not need to participate in this study in order to be tested for COVID-19. If you are experiencing symptoms of COVID-19 or believe you have been exposed to COVID-19, you may be able to get tested at a clinic by asking your doctor to order a test for you.'
                  },
                  {
                    language: 'es',
                    text: 'No es necesario que participe en este estudio para que le hagan la prueba de detección de COVID-19. Si tiene síntomas de COVID-19 o cree que ha estado en contacto con esa enfermedad, quizás pueda realizarse una prueba de detección en una clínica si le pide a su médico que la solicite.'
                  },
                  {
                    language: 'ht',
                    text: 'Ou pa oblije patisipe nan etid sa a pou w fè tès pou COVID-19. Si w gen sentòm COVID-19 oswa ou kwè ou te ekspoze nan COVID-19, ou ka anmezi pou fè tès nan yon klinik si w mande doktè k ap suiv ou a preskri yon tès pou ou.'
                  }
                ]
              }
            ]
          },
          titleTemplate: {
            templateText: '<h3>$tb_consent_s2_treatment_title</h3>',
            templateType: 'HTML',
            variables: [
              {
                name: 'tb_consent_s2_treatment_title',
                translations: [
                  {
                    language: 'en',
                    text: 'What other treatments or procedures are available for your condition?'
                  },
                  {
                    language: 'es',
                    text: '¿Qué otros tratamientos o procedimientos tiene a su disposición para su enfermedad?'
                  },
                  {
                    language: 'ht',
                    text: 'Ki lòt tretman oswa pwosedi ki disponib pou pwoblèm ou an?'
                  }
                ]
              }
            ]
          }
        },
        {
          blockType: 'CONTENT',
          bodyTemplate: {
            templateText: '\n          <p>$tb_consent_s2_contact_p1</p>\n          <p>$tb_consent_s2_contact_p2</p>\n          <p>$tb_consent_s2_contact_p3</p>\n          <p>$tb_consent_s2_contact_p4</p>\n          <ul>\n            <li>$tb_consent_s2_contact_item1</li>\n            <li>$tb_consent_s2_contact_item2</li>\n            <li>$tb_consent_s2_contact_item3</li>\n            <li>$tb_consent_s2_contact_item4</li>\n          </ul>\n        ',
            templateType: 'HTML',
            variables: [
              {
                name: 'tb_consent_s2_contact_p1',
                translations: [
                  {
                    language: 'en',
                    text: 'You can call us or email the study email address <a class="Link Link_semi-bold" href="mailto:info@testboston.org">info@testboston.org</a> with any questions or concerns you may have.'
                  },
                  {
                    language: 'es',
                    text: 'Puede llamarnos o enviar un mensaje a la dirección de correo electrónico del estudio (<a class="Link Link_semi-bold" href="mailto:info@testboston.org">info@testboston.org</a>) para plantear cualquier pregunta o duda que tenga.'
                  },
                  {
                    language: 'ht',
                    text: 'Ou kapab rele nou oswa voye yon imèl bay adrès imèl etid la <a class="Link Link_semi-bold" href="mailto:info@testboston.org">info@testboston.org</a> pou nenpòt enkyetid oswa kesyon ou ta renmen poze.'
                  }
                ]
              },
              {
                name: 'tb_consent_s2_contact_p2',
                translations: [
                  {
                    language: 'en',
                    text: 'If you have questions about the study, please contact the research investigators, Dr. Ann Woolley and Dr. Lisa Cosimi at <a class="Link Link_semi-bold" href="tel:617-525-4220">617-525-4220</a> during the weekdays between 9-5pm. You can also call Brigham and Women\'s Hospital ask for them to be paged 24/7: <a class="Link Link_semi-bold" href="tel:617-732-5700">617-732-5700</a>, pager #26276 for Dr. Woolley and pager #21519 for Dr. Cosimi.'
                  },
                  {
                    language: 'es',
                    text: 'Si tiene alguna pregunta sobre el estudio, comuníquese con las investigadoras del estudio, la Dra. Ann Woolley y la Dra. Lisa Cosimi. Para ello, llame al <a class="Link Link_semi-bold" href="tel:617-525-4220">617-525-4220</a> de lunes a viernes entre las 9 a. m. y las 5 p. m. También puede llamar a Brigham and Women\'s Hospital todos los días, las 24 horas, y pedir que les avisen por el buscapersonas: <a class="Link Link_semi-bold" href="tel:617-732-5700">617-732-5700</a>, buscapersonas 26276 (Dra. Woolley) y buscapersonas 21519 (Dra. Cosimi).'
                  },
                  {
                    language: 'ht',
                    text: 'Si w gen kesyon sou etid la, tanpri kontakte chèchè rechèch la, Doktè Ann Woolley ak Doktè Lisa Cosimi nan <a class="Link Link_semi-bold" href="tel:617-525-4220">617-525-4220</a> pandan jou lasemèn yo ant 9-5 pm. Ou ka rele Brigham and Women\'s Hospital tou, lajounen kou lannuit, pou w mande lopital la rele yo nan pedjè: <a class="Link Link_semi-bold" href="tel:617-732-5700">617-732-5700</a>, pedjè #26276 pou Doktè Woolley ak pedjè #21519 pou Doktè Cosimi.'
                  }
                ]
              },
              {
                name: 'tb_consent_s2_contact_p3',
                translations: [
                  {
                    language: 'en',
                    text: 'If you want to speak with someone not directly involved in this research study, please contact the Partners Human Research Committee office. You can call them at <a class="Link Link_semi-bold" href="tel:857-282-1900">857-282-1900</a>.'
                  },
                  {
                    language: 'es',
                    text: 'Si desea hablar con una persona que no esté directamente relacionada con este estudio de investigación, comuníquese con la oficina del Comité de Investigaciones en Seres Humanos de Partners. Puede llamar al <a class="Link Link_semi-bold" href="tel:857-282-1900">857-282-1900</a>.'
                  },
                  {
                    language: 'ht',
                    text: 'Si w vle pale ak yon moun ki pa patisipe dirèkteman nan etid rechèch sa a, tanpri kontakte biwo Partners Human Research Committee. Ou kapab rele yo nan <a class="Link Link_semi-bold" href="tel:857-282-1900">857-282-1900</a>.'
                  }
                ]
              },
              {
                name: 'tb_consent_s2_contact_p4',
                translations: [
                  {
                    language: 'en',
                    text: 'You can talk to them about:'
                  },
                  {
                    language: 'es',
                    text: 'Puede hablar sobre lo siguiente:'
                  },
                  {
                    language: 'ht',
                    text: 'Ou kapab pale avèk yo osijè:'
                  }
                ]
              },
              {
                name: 'tb_consent_s2_contact_item1',
                translations: [
                  {
                    language: 'en',
                    text: 'Your rights as a research subject'
                  },
                  {
                    language: 'es',
                    text: 'Sus derechos como participante voluntario en la investigación'
                  },
                  {
                    language: 'ht',
                    text: 'Dwa ou genyen antanke sijè nan yon rechèch'
                  }
                ]
              },
              {
                name: 'tb_consent_s2_contact_item2',
                translations: [
                  {
                    language: 'en',
                    text: 'Your concerns about the research'
                  },
                  {
                    language: 'es',
                    text: 'Sus dudas sobre la investigación'
                  },
                  {
                    language: 'ht',
                    text: 'Enkyetid ou yo konsènan rechèch la'
                  }
                ]
              },
              {
                name: 'tb_consent_s2_contact_item3',
                translations: [
                  {
                    language: 'en',
                    text: 'A complaint about the research'
                  },
                  {
                    language: 'es',
                    text: 'Cualquier queja que tenga sobre la investigación'
                  },
                  {
                    language: 'ht',
                    text: 'Yon plent konsènan rechèch la'
                  }
                ]
              },
              {
                name: 'tb_consent_s2_contact_item4',
                translations: [
                  {
                    language: 'en',
                    text: 'Any pressure to take part in, or to continue in the research study'
                  },
                  {
                    language: 'es',
                    text: 'Si alguien lo/la ha presionado para que participara o continuara participando en el estudio de investigación'
                  },
                  {
                    language: 'ht',
                    text: 'Nenpòt presyon pou w patisipe ladan, oswa pou w kontinye patisipe nan etid rechèch la'
                  }
                ]
              }
            ]
          },
          titleTemplate: {
            templateText: '<h3>$tb_consent_s2_contact_title</h3>',
            templateType: 'HTML',
            variables: [
              {
                name: 'tb_consent_s2_contact_title',
                translations: [
                  {
                    language: 'en',
                    text: 'If you have questions or concerns about this research study, whom can you call?'
                  },
                  {
                    language: 'es',
                    text: 'Si tiene alguna pregunta o duda sobre este estudio de investigación, ¿a quién puede llamar?'
                  },
                  {
                    language: 'ht',
                    text: 'Si w gen kesyon oswa enkyetid apwopo etid rechèch sa a, kimoun ou kapab rele?'
                  }
                ]
              }
            ]
          }
        }
      ],
      icons: [],
      nameTemplate: {
        templateText: '$tb_consent_s2_name',
        templateType: 'TEXT',
        variables: [
          {
            name: 'tb_consent_s2_name',
            translations: [
              {
                language: 'en',
                text: 'Key Information'
              },
              {
                language: 'es',
                text: 'Información clave'
              },
              {
                language: 'ht',
                text: 'Enfòmasyon kle'
              }
            ]
          }
        ]
      }
    },
    {
      blocks: [
        {
          blockType: 'CONTENT',
          bodyTemplate: {
            templateText: '<h2>$tb_consent_s3_title</h2>',
            templateType: 'HTML',
            variables: [
              {
                name: 'tb_consent_s3_title',
                translations: [
                  {
                    language: 'en',
                    text: 'Detailed Information'
                  },
                  {
                    language: 'es',
                    text: 'Información detallada'
                  },
                  {
                    language: 'ht',
                    text: 'Enfòmasyon detaye'
                  }
                ]
              }
            ]
          },
          titleTemplate: null
        },
        {
          blockType: 'CONTENT',
          bodyTemplate: {
            templateText: '\n          <p>$tb_consent_s3_purpose_p1</p>\n          <p>$tb_consent_s3_purpose_p2</p>\n          <p>$tb_consent_s3_purpose_p3</p>\n        ',
            templateType: 'HTML',
            variables: [
              {
                name: 'tb_consent_s3_purpose_p1',
                translations: [
                  {
                    language: 'en',
                    text: 'We are doing this research to learn more about how many adults in Massachusetts have COVID-19.'
                  },
                  {
                    language: 'es',
                    text: 'Realizamos este estudio para averiguar más sobre la cantidad de adultos de Massachusetts que tienen COVID-19.'
                  },
                  {
                    language: 'ht',
                    text: 'N ap fè etid rechèch sa a pou n aprann plis sou kantite granmoun nan Massachusetts ki gen COVID-19.'
                  }
                ]
              },
              {
                name: 'tb_consent_s3_purpose_p2',
                translations: [
                  {
                    language: 'en',
                    text: 'We want to understand the risk of SARS-CoV-2 (the virus that causes COVID-19) infection amongst different people who receive some medical care at Brigham and Women\'s Hospital and who live in the greater Boston area. We also want to understand who gets infected without developing symptoms and who is more likely to experience more serious disease. We will do this by testing your blood for antibodies against SARS-CoV-2 and testing a self-collected sample from your nose for active SARS-CoV-2 virus and by asking you questions about yourself, your risks for infection, and your symptoms. This information will be used to carry out more targeted infection control activities both during the current outbreak and in future outbreaks. It will also be used to understand how our bodies fight infection and if we can be infected more than once.'
                  },
                  {
                    language: 'es',
                    text: 'Queremos conocer el riesgo de infección de SARS-CoV-2 (el virus causante de la COVID-19) en diferentes personas que reciben atención médica en Brigham and Women\'s Hospital y que viven en la región metropolitana de Boston. También queremos saber quiénes se infectan sin presentar síntomas y quiénes tienen más probabilidades de desarrollar casos más graves de la enfermedad. Para hacerlo, realizaremos análisis de sangre para detectar anticuerpos contra el SARS-CoV-2. También analizaremos las muestras que usted se tome de la nariz para detectar si tiene una infección activa de virus SARS-CoV-2, y le haremos preguntas sobre usted, sus riesgos de infección y sus síntomas. Esa información se utilizará para llevar a cabo actividades de control de la infección más específicas, tanto durante el brote actual como en otros futuros. También se empleará para estudiar cómo combate la infección nuestro organismo y si podemos infectarnos más de una vez.'
                  },
                  {
                    language: 'ht',
                    text: 'Nou vle konprann risk ki genyen pou enfeksyon SARS-CoV-2 (viris ki lakòz COVID-19 lan) pami moun diferan ki resevwa sèten swen medikal nan Brigham and Women\'s Hospital epi k ap viv nan gran rejyon Boston lan. Epitou nou vle konprann kimoun ki enfekte san yo pa vin gen sentòm ak kimoun ki gen plis risk pou yo vin gen maladi pi grav. Pou fè sa, nou pral teste san w pou antikò kont SARS-CoV-2 epi teste yon echantiyon ou pran pou kont ou nan nen w pou wè si gen SARS-CoV-2 viris aktif, epi nou pral poze w kesyon sou tèt ou, risk ou pou w gen enfeksyon, ak sentòm ou yo. Nou pral itilize enfòmasyon sa yo pou reyalize aktivite kontwòl enfeksyon ki plis sible ni pandan epidemi kounye a ni nan epidemi pi devan yo. Nou pral itilize yo tou pou konprann kijan kò nou konbat enfeksyon ak si nou kapab enfekte plis pase yon sèl fwa.'
                  }
                ]
              },
              {
                name: 'tb_consent_s3_purpose_p3',
                translations: [
                  {
                    language: 'en',
                    text: 'This study will develop a model for implementing at-home COVID-19 testing so that it can be used to test large numbers of people and minimize the need for people to have to come to clinics, emergency rooms, or other testing sites. We will study how to track the infection rate so that we can respond if there are new outbreaks of COVID-19 in the coming months.'
                  },
                  {
                    language: 'es',
                    text: 'En este estudio se elaborará un modelo para implementar pruebas de detección de COVID-19 en el hogar que puedan usar gran cantidad de personas y reducir al mínimo la necesidad de que la gente acuda a clínicas, servicios de urgencia y otros centros de detección. Estudiaremos cómo hacer un seguimiento de la tasa de infección para que podamos actuar si hay nuevos brotes de COVID-19 en los próximos meses.'
                  },
                  {
                    language: 'ht',
                    text: 'Etid sa a pral devlope yon modèl pou mete an plas tès pou COVID-19 lakay pou li kapab itilize pou teste yon gwo kantite moun epi pou diminye nesesite pou moun vini nan klinik, sèvis dijans, oswa lòt sant pou tès. Nou pral etidye fason pou suiv pousantaj enfeksyon yo dekwa pou nou ka reyaji si gen nouvo epidemi COVID-19 nan mwa k ap vini yo.'
                  }
                ]
              }
            ]
          },
          titleTemplate: {
            templateText: '<h3>$tb_consent_s3_purpose_title</h3>',
            templateType: 'HTML',
            variables: [
              {
                name: 'tb_consent_s3_purpose_title',
                translations: [
                  {
                    language: 'en',
                    text: 'Why is this research study being done?'
                  },
                  {
                    language: 'es',
                    text: '¿Por qué se realiza este estudio de investigación?'
                  },
                  {
                    language: 'ht',
                    text: 'Poukisa y ap fè etid rechèch sa a?'
                  }
                ]
              }
            ]
          }
        },
        {
          blockType: 'CONTENT',
          bodyTemplate: {
            templateText: '\n          <p>$tb_consent_s3_who_p1</p>\n          <p>$tb_consent_s3_who_p2</p>\n          <p>$tb_consent_s3_who_p3</p>\n        ',
            templateType: 'HTML',
            variables: [
              {
                name: 'tb_consent_s3_who_p1',
                translations: [
                  {
                    language: 'en',
                    text: 'We are asking you to take part in this research study because you are an adult who has received medical care at Brigham and Women\'s Hospital within the past 12 months.'
                  },
                  {
                    language: 'es',
                    text: 'Le pedimos que participe en este estudio de investigación porque es una persona adulta que ha recibido atención médica en Brigham and Women\'s Hospital en los últimos doce meses.'
                  },
                  {
                    language: 'ht',
                    text: 'Nou mande ou pou patisipe nan etid rechèch sa a paske ou se yon granmoun ki te resevwa swen medikal nan Brigham and Women\'s Hospital nan 12 mwa ki sot pase yo.'
                  }
                ]
              },
              {
                name: 'tb_consent_s3_who_p2',
                translations: [
                  {
                    language: 'en',
                    text: 'About 10,000 people who have had care at Brigham and Women\'s Hospital will take part in this research study.'
                  },
                  {
                    language: 'es',
                    text: 'Alrededor de diez mil personas que recibieron atención médica en Brigham and Women\'s Hospital participarán en este estudio de investigación.'
                  },
                  {
                    language: 'ht',
                    text: 'Apeprè 10 000 moun ki te resevwa swen nan Brigham and Women\'s Hospital pral patisipe nan etid rechèch sa a.'
                  }
                ]
              },
              {
                name: 'tb_consent_s3_who_p3',
                translations: [
                  {
                    language: 'en',
                    text: 'Brigham and Women’s Hospital is paying for this research to be done.'
                  },
                  {
                    language: 'es',
                    text: '[ES: Brigham and Women’s Hospital is paying for this research to be done.]'
                  },
                  {
                    language: 'ht',
                    text: '[HT: Brigham and Women’s Hospital is paying for this research to be done.]'
                  }
                ]
              }
            ]
          },
          titleTemplate: {
            templateText: '<h3>$tb_consent_s3_who_title</h3>',
            templateType: 'HTML',
            variables: [
              {
                name: 'tb_consent_s3_who_title',
                translations: [
                  {
                    language: 'en',
                    text: 'Who will take part in this research?'
                  },
                  {
                    language: 'es',
                    text: '¿Quiénes participarán en esta investigación?'
                  },
                  {
                    language: 'ht',
                    text: 'Kimoun ki pral patisipe nan rechèch sa a?'
                  }
                ]
              }
            ]
          }
        },
        {
          blockType: 'CONTENT',
          bodyTemplate: {
            templateText: '\n          <p>$tb_consent_s3_expect_p1</p>\n          <p>$tb_consent_s3_expect_p2</p>\n          <ul>\n            <li>$tb_consent_s3_expect_item1</li>\n            <li>$tb_consent_s3_expect_item2</li>\n            <li>$tb_consent_s3_expect_item3</li>\n            <li>$tb_consent_s3_expect_item4</li>\n            <li>$tb_consent_s3_expect_item5</li>\n            <li>$tb_consent_s3_expect_item6</li>\n            <li>$tb_consent_s3_expect_item7</li>\n            <li>$tb_consent_s3_expect_item8</li>\n          </ul>\n          <p><strong>$tb_consent_s3_expect_review_title</strong></p>\n          <p>$tb_consent_s3_expect_review_p1</p>\n          <p><strong>$tb_consent_s3_expect_included_title</strong></p>\n          <p>$tb_consent_s3_expect_included_p1</p>\n          <p>$tb_consent_s3_expect_included_p2</p>\n        ',
            templateType: 'HTML',
            variables: [
              {
                name: 'tb_consent_s3_expect_p1',
                translations: [
                  {
                    language: 'en',
                    text: 'If you choose to take part in this study, we will ask you to sign this consent form before we do any study procedures.'
                  },
                  {
                    language: 'es',
                    text: '[ES: If you choose to take part in this study, we will ask you to sign this consent form before we do any study procedures.]'
                  },
                  {
                    language: 'ht',
                    text: '[HT: If you choose to take part in this study, we will ask you to sign this consent form before we do any study procedures.]'
                  }
                ]
              },
              {
                name: 'tb_consent_s3_expect_p2',
                translations: [
                  {
                    language: 'en',
                    text: 'During this study:'
                  },
                  {
                    language: 'es',
                    text: '[ES: During this study:]'
                  },
                  {
                    language: 'ht',
                    text: '[HT: During this study:]'
                  }
                ]
              },
              {
                name: 'tb_consent_s3_expect_item1',
                translations: [
                  {
                    language: 'en',
                    text: 'You will be asked to complete a short online survey about your current health.'
                  },
                  {
                    language: 'es',
                    text: 'Le pedirán que complete una breve encuesta en línea sobre su estado de salud actual.'
                  },
                  {
                    language: 'ht',
                    text: 'Yo pral mande pou w reponn yon sondaj kout sou entènèt sou sante w aktyèlman.'
                  }
                ]
              },
              {
                name: 'tb_consent_s3_expect_item2',
                translations: [
                  {
                    language: 'en',
                    text: 'A sample collection kit will be delivered to your home that will allow you to collect a sample from your nose and a few blood drops from your finger. This kit will contain detailed instructions about how to do these collections.'
                  },
                  {
                    language: 'es',
                    text: 'Le enviarán a su casa un kit de recolección de muestras, con el cual podrá recoger una muestra de la nariz y unas gotas de sangre del dedo. El kit incluirá instrucciones detalladas para realizar todo el proceso.'
                  },
                  {
                    language: 'ht',
                    text: 'Yo pral livre lakay ou yon kit pou kòlèk echantiyon ki pral pèmèt ou pran yon echantiyon nan nen w ak kèk gout san nan dwèt ou. Kit sa a ap gen ladan machasuiv detaye sou fason pou fè kòlèk sa yo.'
                  }
                ]
              },
              {
                name: 'tb_consent_s3_expect_item3',
                translations: [
                  {
                    language: 'en',
                    text: 'For sample collection from your nose, you will use an anterior nasal swab from the kit and insert the tip of the swab into one nostril. The swab does not need to be inserted far—insert just until the tip of the swab is no longer visible. You will rotate the swab in a circle around the entire inside edge of your nostril at least 3 times. Then you will repeat the process in the other nostril with the same swab and store the swab in a tube that will come with your kit.'
                  },
                  {
                    language: 'es',
                    text: 'Para tomar la muestra de la nariz, debe tomar un hisopo nasal anterior del kit e introducir la punta en una de las fosas nasales. No es necesario que introduzca el hisopo hasta el fondo: empújelo hasta que no se vea la punta. Debe girar el hisopo, de forma circular, por todo el borde interno de la fosa nasal al menos tres veces. Luego, debe repetir el proceso en la otra fosa nasal con el mismo hisopo y guardarlo en un tubo que encontrará en el kit.'
                  },
                  {
                    language: 'ht',
                    text: 'Pou kòlèk echantiyon nan nen w, ou pral sèvi ak yon aplikatè nazal anteryè nan kit la epi foure pwent aplikatè a nan yon twou nen w. Ou pa bezwen foure aplikatè a lwen—annik foure li jiskaske pwent aplikatè a pa vizib ankò. Ou pral vire aplikatè a nan yon mouvman an sèk toutotou anndan rebò twou nen w omwen 3 fwa. Apre sa, ou pral refè pwosesis la nan lòt twou nen an avèk menm aplikatè a epi estoke aplikatè a nan yon tib ki pral vini avèk kit ou a.'
                  }
                ]
              },
              {
                name: 'tb_consent_s3_expect_item4',
                translations: [
                  {
                    language: 'en',
                    text: 'To collect blood from your finger, you will first clean your fingertip with a small alcohol wipe from the kit. You will then use a lancet, a small needle, to prick your finger. You will need to put a few drops of blood on a card that will also be part of the kit. Once complete, you should cover your fingertip with the bandaid from the kit.'
                  },
                  {
                    language: 'es',
                    text: 'Para extraer sangre de un dedo, primero debe limpiarse la yema con un paño impregnado en alcohol del kit. Luego, debe usar una lanceta, que es una pequeña aguja, para pincharse el dedo. A continuación, debe colocar algunas gotas de sangre en una tarjeta que también encontrará en el kit. Una vez que haya terminado, debe cubrirse la yema del dedo con un apósito adhesivo del kit.'
                  },
                  {
                    language: 'ht',
                    text: 'Pou pran san an nan dwèt ou, ou pral toudabò netwaye pwent dwèt ou avèk yon ti tanpon alkòl ki nan kit la. Apre sa, ou pral sèvi ak yon lansèt, yon ti zegui, pou pike dwèt ou a. Ou pral gen pou w mete kèk gout san sou yon kat ki pral fè pati kit la tou. On fwa ou fini, ou dwe kouvri pwent dwèt ou a ak pansman ki nan kit la.'
                  }
                ]
              },
              {
                name: 'tb_consent_s3_expect_item5',
                translations: [
                  {
                    language: 'en',
                    text: 'You will then need to package the samples according to the directions we will provide and the package will then be collected from your home and delivered to the lab at the Broad Institute where the testing will be done. Your personal contact information may be shared with a courier service.'
                  },
                  {
                    language: 'es',
                    text: 'Por último, tendrá que empaquetar las muestras de acuerdo con las instrucciones que le daremos. El paquete se recogerá en su domicilio y se entregará al laboratorio de Broad Institute, donde se realizarán los análisis. [ES: Your personal contact information may be shared with a courier service.]'
                  },
                  {
                    language: 'ht',
                    text: 'Apre sa, ou pral gen pou w anbale echantiyon yo dapre esplikasyon nou pral bay yo, epi apre sa yo pral pran koli an lakay ou pou livre l nan laboratwa Broad Institute kote yo pral fè tès la. [HT: Your personal contact information may be shared with a courier service.]'
                  }
                ]
              },
              {
                name: 'tb_consent_s3_expect_item6',
                translations: [
                  {
                    language: 'en',
                    text: 'If you choose to continue in the study, you will receive an additional kit monthly, for the subsequent 5 months, and be asked to complete a short health questionnaire each month for the subsequent 5 months as well.'
                  },
                  {
                    language: 'es',
                    text: 'Si opta por continuar participando en el estudio, en cada uno de los cinco meses siguientes recibirá un kit y le pedirán que complete un breve cuestionario sobre su salud.'
                  },
                  {
                    language: 'ht',
                    text: 'Si w chwazi pou w kontinye nan etid la, ou pral resevwa yon kit anplis chak mwa, pandan 5 mwa annapre yo, epi yo pral mande pou w ranpli yon kesyonè kout sou sante w chak mwa pandan 5 mwa annapre yo tou.'
                  }
                ]
              },
              {
                name: 'tb_consent_s3_expect_item7',
                translations: [
                  {
                    language: 'en',
                    text: 'If you start to feel sick with COVID-19 symptoms at any time during the study, you can request an additional test to be sent immediately.'
                  },
                  {
                    language: 'es',
                    text: '[ES: If you start to feel sick with COVID-19 symptoms at any time during the study, you can request an additional test to be sent immediately.]'
                  },
                  {
                    language: 'ht',
                    text: '[HT: If you start to feel sick with COVID-19 symptoms at any time during the study, you can request an additional test to be sent immediately.]'
                  }
                ]
              },
              {
                name: 'tb_consent_s3_expect_item8',
                translations: [
                  {
                    language: 'en',
                    text: 'We will also review your medical records.'
                  },
                  {
                    language: 'es',
                    text: '[ES: We will also review your medical records.]'
                  },
                  {
                    language: 'ht',
                    text: '[HT: We will also review your medical records.]'
                  }
                ]
              },
              {
                name: 'tb_consent_s3_expect_review_title',
                translations: [
                  {
                    language: 'en',
                    text: 'Review of medical records from hospital admission or emergency department visits'
                  },
                  {
                    language: 'es',
                    text: '[ES: Review of medical records from hospital admission or emergency department visits]'
                  },
                  {
                    language: 'ht',
                    text: '[HT: Review of medical records from hospital admission or emergency department visits]'
                  }
                ]
              },
              {
                name: 'tb_consent_s3_expect_review_p1',
                translations: [
                  {
                    language: 'en',
                    text: 'Partners has an electronic system that lets your study doctors know if you are admitted to a Partners Hospital, or if you visit a Partners Hospital Emergency Department. We want to make sure the study doctors know about any possible problems or side effects you experience while you are taking part in the study.'
                  },
                  {
                    language: 'es',
                    text: '[ES: Partners has an electronic system that lets your study doctors know if you are admitted to a Partners Hospital, or if you visit a Partners Hospital Emergency Department. We want to make sure the study doctors know about any possible problems or side effects you experience while you are taking part in the study.]'
                  },
                  {
                    language: 'ht',
                    text: '[HT: Partners has an electronic system that lets your study doctors know if you are admitted to a Partners Hospital, or if you visit a Partners Hospital Emergency Department. We want to make sure the study doctors know about any possible problems or side effects you experience while you are taking part in the study.]'
                  }
                ]
              },
              {
                name: 'tb_consent_s3_expect_included_title',
                translations: [
                  {
                    language: 'en',
                    text: 'Study information included in your electronic medical record'
                  },
                  {
                    language: 'es',
                    text: '[ES: Study information included in your electronic medical record]'
                  },
                  {
                    language: 'ht',
                    text: '[HT: Study information included in your electronic medical record]'
                  }
                ]
              },
              {
                name: 'tb_consent_s3_expect_included_p1',
                translations: [
                  {
                    language: 'en',
                    text: 'A notation that you are taking part in this research study may be made in your electronic medical record. Information from the research that relates to your general medical care may be included in the record (for example: list of allergies, results of standard blood test done at the hospital labs.)'
                  },
                  {
                    language: 'es',
                    text: '[ES: A notation that you are taking part in this research study may be made in your electronic medical record. Information from the research that relates to your general medical care may be included in the record (for example: list of allergies, results of standard blood test done at the hospital labs.)]'
                  },
                  {
                    language: 'ht',
                    text: '[HT: A notation that you are taking part in this research study may be made in your electronic medical record. Information from the research that relates to your general medical care may be included in the record (for example: list of allergies, results of standard blood test done at the hospital labs.)]'
                  }
                ]
              },
              {
                name: 'tb_consent_s3_expect_included_p2',
                translations: [
                  {
                    language: 'en',
                    text: 'Please ask your study doctor if you have any questions about what information will be included in your electronic medical record.'
                  },
                  {
                    language: 'es',
                    text: '[ES: Please ask your study doctor if you have any questions about what information will be included in your electronic medical record.]'
                  },
                  {
                    language: 'ht',
                    text: '[HT: Please ask your study doctor if you have any questions about what information will be included in your electronic medical record.]'
                  }
                ]
              }
            ]
          },
          titleTemplate: {
            templateText: '<h3>$tb_consent_s3_expect_title</h3>',
            templateType: 'HTML',
            variables: [
              {
                name: 'tb_consent_s3_expect_title',
                translations: [
                  {
                    language: 'en',
                    text: 'What will happen in this research study?'
                  },
                  {
                    language: 'es',
                    text: '¿Qué sucederá en este estudio de investigación?'
                  },
                  {
                    language: 'ht',
                    text: 'Kisa ki pral rive nan etid rechèch sa a?'
                  }
                ]
              }
            ]
          }
        },
        {
          blockType: 'CONTENT',
          bodyTemplate: {
            templateText: '\n          <p>$tb_consent_s3_share_p1</p>\n          <p>$tb_consent_s3_share_p2</p>\n        ',
            templateType: 'HTML',
            variables: [
              {
                name: 'tb_consent_s3_share_p1',
                translations: [
                  {
                    language: 'en',
                    text: 'The samples and information we collect in this study may help advance other research. At the completion of this research study, we would like to store and be able to use and share your identifiable samples and health information with researchers at Brigham and Women\'s Hospital and the Broad Institute for other research related to COVID-19. If we share your samples and/or health information with other researchers outside of Brigham and Women\'s Hospital or the Broad Institute, we will label the samples and information with a code instead of your name or other directly identifying information. The key to the code connects your name or other identifiers to your sample and/or information. We will keep the code in a password protected computer.'
                  },
                  {
                    language: 'es',
                    text: 'Las muestras y la información que reunamos en este estudio podrían ayudar al proceso de otras investigaciones. Cuando finalice este estudio de investigación, nos gustaría guardar y poder usar y compartir sus muestras identificables y su información médica, así como entregárselas a los investigadores de Brigham and Women\'s Hospital y Broad Institute para otras investigaciones relacionadas con la COVID-19. Si compartimos sus muestras o su información médica con otros investigadores ajenos a Brigham and Women\'s Hospital o Broad Institute, rotularemos todo con un código en lugar de su nombre u otros datos identificatorios. La clave del código permite relacionar su nombre u otros identificadores con su muestra o información. Guardaremos el código en una computadora protegida con contraseña.'
                  },
                  {
                    language: 'ht',
                    text: 'Echantiyon ak enfòmasyon nou pran nan etid sa a ka ede fè lòt rechèch yo avanse. Nan fen etid rechèch sa a, nou ta renmen konsève epi kapab itilize ak pataje echantiyon ak enfòmasyon sou sante ki ka idantifye w avèk chèchè nan Brigham and Women\'s Hospital ak Broad Institute pou lòt rechèch anrapò ak COVID-19. Si nou pataje echantiyon ak/oswa enfòmasyon sou sante w avèk lòt chèchè deyò Brigham and Women\'s Hospital ak Broad Institute, nou pral make echantiyon yo ak enfòmasyon yo avèk yon kòd olye non w oswa lòt enfòmasyon ki idantifye w dirèkteman. Kle pou kòd la konekte non w oswa lòt enfòmasyon idantifikasyon avèk echantiyon w ak/oswa enfòmasyon ou yo. Nou pral konsève kòd la nan yon konpitè ki pwoteje ak modpas.'
                  }
                ]
              },
              {
                name: 'tb_consent_s3_share_p2',
                translations: [
                  {
                    language: 'en',
                    text: 'Because these samples and/or health information are identifiable, we are asking your permission to store, use and share your samples for other research. You can still take part in this research study whether or not you give permission for the storage, use, and sharing of the samples and health information for other research.'
                  },
                  {
                    language: 'es',
                    text: 'Dado que esas muestras o la información médica se pueden identificar, le pedimos permiso para guardarlas, utilizarlas y compartirlas para otras investigaciones. Podrá participar en este estudio de investigación aunque no dé su permiso para guardar, utilizar y compartir las muestras y la información médica para otras investigaciones.'
                  },
                  {
                    language: 'ht',
                    text: 'Piske yo ka idantifye echantiyon ak/oswa enfòmasyon sou sante sa yo, n ap mande otorizasyon w pou n estoke, itilize ak pataje echantiyon ou yo pou lòt rechèch. Ou ka patisipe nan etid rechèch sa a kanmenm kit wi ou non ou bay otorizasyon pou estoke, itilize, epi pataje echantiyon yo ak enfòmasyon medikal yo pou lòt rechèch.'
                  }
                ]
              }
            ]
          },
          titleTemplate: {
            templateText: '<h3>$tb_consent_s3_share_title</h3>',
            templateType: 'HTML',
            variables: [
              {
                name: 'tb_consent_s3_share_title',
                translations: [
                  {
                    language: 'en',
                    text: 'How may we use and share your samples and health information for other research?'
                  },
                  {
                    language: 'es',
                    text: '¿Cómo podemos utilizar y compartir sus muestras y su información médica para otras investigaciones?'
                  },
                  {
                    language: 'ht',
                    text: 'Kijan nou ka itilize ak pataje echantiyon ak enfòmasyon sou sante w pou lòt rechèch?'
                  }
                ]
              }
            ]
          }
        },
        {
          blockType: 'CONTENT',
          bodyTemplate: {
            templateText: '\n          <p>$tb_consent_s3_results_p1</p>\n          <p>$tb_consent_s3_results_p2</p>\n          <p>$tb_consent_s3_results_p3</p>\n        ',
            templateType: 'HTML',
            variables: [
              {
                name: 'tb_consent_s3_results_p1',
                translations: [
                  {
                    language: 'en',
                    text: 'Because the antibody test from the blood sample will be performed in a research laboratory (a facility in which scientific research, experiments, and measurement may be performed) and not a clinical laboratory (a laboratory where tests are usually done on clinical specimens in order to obtain information about the health of a patient), we cannot directly release results from the research antibody test to you. We will report aggregate results (your results combined with other research participants results) to the Massachusetts Department of Public Health and other key stakeholders in public health to determine what percent of study participants had a positive antibody, and to help us better understand the prevalence, or how widespread COVID-19 is.'
                  },
                  {
                    language: 'es',
                    text: '[ES: Because the antibody test from the blood sample will be performed in a research laboratory (a facility in which scientific research, experiments, and measurement may be performed)] y no en un laboratorio clínico (es decir, un laboratorio donde se suelen analizar muestras clínicas para obtener información sobre la salud de un paciente), no podemos entregarle directamente a usted los resultados de la prueba de anticuerpos de la investigación. Presentaremos un resumen de los resultados (sus resultados combinados con los de otros participantes de la investigación) al Departamento de Salud Pública de Massachusetts y otras partes interesadas clave del sector de salud pública. Nuestro objetivo es determinar qué porcentaje de participantes del estudio tienen un anticuerpo positivo y contar con una noción más clara de la prevalencia, o cantidad de personas contagiadas, de COVID-19.'
                  },
                  {
                    language: 'ht',
                    text: '[HT: Because the antibody test from the blood sample will be performed in a research laboratory (a facility in which scientific research, experiments, and measurement may be performed)] epi se pa nan yon laboratwa klinik (yon laboratwa kote yo fè tès òdinèman sou echantiyon klinik pou jwenn enfòmasyon sou sante yon pasyan), nou pa kapab kominike ba ou dirèkteman rezilta ki soti nan tès antikò rechèch yo. Nou pral rapòte rezilta yo an gwoup (rezilta ou yo melanje avèk rezilta lòt patisipan nan rechèch la) bay depatman sante piblik nan Massachusetts (Massachusetts Department of Public Health) ak bay lòt pati konsène kle yo nan sante piblik pou detèmine ki pousantaj nan patisipan etid yo ki te gen yon antikò pozitif, epi pou ede nou konprann prevalans lan pi byen, oswa nan ki pwen COVID-19 la pwopaje toupatou.'
                  }
                ]
              },
              {
                name: 'tb_consent_s3_results_p2',
                translations: [
                  {
                    language: 'en',
                    text: 'The viral test from the nasal swab will be performed in a clinical laboratory. But because this is a research study involving at-home specimen collection that is not yet FDA-approved, we are only allowed at this time to release the result of the COVID-19 viral test to you as a research result. We ask you to contact your physician to order another test so that the specimen can be collected under a clinician’s supervision and the result can be confirmed at a clinical laboratory (a process called "CLIA confirmation"). This additional step is necessary in order to return these results to you. A CLIA lab meets government-mandated requirement for quality assurance and quality control, and is certified to release results from patient test for clinical and diagnostic purposes. We would be happy to help you contact your local doctor to order the CLIA confirmation testing and return your results to you if that would be easier. The results will be returned to your doctor who can make sure you receive the proper medical care as needed.'
                  },
                  {
                    language: 'es',
                    text: '[ES: The viral test from the nasal swab will be performed in a clinical laboratory. But because this is a research study involving at-home specimen collection that is not yet FDA-approved, we are only allowed at this time to release the result of the COVID-19 viral test to you as a research result.] Asimismo, le pedimos que se comunique con su médico para solicitar otra prueba, de modo que la muestra se recolecte con la supervisión de un médico y el resultado se pueda confirmar en un laboratorio clínico (proceso denominado “confirmación CLIA”). Para que usted pueda recibir los resultados, es necesario tomar esa medida adicional. Los laboratorios CLIA cumplen con requisitos gubernamentales relacionados con la garantía y el control de la calidad. Además, cuentan con una certificación para entregar los resultados de las pruebas de los pacientes con fines clínicos y de diagnóstico. Si le resulta más sencillo, con gusto le brindaremos asistencia para que se comunique con un médico de su zona que solicite una prueba con confirmación CLIA y le dé sus resultados. Los resultados se entregarán a su médico, quien puede cerciorarse de que usted reciba la atención médica adecuada cuando sea necesario.'
                  },
                  {
                    language: 'ht',
                    text: '[HT: The viral test from the nasal swab will be performed in a clinical laboratory. But because this is a research study involving at-home specimen collection that is not yet FDA-approved, we are only allowed at this time to release the result of the COVID-19 viral test to you as a research result.] Nou mande pou w kontakte doktè k ap suiv ou a pou li preskri ba ou yon lòt tès pou yo ka pran echantiyon an anba sipèvizyon yon klinisyen epi yo ka konfime rezilta a nan yon laboratwa klinik (yon pwosesis ki rele "konfimasyon CLIA"). Etap anplis sa a nesesè pou remèt ou rezilta sa yo. Yon laboratwa CLIA reponn a kondisyon obligatwa gouvènman an pou sa ki konsène asirans kalite ak kontwòl kalite, epi li sètifye pou kominike rezilta tès pasyan pou rezon klinik ak dyagnostik. Si sa t ap pi fasil, nou t ap kontan ede w kontakte doktè lokal k ap suiv ou a pou w plase kòmann pou tès konfimasyon an epi voye rezilta ou yo tounen ba ou. N ap voye rezilta yo tounen bay doktè k ap suiv ou a ki limenm kapab garanti ou resevwa bon swen medikal selon bezwen yo.'
                  }
                ]
              },
              {
                name: 'tb_consent_s3_results_p3',
                translations: [
                  {
                    language: 'en',
                    text: 'You can choose to be on an email list to receive newsletter updates about the research we are doing. This newsletter will not announce your results or anyone else\'s, but it will tell you some information about what we are learning about COVID-19. We will also publish what we learn in medical journals. In the future, when research results are published, they may show that certain groups (for example, racial or ethnic groups, or men/women) have genes that are associated with increased risk of a disease. If this happens, you may learn that you are at increased risk of developing a disease or condition.'
                  },
                  {
                    language: 'es',
                    text: 'Si lo desea, podemos incluir su correo electrónico en una lista para recibir un boletín de novedades sobre la investigación que estamos haciendo. En el boletín no se anunciarán sus resultados ni los de nadie, sino que se difundirá información que se está recabando sobre COVID-19. Quizás publiquemos los datos que obtengamos en revistas médicas. [ES: In the future, when research results are published, they may show that certain groups (for example, racial or ethnic groups, or men/women) have genes that are associated with increased risk of a disease. If this happens, you may learn that you are at increased risk of developing a disease or condition.]'
                  },
                  {
                    language: 'ht',
                    text: 'Ou ka chwazi pou ou nan yon lis imèl pou w resevwa bilten nouvèl sou rechèch n ap fèt yo. Bilten nouvèl sa a pa pral anonse rezilta ou yo ni rezilta okenn lòt moun, men l ap ba w kèk enfòmasyon sou sa nou aprann sou COVID-19. Nou pral pibliye tou sa nou aprann lan nan jounal medikal. [HT: In the future, when research results are published, they may show that certain groups (for example, racial or ethnic groups, or men/women) have genes that are associated with increased risk of a disease. If this happens, you may learn that you are at increased risk of developing a disease or condition.]'
                  }
                ]
              }
            ]
          },
          titleTemplate: {
            templateText: '<h3>$tb_consent_s3_results_title</h3>',
            templateType: 'HTML',
            variables: [
              {
                name: 'tb_consent_s3_results_title',
                translations: [
                  {
                    language: 'en',
                    text: 'Will you get the results of this research study?'
                  },
                  {
                    language: 'es',
                    text: '¿Recibirá los resultados de este estudio de investigación?'
                  },
                  {
                    language: 'ht',
                    text: 'Èske w ap jwenn rezilta etid rechèch sa a?'
                  }
                ]
              }
            ]
          }
        },
        {
          blockType: 'CONTENT',
          bodyTemplate: {
            templateText: '\n          <p>$tb_consent_s3_risks_p1</p>\n          <p>$tb_consent_s3_risks_p2</p>\n          <p>$tb_consent_s3_risks_p3</p>\n        ',
            templateType: 'HTML',
            variables: [
              {
                name: 'tb_consent_s3_risks_p1',
                translations: [
                  {
                    language: 'en',
                    text: 'Important risks and possible discomforts to know about include discomfort from collecting your own specimen. There may be some physical discomfort when the nasal swab or blood is collected. However, if you have an ongoing local inflammatory process, or were overly aggressive in execution of the anterior nasal swab, there may be other risks such as bleeding or infection. There is a small chance that you will develop a bruise, feel lightheaded, faint, or develop an infection at the site where you prick your finger to get a few blood spots.'
                  },
                  {
                    language: 'es',
                    text: 'Entre los riesgos importantes y las posibles molestias que debe tener en cuenta se encuentran las molestias causadas al recolectar su propia muestra. Quizás sienta algunas molestias físicas al realizar el hisopado nasal o tomar la muestra de sangre. [ES: However, if you have an ongoing local inflammatory process, or were overly aggressive in execution of the anterior nasal swab, there may be other risks such as bleeding or infection.] Existe una leve posibilidad de que le salga un moretón, sienta un ligero mareo, se desmaye o desarrolle una infección en el lugar donde se pinche el dedo para obtener unas gotas de sangre.'
                  },
                  {
                    language: 'ht',
                    text: 'Risk ki enpòtan ak malalèz ki posib pou ou konnen gen ladan malèz lè w ap pran pwòp echantiyon pa w. Gendwa gen kèk malèz fizik lè w pran echantiyon an avèk aplikatè nazal la oswa nan priz san an. [HT: However, if you have an ongoing local inflammatory process, or were overly aggressive in execution of the anterior nasal swab, there may be other risks such as bleeding or infection.] Gen yon ti chans pou ou vin gen vyann mètri, santi ou toudi, endispoze, oswa devlope yon enfeksyon nan anplasman kote w pike dwèt ou pou w pran detwa gout san.'
                  }
                ]
              },
              {
                name: 'tb_consent_s3_risks_p2',
                translations: [
                  {
                    language: 'en',
                    text: 'Your privacy is very important to us and we will use many safety measures to protect your privacy. However, in spite of all of the safety measures that we will use, we cannot guarantee that your identity will never become known. The risk of this happening is currently very low. It is possible also that someone could get unauthorized access or break into the system that stores information about you. Every precaution will be taken to minimize this risk. There also may be other privacy risks that we have not foreseen.'
                  },
                  {
                    language: 'es',
                    text: 'Su privacidad es muy importante para nosotros y tomaremos muchas medidas de seguridad para protegerla. Sin embargo, pese a todas las medidas de seguridad que tomaremos, no podemos garantizar que su identidad no se dé a conocer. En este momento, el riesgo de que eso suceda es muy bajo. También es posible que alguien acceda sin autorización o ilícitamente al sistema en el que se almacena la información sobre usted. Se tomarán todas las precauciones posibles para reducir ese riesgo al mínimo. También puede haber otros riesgos para la privacidad que no hemos previsto.'
                  },
                  {
                    language: 'ht',
                    text: 'Nou bay vi prive w anpil enpòtans epi nou pral itilize anpil mezi sekirite pou n pwoteje vi prive w. Sepandan, malgre tout mezi sekirite nou pral pran yo, nou pa kapab garanti yo p ap janm vin konnen idantite w. Risk pou sa rive se risk ki trè fèb aktyèlman. Li posib tou pou yon moun ka jwenn aksè san otorizasyon oswa antre nan sistèm ki estoke enfòmasyon ki konsène w. Nou pral pran tout prekosyon pou diminye risk sa a nèt. Ka gen lòt risk pou vi prive tou ke nou pa te prevwa.'
                  }
                ]
              },
              {
                name: 'tb_consent_s3_risks_p3',
                translations: [
                  {
                    language: 'en',
                    text: 'There could be other unforeseeable risks that are currently unknown.'
                  },
                  {
                    language: 'es',
                    text: 'Podría haber otros riesgos imprevistos que actualmente no se conocen.'
                  },
                  {
                    language: 'ht',
                    text: 'Ta ka gen lòt risk nou pa ka prevwa ki enkoni aktyèlman.'
                  }
                ]
              }
            ]
          },
          titleTemplate: {
            templateText: '<h3>$tb_consent_s3_risks_title</h3>',
            templateType: 'HTML',
            variables: [
              {
                name: 'tb_consent_s3_risks_title',
                translations: [
                  {
                    language: 'en',
                    text: 'What are the risks and possible discomforts from being in this research study?'
                  },
                  {
                    language: 'es',
                    text: '¿Cuáles son los riesgos y las posibles molestias que puede conllevar la participación en este estudio?'
                  },
                  {
                    language: 'ht',
                    text: 'Ki risk ak malèz ki posib nan patisipasyon nan etid rechèch sa a?'
                  }
                ]
              }
            ]
          }
        },
        {
          blockType: 'CONTENT',
          bodyTemplate: {
            templateText: '<p>$tb_consent_s3_benefits_p1</p>',
            templateType: 'HTML',
            variables: [
              {
                name: 'tb_consent_s3_benefits_p1',
                translations: [
                  {
                    language: 'en',
                    text: 'You may not benefit from taking part in this research study. You may find out that you are infected with COVID-19, but you will need to be retested by your PCP or at the clinic to confirm this result. Your participation in this study may help us learn how to help patients with and without COVID-19 in the future, and how to handle future outbreaks of COVID-19 in our community.'
                  },
                  {
                    language: 'es',
                    text: '[ES: You may not benefit from taking part in this research study. You may find out that you are infected with COVID-19, but you will need to be retested by your PCP or at the clinic to confirm this result.] Su participación en este estudio puede contribuir a que en adelante sepamos cómo ayudar a los pacientes con y sin COVID-19 y cómo actuar ante futuros brotes de COVID-19 en nuestra comunidad.'
                  },
                  {
                    language: 'ht',
                    text: '[HT: You may not benefit from taking part in this research study. You may find out that you are infected with COVID-19, but you will need to be retested by your PCP or at the clinic to confirm this result.] Patisipasyon w nan etid sa a ka ede nou aprann fason pou n ede pi devan pasyan ki gen COVID-19 ak sa ki pa genyen l, ak fason pou n jere epidemi COVID-19 yo alavni nan kominote nou a.'
                  }
                ]
              }
            ]
          },
          titleTemplate: {
            templateText: '<h3>$tb_consent_s3_benefits_title</h3>',
            templateType: 'HTML',
            variables: [
              {
                name: 'tb_consent_s3_benefits_title',
                translations: [
                  {
                    language: 'en',
                    text: 'What are the possible benefits from being in this research study?'
                  },
                  {
                    language: 'es',
                    text: '¿Cuáles son las posibles ventajas de participar en este estudio de investigación?'
                  },
                  {
                    language: 'ht',
                    text: 'Ki avantaj ki posib nan patisipasyon nan etid rechèch sa a?'
                  }
                ]
              }
            ]
          }
        },
        {
          blockType: 'CONTENT',
          bodyTemplate: {
            templateText: '<p>$tb_consent_s3_treatments_p1</p>',
            templateType: 'HTML',
            variables: [
              {
                name: 'tb_consent_s3_treatments_p1',
                translations: [
                  {
                    language: 'en',
                    text: 'You do not need to participate in this study in order to be tested for COVID-19. If you are experiencing symptoms of COVID-19 or believe you have been exposed to COVID-19, you may be able to get tested at a clinic by asking your doctor to order a test for you.'
                  },
                  {
                    language: 'es',
                    text: 'No es necesario que participe en este estudio para que le hagan la prueba de detección de COVID-19. Si tiene síntomas de COVID-19 o cree que ha estado en contacto con esa enfermedad, quizás pueda realizarse una prueba de detección en una clínica si le pide a su médico que la solicite.'
                  },
                  {
                    language: 'ht',
                    text: 'Ou pa oblije patisipe nan etid sa a pou w fè tès pou COVID-19. Si w gen sentòm COVID-19 oswa ou kwè ou te ekspoze nan COVID-19, ou ka anmezi pou fè tès nan yon klinik si w mande doktè k ap suiv ou a preskri yon tès pou ou.'
                  }
                ]
              }
            ]
          },
          titleTemplate: {
            templateText: '<h3>$tb_consent_s3_treatments_title</h3>',
            templateType: 'HTML',
            variables: [
              {
                name: 'tb_consent_s3_treatments_title',
                translations: [
                  {
                    language: 'en',
                    text: 'What other treatments or procedures are available for your condition?'
                  },
                  {
                    language: 'es',
                    text: '¿Qué otros tratamientos o procedimientos tiene a su disposición para su enfermedad?'
                  },
                  {
                    language: 'ht',
                    text: 'Ki lòt tretman oswa pwosedi ki disponib pou pwoblèm ou an?'
                  }
                ]
              }
            ]
          }
        },
        {
          blockType: 'CONTENT',
          bodyTemplate: {
            templateText: '\n          <p>$tb_consent_s3_decline_p1</p>\n          <p>$tb_consent_s3_decline_p2</p>\n        ',
            templateType: 'HTML',
            variables: [
              {
                name: 'tb_consent_s3_decline_p1',
                translations: [
                  {
                    language: 'en',
                    text: 'Yes. Your decision about whether or not to participate in this study will not change the medical care you get within Partners now or in the future. There will be no penalty, and you won’t lose any benefits you receive now or have a right to receive.'
                  },
                  {
                    language: 'es',
                    text: '[ES: Yes. Your decision about whether or not to participate in this study will not change the medical care you get within Partners now or in the future.] No le aplicarán ninguna sanción ni perderá ninguna de las prestaciones que reciba ahora o que tenga derecho a recibir.'
                  },
                  {
                    language: 'ht',
                    text: '[HT: Yes. Your decision about whether or not to participate in this study will not change the medical care you get within Partners now or in the future.] P ap gen okenn sanksyon, epi ni ou p ap pèdi okenn avantaj ou resevwa kounye a oswa ou gen dwa pou resevwa.'
                  }
                ]
              },
              {
                name: 'tb_consent_s3_decline_p2',
                translations: [
                  {
                    language: 'en',
                    text: 'We will tell you if we learn new information that could make you change your mind about taking part in this research study.'
                  },
                  {
                    language: 'es',
                    text: 'Le avisaremos si nos enteramos de algún dato que pudiera hacerlo cambiar de parecer acerca de su participación en este estudio.'
                  },
                  {
                    language: 'ht',
                    text: 'N ap fè w konnen sa si nou aprann nouvo enfòmasyon ki ta ka fè ou chanje lide konsènan patipasyon nan etid rechèch sa a.'
                  }
                ]
              }
            ]
          },
          titleTemplate: {
            templateText: '<h3>$tb_consent_s3_decline_title</h3>',
            templateType: 'HTML',
            variables: [
              {
                name: 'tb_consent_s3_decline_title',
                translations: [
                  {
                    language: 'en',
                    text: 'Can you still get medical care within Partners if you don\'t take part in this research study, or if you stop taking part?'
                  },
                  {
                    language: 'es',
                    text: 'Si no participa en el estudio de investigación o lo abandona, ¿puede seguir recibiendo atención médica con Partners?'
                  },
                  {
                    language: 'ht',
                    text: 'Èske w ka resevwa swen medikal nan Partners kanmenm si w pa patisipe nan etid rechèch sa a, oswa si w sispann patisipe?'
                  }
                ]
              }
            ]
          }
        },
        {
          blockType: 'CONTENT',
          bodyTemplate: {
            templateText: '\n          <p>$tb_consent_s3_withdraw_p1</p>\n          <p>$tb_consent_s3_withdraw_p2</p>\n        ',
            templateType: 'HTML',
            variables: [
              {
                name: 'tb_consent_s3_withdraw_p1',
                translations: [
                  {
                    language: 'en',
                    text: 'If you take part in this research study, and want to drop out, you should tell us. We will make sure that you stop the study safely. We will also talk to you about follow-up care, if needed.'
                  },
                  {
                    language: 'es',
                    text: 'Si participa en este estudio de investigación y quiere abandonarlo, debe informarnos. Nos cercioraremos de que abandone el estudio sin complicaciones. También le hablaremos sobre la atención de seguimiento, si es necesario.'
                  },
                  {
                    language: 'ht',
                    text: 'Si w patisipe nan etid rechèch sa a, epi w vle abandone, ou dwe di nou sa. Nou pral asire ou sispann etid la san danje. Nou pral pale avèk ou tou sou swen suivi, si sa nesesè.'
                  }
                ]
              },
              {
                name: 'tb_consent_s3_withdraw_p2',
                translations: [
                  {
                    language: 'en',
                    text: 'Also, it is possible that we will have to ask you to drop out of the study before you finish it. If this happens, we will tell you why. We will also help arrange other care for you, if needed.'
                  },
                  {
                    language: 'es',
                    text: 'Asimismo, quizás le pidamos que abandone el estudio antes de finalizarlo. En ese caso, le explicaremos por qué. Si es necesario, también le brindaremos ayuda para coordinar otros servicios de atención.'
                  },
                  {
                    language: 'ht',
                    text: 'Epitou, li posib nou pral oblije mande pou w abandone etid la anvan w fini li. Si sa rive, n ap fè w konnen poukisa. Nou pral ede tou pou fè aranjman lòt swen pou ou, si sa nesesè.'
                  }
                ]
              }
            ]
          },
          titleTemplate: {
            templateText: '<h3>$tb_consent_s3_withdraw_title</h3>',
            templateType: 'HTML',
            variables: [
              {
                name: 'tb_consent_s3_withdraw_title',
                translations: [
                  {
                    language: 'en',
                    text: 'What should you do if you want to stop taking part in the study?'
                  },
                  {
                    language: 'es',
                    text: '¿Qué debe hacer si desea dejar de participar en el estudio?'
                  },
                  {
                    language: 'ht',
                    text: 'Kisa w dwe fè si w vle sispann patisipe nan etid la?'
                  }
                ]
              }
            ]
          }
        },
        {
          blockType: 'CONTENT',
          bodyTemplate: {
            templateText: '\n          <p>$tb_consent_s3_paid_p1</p>\n          <p>$tb_consent_s3_paid_p2</p>\n        ',
            templateType: 'HTML',
            variables: [
              {
                name: 'tb_consent_s3_paid_p1',
                translations: [
                  {
                    language: 'en',
                    text: 'You will not be paid for taking part in this research study.'
                  },
                  {
                    language: 'es',
                    text: 'No le pagarán por participar en este estudio de investigación.'
                  },
                  {
                    language: 'ht',
                    text: 'Nou p ap peye w pou patisipasyon w nan etid rechèch sa a.'
                  }
                ]
              },
              {
                name: 'tb_consent_s3_paid_p2',
                translations: [
                  {
                    language: 'en',
                    text: 'We may use your samples and information to develop a new product or medical test to be sold. The Sponsor, hospital, and researchers may benefit if this happens. There are no plans to pay you if your samples or information are used for this purpose.'
                  },
                  {
                    language: 'es',
                    text: 'Tal vez usemos sus muestras y su información para desarrollar un nuevo producto o una prueba médica para la venta. En ese caso, es posible que eso beneficie al patrocinador, al hospital y a los investigadores. No planeamos pagarle si sus muestras o su información se utilizan con ese fin.'
                  },
                  {
                    language: 'ht',
                    text: 'Nou gendwa itilize echantiyon ak enfòmasyon ou yo pou n kreye yon nouvo pwodui oswa yon tès medikal pou n vann. Esponnsò a, lopital la, ak chèchè yo ka benefisye si sa rive. Pa gen okenn plan pou n peye w si yo itilize echantiyon oswa enfòmasyon ou yo pou objektif sa a.'
                  }
                ]
              }
            ]
          },
          titleTemplate: {
            templateText: '<h3>$tb_consent_s3_paid_title</h3>',
            templateType: 'HTML',
            variables: [
              {
                name: 'tb_consent_s3_paid_title',
                translations: [
                  {
                    language: 'en',
                    text: 'Will you be paid to take part in this research study?'
                  },
                  {
                    language: 'es',
                    text: '¿Le pagarán por participar en este estudio de investigación?'
                  },
                  {
                    language: 'ht',
                    text: 'Èske yo pral peye w pou patisipe nan etid rechèch sa a?'
                  }
                ]
              }
            ]
          }
        },
        {
          blockType: 'CONTENT',
          bodyTemplate: {
            templateText: '<p>$tb_consent_s3_cost_p1</p>',
            templateType: 'HTML',
            variables: [
              {
                name: 'tb_consent_s3_cost_p1',
                translations: [
                  {
                    language: 'en',
                    text: 'Study funds will pay for certain study-related items and services, such as the sample collection kits and processing the samples. We may bill your health insurer for, among other things, routine items and services you would have received even if you did not take part in the research. You will be responsible for payment of any deductibles and co-payments required by your insurer for this routine care or other billed care. If you have any questions about costs to you that may result from taking part in the research, please speak with the study doctors and study staff. If necessary, we will arrange for you to speak with someone in Patient Financial Services about these costs.'
                  },
                  {
                    language: 'es',
                    text: 'Con los fondos del estudio se pagarán ciertos elementos y servicios relacionados con la investigación, [ES: such as the sample collection kits and processing the samples.] Es posible que le cobremos a su aseguradora los elementos y servicios habituales que recibiría aunque no participara en la investigación, entre otras cosas. Usted deberá hacerse cargo de pagar cualquier deducible y copago que requiera su aseguradora para la atención habitual u otros servicios de atención facturados. Si tiene alguna pregunta sobre los gastos que pueden surgir por participar en la investigación, hable con las médicas y el personal del estudio. Si es necesario, lo conectaremos con un encargado del sector de servicios financieros para pacientes para que hable con esta persona sobre los gastos.'
                  },
                  {
                    language: 'ht',
                    text: 'Lajan etid la pral peye pou sèten atik ak sèvis anrapò ak etid la, [HT: such as the sample collection kits and processing the samples.] Nou ka faktire konpayi asirans sante ou a, nan pami lòt bagay, pou atik ak sèvis woutin ou t ap resevwa menm si w pa t patisipe nan rechèch la. Ou pral responsab peye nenpòt dediktib ak ko-peman ke konpayi asirans ou a egzije pou swen woutin sa yo oswa lòt swen yo faktire. Si w gen nenpòt kesyon sou frè ou ta ka gen pou w peye akòz patisipasyon w nan rechèch la, tanpri pale sa avèk doktè etid yo ak estaf etid la. Si sa nesesè, n ap fè aranjman pou w pale avèk yon moun nan sèvis finansye pasyan apwopo depans sa yo.'
                  }
                ]
              }
            ]
          },
          titleTemplate: {
            templateText: '<h3>$tb_consent_s3_cost_title</h3>',
            templateType: 'HTML',
            variables: [
              {
                name: 'tb_consent_s3_cost_title',
                translations: [
                  {
                    language: 'en',
                    text: 'What will you have to pay for if you take part in this research study?'
                  },
                  {
                    language: 'es',
                    text: '¿Qué tendrá que pagar si participa en este estudio de investigación?'
                  },
                  {
                    language: 'ht',
                    text: 'Kisa w pral gen pou w peye si w patisipe nan etid rechèch sa a?'
                  }
                ]
              }
            ]
          }
        },
        {
          blockType: 'CONTENT',
          bodyTemplate: {
            templateText: '\n          <p>$tb_consent_s3_injured_p1</p>\n          <p>$tb_consent_s3_injured_p2</p>\n          <p>$tb_consent_s3_injured_p3</p>\n        ',
            templateType: 'HTML',
            variables: [
              {
                name: 'tb_consent_s3_injured_p1',
                translations: [
                  {
                    language: 'en',
                    text: 'We will offer you the care needed to treat any injury that directly results from taking part in this research study. We reserve the right to bill your insurance company or other third parties, if appropriate, for the care you get for the injury. We will try to have these costs paid for, but you may be responsible for some of them. For examples, if the care is billed to your insurer, you will be responsible for payment of any deductibles and co-payments required by your insurer.'
                  },
                  {
                    language: 'es',
                    text: '[ES: We will offer you the care needed to treat any injury that directly results from taking part in this research study. We reserve the right to bill your insurance company or other third parties, if appropriate, for the care you get for the injury. We will try to have these costs paid for, but you may be responsible for some of them. For examples, if the care is billed to your insurer, you will be responsible for payment of any deductibles and co-payments required by your insurer.]'
                  },
                  {
                    language: 'ht',
                    text: '[HT: We will offer you the care needed to treat any injury that directly results from taking part in this research study. We reserve the right to bill your insurance company or other third parties, if appropriate, for the care you get for the injury. We will try to have these costs paid for, but you may be responsible for some of them. For examples, if the care is billed to your insurer, you will be responsible for payment of any deductibles and co-payments required by your insurer.]'
                  }
                ]
              },
              {
                name: 'tb_consent_s3_injured_p2',
                translations: [
                  {
                    language: 'en',
                    text: 'Injuries sometimes happen in research even when no one is at fault. There are no plans to pay you or give you other compensation for an injury, should one occur. However, you are not giving up any of your legal rights by signing this form.'
                  },
                  {
                    language: 'es',
                    text: 'En las investigaciones, a veces se producen lesiones aunque nadie tenga la culpa. No planeamos pagarle ni darle ningún tipo de indemnización en el caso de que sufra alguna lesión. Sin embargo, al firmar este formulario no renuncia a ninguno de los derechos que le otorga la ley.'
                  },
                  {
                    language: 'ht',
                    text: 'Chòk rive pafwa nan rechèch menm lè pèsonn pa antò. Yo pa prevwa pou peye w ni ba ou lòt konpansasyon pou yon chòk, si youn ta rive. Sepandan, lè w siyen fòmilè sa a, ou pa renonse a okenn nan dwa legal ou yo.'
                  }
                ]
              },
              {
                name: 'tb_consent_s3_injured_p3',
                translations: [
                  {
                    language: 'en',
                    text: 'If you think you have been injured or have experienced a medical problem as a result of taking part in this research study, tell the person in charge of this study as soon as possible. The researcher\'s name and phone number are listed in the beginning of this consent form.'
                  },
                  {
                    language: 'es',
                    text: 'Si cree que ha sufrido una lesión o tiene algún problema de salud por participar en este estudio de investigación, informe cuanto antes a la persona encargada del estudio. El nombre y el número de teléfono de la investigadora figuran al inicio de este formulario de consentimiento.'
                  },
                  {
                    language: 'ht',
                    text: 'Si w panse ou te pran chòk oswa w te gen yon pwoblèm medikal akòz patisipasyon w nan etid rechèch sa a, enfòme moun ki responsab etid sa a sa san w pa pèdi tan. Non ak nimewo telefòn chèchè a endike nan kòmansman fòmilè konsantman sa a.'
                  }
                ]
              }
            ]
          },
          titleTemplate: {
            templateText: '<h3>$tb_consent_s3_injured_title</h3>',
            templateType: 'HTML',
            variables: [
              {
                name: 'tb_consent_s3_injured_title',
                translations: [
                  {
                    language: 'en',
                    text: 'What happens if you are injured as a result of taking part in this research study?'
                  },
                  {
                    language: 'es',
                    text: '¿Qué sucede si sufre alguna lesión por participar en este estudio de investigación?'
                  },
                  {
                    language: 'ht',
                    text: 'Kisa ki rive si w pran chòk akòz patisipasyon w nan etid rechèch sa a?'
                  }
                ]
              }
            ]
          }
        },
        {
          blockType: 'CONTENT',
          bodyTemplate: {
            templateText: '\n          <p>$tb_consent_s3_privacy_p1</p>\n          <p><strong>$tb_consent_s3_privacy_collect_title</strong></p>\n          <ul>\n            <li>$tb_consent_s3_privacy_collect_item1</li>\n            <li>$tb_consent_s3_privacy_collect_item2</li>\n          </ul>\n          <p><strong>$tb_consent_s3_privacy_who_title</strong></p>\n          <ul>\n            <li>$tb_consent_s3_privacy_who_item1</li>\n            <li>$tb_consent_s3_privacy_who_item2</li>\n            <li>$tb_consent_s3_privacy_who_item3</li>\n            <li>$tb_consent_s3_privacy_who_item4</li>\n            <li>$tb_consent_s3_privacy_who_item5</li>\n            <li>$tb_consent_s3_privacy_who_item6</li>\n            <li>$tb_consent_s3_privacy_who_item7</li>\n            <li>$tb_consent_s3_privacy_who_item8</li>\n            <li>$tb_consent_s3_privacy_who_item9</li>\n            <li>$tb_consent_s3_privacy_who_item10</li>\n          </ul>\n          <p>$tb_consent_s3_privacy_p2</p>\n          <p>$tb_consent_s3_privacy_p3</p>\n          <p>$tb_consent_s3_privacy_p4</p>\n        ',
            templateType: 'HTML',
            variables: [
              {
                name: 'tb_consent_s3_privacy_p1',
                translations: [
                  {
                    language: 'en',
                    text: 'Federal law requires Partners to protect the privacy of health information and related information that identifies you. We refer to this information as “identifiable information.”'
                  },
                  {
                    language: 'es',
                    text: '[ES: Federal law requires Partners to protect the privacy of health information and related information that identifies you. We refer to this information as “identifiable information.”]'
                  },
                  {
                    language: 'ht',
                    text: '[HT: Federal law requires Partners to protect the privacy of health information and related information that identifies you. We refer to this information as “identifiable information.”]'
                  }
                ]
              },
              {
                name: 'tb_consent_s3_privacy_collect_title',
                translations: [
                  {
                    language: 'en',
                    text: 'In this study, we may collect identifiable information about you from:'
                  },
                  {
                    language: 'es',
                    text: '[ES: In this study, we may collect identifiable information about you from:]'
                  },
                  {
                    language: 'ht',
                    text: '[HT: In this study, we may collect identifiable information about you from:]'
                  }
                ]
              },
              {
                name: 'tb_consent_s3_privacy_collect_item1',
                translations: [
                  {
                    language: 'en',
                    text: 'Past, present, and future medical records'
                  },
                  {
                    language: 'es',
                    text: '[ES: Past, present, and future medical records]'
                  },
                  {
                    language: 'ht',
                    text: '[HT: Past, present, and future medical records]'
                  }
                ]
              },
              {
                name: 'tb_consent_s3_privacy_collect_item2',
                translations: [
                  {
                    language: 'en',
                    text: 'Research procedures, including research office visits, tests, interviews, and questionnaires'
                  },
                  {
                    language: 'es',
                    text: '[ES: Research procedures, including research office visits, tests, interviews, and questionnaires]'
                  },
                  {
                    language: 'ht',
                    text: '[HT: Research procedures, including research office visits, tests, interviews, and questionnaires]'
                  }
                ]
              },
              {
                name: 'tb_consent_s3_privacy_who_title',
                translations: [
                  {
                    language: 'en',
                    text: 'Who may see, use, and share your identifiable information and why they may need to do so:'
                  },
                  {
                    language: 'es',
                    text: '[ES: Who may see, use, and share your identifiable information and why they may need to do so:]'
                  },
                  {
                    language: 'ht',
                    text: '[HT: Who may see, use, and share your identifiable information and why they may need to do so:]'
                  }
                ]
              },
              {
                name: 'tb_consent_s3_privacy_who_item1',
                translations: [
                  {
                    language: 'en',
                    text: 'Partners researchers and staff involved in this study'
                  },
                  {
                    language: 'es',
                    text: '[ES: Partners researchers and staff involved in this study]'
                  },
                  {
                    language: 'ht',
                    text: '[HT: Partners researchers and staff involved in this study]'
                  }
                ]
              },
              {
                name: 'tb_consent_s3_privacy_who_item2',
                translations: [
                  {
                    language: 'en',
                    text: 'The sponsor(s) of the study, and people or groups it hires to help perform this research or to audit the research'
                  },
                  {
                    language: 'es',
                    text: '[ES: The sponsor(s) of the study, and people or groups it hires to help perform this research or to audit the research]'
                  },
                  {
                    language: 'ht',
                    text: '[HT: The sponsor(s) of the study, and people or groups it hires to help perform this research or to audit the research]'
                  }
                ]
              },
              {
                name: 'tb_consent_s3_privacy_who_item3',
                translations: [
                  {
                    language: 'en',
                    text: 'Other researchers and medical centers that are part of this study'
                  },
                  {
                    language: 'es',
                    text: '[ES: Other researchers and medical centers that are part of this study]'
                  },
                  {
                    language: 'ht',
                    text: '[HT: Other researchers and medical centers that are part of this study]'
                  }
                ]
              },
              {
                name: 'tb_consent_s3_privacy_who_item4',
                translations: [
                  {
                    language: 'en',
                    text: 'The Partners ethics board or an ethics board outside Partners that oversees the research'
                  },
                  {
                    language: 'es',
                    text: '[ES: The Partners ethics board or an ethics board outside Partners that oversees the research]'
                  },
                  {
                    language: 'ht',
                    text: '[HT: The Partners ethics board or an ethics board outside Partners that oversees the research]'
                  }
                ]
              },
              {
                name: 'tb_consent_s3_privacy_who_item5',
                translations: [
                  {
                    language: 'en',
                    text: 'A group that oversees the data (study information) and safety of this study'
                  },
                  {
                    language: 'es',
                    text: '[ES: A group that oversees the data (study information) and safety of this study]'
                  },
                  {
                    language: 'ht',
                    text: '[HT: A group that oversees the data (study information) and safety of this study]'
                  }
                ]
              },
              {
                name: 'tb_consent_s3_privacy_who_item6',
                translations: [
                  {
                    language: 'en',
                    text: 'Non-research staff within Partners who need identifiable information to do their jobs, such as for treatment, payment (billing), or hospital operations (such as assessing the quality of care or research)'
                  },
                  {
                    language: 'es',
                    text: '[ES: Non-research staff within Partners who need identifiable information to do their jobs, such as for treatment, payment (billing), or hospital operations (such as assessing the quality of care or research)]'
                  },
                  {
                    language: 'ht',
                    text: '[HT: Non-research staff within Partners who need identifiable information to do their jobs, such as for treatment, payment (billing), or hospital operations (such as assessing the quality of care or research)]'
                  }
                ]
              },
              {
                name: 'tb_consent_s3_privacy_who_item7',
                translations: [
                  {
                    language: 'en',
                    text: 'People or groups that we hire to do certain work for us, such as data storage companies, accreditors, insurers, and lawyers'
                  },
                  {
                    language: 'es',
                    text: '[ES: People or groups that we hire to do certain work for us, such as data storage companies, accreditors, insurers, and lawyers]'
                  },
                  {
                    language: 'ht',
                    text: '[HT: People or groups that we hire to do certain work for us, such as data storage companies, accreditors, insurers, and lawyers]'
                  }
                ]
              },
              {
                name: 'tb_consent_s3_privacy_who_item8',
                translations: [
                  {
                    language: 'en',
                    text: 'Federal agencies (such as the U.S. Department of Health and Human Services (DHHS) and agencies within DHHS like the Food and Drug Administration, the National Institutes of Health, and the Office for Human Research Protections), state agencies, and foreign government bodies that oversee, evaluate, and audit research, which may include inspection of your records'
                  },
                  {
                    language: 'es',
                    text: '[ES: Federal agencies (such as the U.S. Department of Health and Human Services (DHHS) and agencies within DHHS like the Food and Drug Administration, the National Institutes of Health, and the Office for Human Research Protections), state agencies, and foreign government bodies that oversee, evaluate, and audit research, which may include inspection of your records]'
                  },
                  {
                    language: 'ht',
                    text: '[HT: Federal agencies (such as the U.S. Department of Health and Human Services (DHHS) and agencies within DHHS like the Food and Drug Administration, the National Institutes of Health, and the Office for Human Research Protections), state agencies, and foreign government bodies that oversee, evaluate, and audit research, which may include inspection of your records]'
                  }
                ]
              },
              {
                name: 'tb_consent_s3_privacy_who_item9',
                translations: [
                  {
                    language: 'en',
                    text: 'Public health and safety authorities, if we learn information that could mean harm to you or others (such as to make required reports about communicable diseases or about child or elder abuse)'
                  },
                  {
                    language: 'es',
                    text: '[ES: Public health and safety authorities, if we learn information that could mean harm to you or others (such as to make required reports about communicable diseases or about child or elder abuse)]'
                  },
                  {
                    language: 'ht',
                    text: '[HT: Public health and safety authorities, if we learn information that could mean harm to you or others (such as to make required reports about communicable diseases or about child or elder abuse)]'
                  }
                ]
              },
              {
                name: 'tb_consent_s3_privacy_who_item10',
                translations: [
                  {
                    language: 'en',
                    text: 'Other:'
                  },
                  {
                    language: 'es',
                    text: '[ES: Other:]'
                  },
                  {
                    language: 'ht',
                    text: '[HT: Other:]'
                  }
                ]
              },
              {
                name: 'tb_consent_s3_privacy_p2',
                translations: [
                  {
                    language: 'en',
                    text: 'Some people or groups who get your identifiable information might not have to follow the same privacy rules that we follow and might use or share your identifiable information without your permission in ways that are not described in this form. For example, we understand that the sponsor of this study may use your identifiable information to perform additional research on various products or conditions, to obtain regulatory approval of its products, to propose new products, and to oversee and improve its products’ performance. We share your identifiable information only when we must, and we ask anyone who receives it from us to take measures to protect your privacy. The sponsor has agreed that it will not contact you without your permission and will not use or share your identifiable information for any mailing or marketing list. However, once your identifiable information is shared outside Partners, we cannot control all the ways that others use or share it and cannot promise that it will remain private.'
                  },
                  {
                    language: 'es',
                    text: '[ES: Some people or groups who get your identifiable information might not have to follow the same privacy rules that we follow and might use or share your identifiable information without your permission in ways that are not described in this form. For example, we understand that the sponsor of this study may use your identifiable information to perform additional research on various products or conditions, to obtain regulatory approval of its products, to propose new products, and to oversee and improve its products’ performance. We share your identifiable information only when we must, and we ask anyone who receives it from us to take measures to protect your privacy. The sponsor has agreed that it will not contact you without your permission and will not use or share your identifiable information for any mailing or marketing list. However, once your identifiable information is shared outside Partners, we cannot control all the ways that others use or share it and cannot promise that it will remain private.]'
                  },
                  {
                    language: 'ht',
                    text: '[HT: Some people or groups who get your identifiable information might not have to follow the same privacy rules that we follow and might use or share your identifiable information without your permission in ways that are not described in this form. For example, we understand that the sponsor of this study may use your identifiable information to perform additional research on various products or conditions, to obtain regulatory approval of its products, to propose new products, and to oversee and improve its products’ performance. We share your identifiable information only when we must, and we ask anyone who receives it from us to take measures to protect your privacy. The sponsor has agreed that it will not contact you without your permission and will not use or share your identifiable information for any mailing or marketing list. However, once your identifiable information is shared outside Partners, we cannot control all the ways that others use or share it and cannot promise that it will remain private.]'
                  }
                ]
              },
              {
                name: 'tb_consent_s3_privacy_p3',
                translations: [
                  {
                    language: 'en',
                    text: 'Because research is an ongoing process, we cannot give you an exact date when we will either destroy or stop using or sharing your identifiable information. Your permission to use and share your identifiable information does not expire.'
                  },
                  {
                    language: 'es',
                    text: '[ES: Because research is an ongoing process, we cannot give you an exact date when we will either destroy or stop using or sharing your identifiable information. Your permission to use and share your identifiable information does not expire.]'
                  },
                  {
                    language: 'ht',
                    text: '[HT: Because research is an ongoing process, we cannot give you an exact date when we will either destroy or stop using or sharing your identifiable information. Your permission to use and share your identifiable information does not expire.]'
                  }
                ]
              },
              {
                name: 'tb_consent_s3_privacy_p4',
                translations: [
                  {
                    language: 'en',
                    text: 'The results of this research study may be published in a medical book or journal, or used to teach others. However, your name or other identifiable information <strong>will not</strong> be used for these purposes without your specific permission.'
                  },
                  {
                    language: 'es',
                    text: 'Es posible que los resultados de este estudio de investigación se publiquen en libros o revistas médicas o que se utilicen para instruir a otras personas. No obstante, para esos fines <strong>no se utilizará</strong> su nombre ni otros datos identificables sin su permiso expreso.'
                  },
                  {
                    language: 'ht',
                    text: 'Yo ka pibliye rezilta etid rechèch sa a nan yon liv medikal oswa yon jounal, osinon itilize yo pou anseye lòt moun. Sepandan, nan objektif sa yo, yo <strong>p ap itilize</strong> non w ni lòt enfòmasyon ki ka idantifye w san otorizasyon w presizeman.'
                  }
                ]
              }
            ]
          },
          titleTemplate: {
            templateText: '<h3>$tb_consent_s3_privacy_title</h3>',
            templateType: 'HTML',
            variables: [
              {
                name: 'tb_consent_s3_privacy_title',
                translations: [
                  {
                    language: 'en',
                    text: 'If you take part in this research study, how will we protect your privacy?'
                  },
                  {
                    language: 'es',
                    text: 'Si participa en este estudio de investigación, ¿cómo protegeremos su privacidad?'
                  },
                  {
                    language: 'ht',
                    text: 'Si w patisipe nan etid rechèch sa a, kijan nou pral pwoteje vi prive w?'
                  }
                ]
              }
            ]
          }
        },
        {
          blockType: 'CONTENT',
          bodyTemplate: {
            templateText: '\n          <p>$tb_consent_s3_rights_p1</p>\n          <p>$tb_consent_s3_rights_p2</p>\n          <p>$tb_consent_s3_rights_p3</p>\n          <p>$tb_consent_s3_rights_p4</p>\n        ',
            templateType: 'HTML',
            variables: [
              {
                name: 'tb_consent_s3_rights_p1',
                translations: [
                  {
                    language: 'en',
                    text: 'You have the right <strong>not</strong> to sign this form that allows us to use and share your identifiable information for research; however, if you don\'t sign it, you can\'t take part in this research study.'
                  },
                  {
                    language: 'es',
                    text: 'Usted tiene derecho a <strong>no</strong> firmar este formulario que nos permite utilizar y divulgar su información identificatoria con fines investigativos. Sin embargo, si no lo firma, no podrá participar en este estudio de investigación.'
                  },
                  {
                    language: 'ht',
                    text: 'Ou gen dwa pou <strong>pa</strong> siyen fòmilè sa a ki pèmèt nou itilize ak pataje enfòmasyon ki idantifye w pou rechèch; men, si w pa siyen li, ou pa kapab patisipe nan etid rechèch sa a.'
                  }
                ]
              },
              {
                name: 'tb_consent_s3_rights_p2',
                translations: [
                  {
                    language: 'en',
                    text: 'You have the right to withdraw your permission for us to use or share your identifiable information for this research study. If you want to withdraw your permission, you must notify the person in charge of this research study in writing. Once permission is withdrawn, you cannot continue to take part in the study.'
                  },
                  {
                    language: 'es',
                    text: 'Tiene derecho a retirar su permiso para que usemos o divulguemos su información identificatoria con los fines de este estudio de investigación. Si desea retirar su permiso, debe notificar por escrito a la persona encargada de este estudio de investigación. Una vez que se haya retirado el permiso, no podrá continuar participando en el estudio.'
                  },
                  {
                    language: 'ht',
                    text: 'Ou gen dwa pou w anile otorizasyon ou ban nou pou n itilize oswa kominike enfòmasyon ki ka idantifye w pou etid rechèch sa a. Si w vle anile otorizasyon ou an, ou dwe enfòme moun ki responsab etid rechèch sa a alekri. On fwa ou retire otorizasyon ou an, ou pa kapab kontinye patisipe nan etid la.'
                  }
                ]
              },
              {
                name: 'tb_consent_s3_rights_p3',
                translations: [
                  {
                    language: 'en',
                    text: 'If you withdraw your permission, we will not be able to take back information that has already been used or shared with others, and such information may continue to be used for certain purposes, such as to comply with the law or maintain the reliability of the study.'
                  },
                  {
                    language: 'es',
                    text: 'Si retira su permiso, no podremos recuperar la información que ya se haya utilizado o compartido con otros, y esa información se podrá seguir utilizando para ciertos fines; por ejemplo, para cumplir con la ley o mantener la confiabilidad del estudio.'
                  },
                  {
                    language: 'ht',
                    text: 'Si w anile otorizasyon ou an, nou p ap kapab reprann enfòmasyon nou te deja itilize oswa kominike bay lòt moun, epi yo gendwa kontinye itilize enfòmasyon sa yo pou sèten objektif, pa egzanp pou respekte lalwa oswa pou konsève fyabilite etid la.'
                  }
                ]
              },
              {
                name: 'tb_consent_s3_rights_p4',
                translations: [
                  {
                    language: 'en',
                    text: 'You have the right to see and get a copy of your identifiable information that is used or shared for treatment or for payment. To ask for this information, please contact the person in charge of this research study. You may only get such information after the research is finished.'
                  },
                  {
                    language: 'es',
                    text: 'Usted tiene derecho a consultar la información identificable que se utilice o divulgue para administrar tratamientos o realizar pagos. También tiene derecho a obtener una copia de dichos datos. Para solicitarlos, comuníquese con la persona encargada de este estudio de investigación. Solo podrá recibir los datos una vez que la investigación haya terminado.'
                  },
                  {
                    language: 'ht',
                    text: 'Ou gen dwa pou w gade ak pou jwenn yon kopi enfòmasyon ki ka idantifye w ke yo itilize oswa kominike pou tretman oswa pou peman. Pou mande enfòmasyon sa yo, tanpri kontakte moun ki responsab etid rechèch sa a. Ou ka jwenn enfòmasyon sa yo apre rechèch la fini sèlman.'
                  }
                ]
              }
            ]
          },
          titleTemplate: {
            templateText: '<h3>$tb_consent_s3_rights_title</h3>',
            templateType: 'HTML',
            variables: [
              {
                name: 'tb_consent_s3_rights_title',
                translations: [
                  {
                    language: 'en',
                    text: 'Your Privacy Rights'
                  },
                  {
                    language: 'es',
                    text: 'Sus derechos de privacidad'
                  },
                  {
                    language: 'ht',
                    text: 'Dwa sou vi prive w'
                  }
                ]
              }
            ]
          }
        }
      ],
      icons: [],
      nameTemplate: {
        templateText: '$tb_consent_s3_name',
        templateType: 'TEXT',
        variables: [
          {
            name: 'tb_consent_s3_name',
            translations: [
              {
                language: 'en',
                text: 'Full Form'
              },
              {
                language: 'es',
                text: 'Formulario completo'
              },
              {
                language: 'ht',
                text: 'Fòmilè konplè'
              }
            ]
          }
        ]
      }
    },
    {
      blocks: [
        {
          blockType: 'CONTENT',
          bodyTemplate: {
            templateText: '<h2>$tb_consent_s4_title</h2>',
            templateType: 'HTML',
            variables: [
              {
                name: 'tb_consent_s4_title',
                translations: [
                  {
                    language: 'en',
                    text: 'Informed Consent and Authorization'
                  },
                  {
                    language: 'es',
                    text: 'Consentimiento informado y autorización'
                  },
                  {
                    language: 'ht',
                    text: 'Konsantman eklere ak otorizasyon'
                  }
                ]
              }
            ]
          },
          shownExpr: null,
          titleTemplate: null
        },
        {
          blockType: 'QUESTION',
          question: {
            additionalInfoFooterTemplate: null,
            additionalInfoHeaderTemplate: null,
            groups: [],
            hideNumber: true,
            isDeprecated: false,
            isRestricted: false,
            picklistLabelTemplate: null,
            picklistOptions: [
              {
                optionLabelTemplate: {
                  templateText: '$who_filling_self',
                  templateType: 'TEXT',
                  variables: [
                    {
                      name: 'who_filling_self',
                      translations: [
                        {
                          language: 'en',
                          text: 'I am filling it out for myself.'
                        },
                        {
                          language: 'es',
                          text: 'Lo completo por mi cuenta.'
                        },
                        {
                          language: 'ht',
                          text: 'M ap ranpli l pou tèt pa m.'
                        }
                      ]
                    }
                  ]
                },
                stableId: 'SELF'
              },
              {
                optionLabelTemplate: {
                  templateText: '$who_filling_staff',
                  templateType: 'TEXT',
                  variables: [
                    {
                      name: 'who_filling_staff',
                      translations: [
                        {
                          language: 'en',
                          text: 'I am a study doctor enrolling a participant.'
                        },
                        {
                          language: 'es',
                          text: 'Soy una de las médicas del estudio y deseo inscribir a un participante.'
                        },
                        {
                          language: 'ht',
                          text: 'Mwen se yon doktè etid k ap enskri yon patisipan.'
                        }
                      ]
                    }
                  ]
                },
                stableId: 'STAFF'
              }
            ],
            promptTemplate: {
              templateText: '$who_filling_prompt',
              templateType: 'HTML',
              variables: [
                {
                  name: 'who_filling_prompt',
                  translations: [
                    {
                      language: 'en',
                      text: 'Who is filling out this form?'
                    },
                    {
                      language: 'es',
                      text: '¿Quién completa este formulario?'
                    },
                    {
                      language: 'ht',
                      text: 'Ki moun k ap ranpli fòmilè sa a?'
                    }
                  ]
                }
              ]
            },
            questionType: 'PICKLIST',
            renderMode: 'LIST',
            selectMode: 'SINGLE',
            stableId: 'WHO_FILLING',
            validations: [
              {
                hintTemplate: {
                  templateText: '$who_filling_req_hint',
                  templateType: 'TEXT',
                  variables: [
                    {
                      name: 'who_filling_req_hint',
                      translations: [
                        {
                          language: 'en',
                          text: 'Please select an option'
                        },
                        {
                          language: 'es',
                          text: 'Seleccione una opción.'
                        },
                        {
                          language: 'ht',
                          text: 'Tanpri, chwazi yon opsyon'
                        }
                      ]
                    }
                  ]
                },
                ruleType: 'REQUIRED'
              }
            ]
          },
          shownExpr: null
        },
        {
          blockType: 'CONTENT',
          bodyTemplate: {
            templateText: '<p>$tb_consent_s4_store_sample_statement</p>',
            templateType: 'HTML',
            variables: [
              {
                name: 'tb_consent_s4_store_sample_statement',
                translations: [
                  {
                    language: 'en',
                    text: 'Because your samples and/or health information are identifiable, we are asking your permission to store, use and share your samples for other research. You can still take part in this research study whether or not you give permission for the storage, use, and sharing of the samples and health information for other research.'
                  },
                  {
                    language: 'es',
                    text: '[ES: Because your samples and/or health information are identifiable, we are asking your permission to store, use and share your samples for other research. You can still take part in this research study whether or not you give permission for the storage, use, and sharing of the samples and health information for other research.]'
                  },
                  {
                    language: 'ht',
                    text: '[HT: Because your samples and/or health information are identifiable, we are asking your permission to store, use and share your samples for other research. You can still take part in this research study whether or not you give permission for the storage, use, and sharing of the samples and health information for other research.]'
                  }
                ]
              }
            ]
          },
          shownExpr: 'user.studies["testboston"].forms["CONSENT"].questions["WHO_FILLING"].isAnswered()',
          titleTemplate: null
        },
        {
          blockType: 'QUESTION',
          question: {
            additionalInfoFooterTemplate: null,
            additionalInfoHeaderTemplate: null,
            falseTemplate: {
              templateText: '$store_sample_no',
              templateType: 'TEXT',
              variables: [
                {
                  name: 'store_sample_no',
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
            hideNumber: true,
            isDeprecated: false,
            isRestricted: false,
            promptTemplate: {
              templateText: '$store_sample_prompt',
              templateType: 'HTML',
              variables: [
                {
                  name: 'store_sample_prompt',
                  translations: [
                    {
                      language: 'en',
                      text: 'Do you agree to let us store and use your samples and health information for other research related to COVID-19?'
                    },
                    {
                      language: 'es',
                      text: '¿Está de acuerdo con que guardemos y utilicemos sus muestras y su información médica para otras investigaciones relacionadas con COVID-19?'
                    },
                    {
                      language: 'ht',
                      text: 'Èske w dakò kite nou estoke epi itilize echantiyon ou yo ak enfòmasyon sou sante ou yo pou lòt rechèch anrapò ak COVID-19?'
                    }
                  ]
                }
              ]
            },
            questionType: 'BOOLEAN',
            stableId: 'STORE_SAMPLE',
            trueTemplate: {
              templateText: '$store_sample_yes',
              templateType: 'TEXT',
              variables: [
                {
                  name: 'store_sample_yes',
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
            validations: [
              {
                hintTemplate: {
                  templateText: '$store_sample_req_hint',
                  templateType: 'TEXT',
                  variables: [
                    {
                      name: 'store_sample_req_hint',
                      translations: [
                        {
                          language: 'en',
                          text: 'Please select an option'
                        },
                        {
                          language: 'es',
                          text: 'Seleccione una opción.'
                        },
                        {
                          language: 'ht',
                          text: 'Tanpri, chwazi yon opsyon'
                        }
                      ]
                    }
                  ]
                },
                ruleType: 'REQUIRED'
              }
            ]
          },
          shownExpr: 'user.studies["testboston"].forms["CONSENT"].questions["WHO_FILLING"].isAnswered()'
        },
        {
          blockType: 'QUESTION',
          question: {
            additionalInfoFooterTemplate: null,
            additionalInfoHeaderTemplate: null,
            hideNumber: true,
            inputType: 'TEXT',
            isDeprecated: false,
            isRestricted: true,
            placeholderTemplate: null,
            promptTemplate: {
              templateText: '$initial_prompt',
              templateType: 'HTML',
              variables: [
                {
                  name: 'initial_prompt',
                  translations: [
                    {
                      language: 'en',
                      text: 'Initial'
                    },
                    {
                      language: 'es',
                      text: 'Iniciales'
                    },
                    {
                      language: 'ht',
                      text: 'Paraf'
                    }
                  ]
                }
              ]
            },
            questionType: 'TEXT',
            stableId: 'INITIAL',
            suggestionType: 'NONE',
            suggestions: [],
            validations: [
              {
                hintTemplate: {
                  templateText: '$initial_req_hint',
                  templateType: 'TEXT',
                  variables: [
                    {
                      name: 'initial_req_hint',
                      translations: [
                        {
                          language: 'en',
                          text: 'Initial is required'
                        },
                        {
                          language: 'es',
                          text: 'La inicial es obligatoria.'
                        },
                        {
                          language: 'ht',
                          text: 'Paraf la obligatwa'
                        }
                      ]
                    }
                  ]
                },
                ruleType: 'REQUIRED'
              },
              {
                hintTemplate: {
                  templateText: '$initial_length_hint',
                  templateType: 'TEXT',
                  variables: [
                    {
                      name: 'initial_length_hint',
                      translations: [
                        {
                          language: 'en',
                          text: 'Initial cannot exceed max length'
                        },
                        {
                          language: 'es',
                          text: 'La inicial no puede superar el máximo número de caracteres.'
                        },
                        {
                          language: 'ht',
                          text: 'Paraf la pa kapab depase longè maksimòm lan'
                        }
                      ]
                    }
                  ]
                },
                maxLength: 10,
                ruleType: 'LENGTH'
              }
            ]
          },
          shownExpr: 'user.studies["testboston"].forms["CONSENT"].questions["WHO_FILLING"].isAnswered()'
        },
        {
          blockType: 'CONTENT',
          bodyTemplate: {
            templateText: '\n          <ul>\n            <li>$tb_consent_s4_self_auth_item1</li>\n            <li>$tb_consent_s4_self_auth_item2</li>\n            <li>$tb_consent_s4_self_auth_item3</li>\n            <li>$tb_consent_s4_self_auth_item4</li>\n          </ul>\n        ',
            templateType: 'HTML',
            variables: [
              {
                name: 'tb_consent_s4_self_auth_item1',
                translations: [
                  {
                    language: 'en',
                    text: 'I have read this consent form.'
                  },
                  {
                    language: 'es',
                    text: 'He leído este formulario de consentimiento.'
                  },
                  {
                    language: 'ht',
                    text: 'Mwen te li fòmilè konsantman sa a.'
                  }
                ]
              },
              {
                name: 'tb_consent_s4_self_auth_item2',
                translations: [
                  {
                    language: 'en',
                    text: 'This research study has been explained to me, including risks and possible benefits (if any), other possible treatments or procedures, and other important things about the study.'
                  },
                  {
                    language: 'es',
                    text: 'Me han explicado el estudio de investigación, así como sus riesgos y posibles ventajas (si las hay), otros posibles tratamientos o procedimientos y otros aspectos importantes.'
                  },
                  {
                    language: 'ht',
                    text: 'Yo eksplike ban mwen etid rechèch sa a, ansanm ak risk epi avantaj ki posib (si genyen), lòt tretman oswa pwosedi ki posib, ak lòt bagay enpòtan konsènan etid la.'
                  }
                ]
              },
              {
                name: 'tb_consent_s4_self_auth_item3',
                translations: [
                  {
                    language: 'en',
                    text: 'I have had the opportunity to ask questions.'
                  },
                  {
                    language: 'es',
                    text: 'He tenido la oportunidad de hacer preguntas.'
                  },
                  {
                    language: 'ht',
                    text: 'Mwen te gen okazyon pou m poze kesyon.'
                  }
                ]
              },
              {
                name: 'tb_consent_s4_self_auth_item4',
                translations: [
                  {
                    language: 'en',
                    text: 'I understand the information given to me.'
                  },
                  {
                    language: 'es',
                    text: 'Entiendo la información que me dieron.'
                  },
                  {
                    language: 'ht',
                    text: 'Mwen konprann enfòmasyon yo ban m yo.'
                  }
                ]
              }
            ]
          },
          shownExpr: 'user.studies["testboston"].forms["CONSENT"].questions["WHO_FILLING"].answers.hasOption("SELF")',
          titleTemplate: {
            templateText: '<h3>$tb_consent_s4_self_auth_title</h3>',
            templateType: 'HTML',
            variables: [
              {
                name: 'tb_consent_s4_self_auth_title',
                translations: [
                  {
                    language: 'en',
                    text: 'Statement of Person Giving Informed Consent and Authorization'
                  },
                  {
                    language: 'es',
                    text: 'Declaración de la persona que da el consentimiento informado y la autorización'
                  },
                  {
                    language: 'ht',
                    text: 'Deklarasyon moun k ap bay konsantman eklere ak otorizasyon'
                  }
                ]
              }
            ]
          }
        },
        {
          blockType: 'CONTENT',
          bodyTemplate: {
            templateText: '<p>$tb_consent_s4_self_sign_statement</p>',
            templateType: 'HTML',
            variables: [
              {
                name: 'tb_consent_s4_self_sign_statement',
                translations: [
                  {
                    language: 'en',
                    text: 'I give my consent to take part in this research study and agree to allow my health information to be used and shared as described above.'
                  },
                  {
                    language: 'es',
                    text: 'Doy mi consentimiento para participar en este estudio de investigación y acepto que mi información médica se utilice y divulgue como se explicó anteriormente.'
                  },
                  {
                    language: 'ht',
                    text: 'Mwen bay konsantman m pou m patisipe nan etid rechèch sa a epi mwen aksepte pou otorize yo itilize ak pataje enfòmasyon sou sante m jan sa dekri anwo a.'
                  }
                ]
              }
            ]
          },
          shownExpr: 'user.studies["testboston"].forms["CONSENT"].questions["WHO_FILLING"].answers.hasOption("SELF")',
          titleTemplate: {
            templateText: '<h3>$tb_consent_s4_self_sign_title</h3>',
            templateType: 'HTML',
            variables: [
              {
                name: 'tb_consent_s4_self_sign_title',
                translations: [
                  {
                    language: 'en',
                    text: 'Signature of Subject:'
                  },
                  {
                    language: 'es',
                    text: 'Firma del participante voluntario:'
                  },
                  {
                    language: 'ht',
                    text: 'Siyati sijè a:'
                  }
                ]
              }
            ]
          }
        },
        {
          blockType: 'CONTENT',
          bodyTemplate: {
            templateText: '\n          <div class="subject">\n            <div class="subject__block">\n              <h4 class="static-header">$tb_consent_s4_first_name</h4>\n              <p class="static-text">$ddp.participantFirstName()</p>\n            </div>\n            <div class="subject__block">\n              <h4 class="static-header">$tb_consent_s4_last_name</h4>\n              <p class="static-text">$ddp.participantLastName()</p>\n            </div>\n          </div>\n        ',
            templateType: 'HTML',
            variables: [
              {
                name: 'tb_consent_s4_first_name',
                translations: [
                  {
                    language: 'en',
                    text: 'First Name'
                  },
                  {
                    language: 'es',
                    text: 'Nombre'
                  },
                  {
                    language: 'ht',
                    text: 'Premye non'
                  }
                ]
              },
              {
                name: 'tb_consent_s4_last_name',
                translations: [
                  {
                    language: 'en',
                    text: 'Last Name'
                  },
                  {
                    language: 'es',
                    text: 'Apellido'
                  },
                  {
                    language: 'ht',
                    text: 'Dezyèm non'
                  }
                ]
              }
            ]
          },
          shownExpr: 'user.studies["testboston"].forms["CONSENT"].questions["WHO_FILLING"].answers.hasOption("SELF")',
          titleTemplate: null
        },
        {
          blockType: 'QUESTION',
          question: {
            additionalInfoFooterTemplate: null,
            additionalInfoHeaderTemplate: null,
            hideNumber: true,
            inputType: 'SIGNATURE',
            isDeprecated: false,
            isRestricted: true,
            placeholderTemplate: {
              templateText: '$self_sig_placeholder',
              templateType: 'TEXT',
              variables: [
                {
                  name: 'self_sig_placeholder',
                  translations: [
                    {
                      language: 'en',
                      text: 'Type your signature here'
                    },
                    {
                      language: 'es',
                      text: 'Escriba su firma aquí.'
                    },
                    {
                      language: 'ht',
                      text: 'Tape siyati ou a isit la'
                    }
                  ]
                }
              ]
            },
            promptTemplate: {
              templateText: '$self_sig_prompt',
              templateType: 'HTML',
              variables: [
                {
                  name: 'self_sig_prompt',
                  translations: [
                    {
                      language: 'en',
                      text: 'Signature of Subject'
                    },
                    {
                      language: 'es',
                      text: 'Firma del participante voluntario'
                    },
                    {
                      language: 'ht',
                      text: 'Siyati sijè a'
                    }
                  ]
                }
              ]
            },
            questionType: 'TEXT',
            stableId: 'SELF_SIGNATURE',
            suggestionType: 'NONE',
            suggestions: [],
            validations: [
              {
                hintTemplate: {
                  templateText: '$self_sig_req_hint',
                  templateType: 'TEXT',
                  variables: [
                    {
                      name: 'self_sig_req_hint',
                      translations: [
                        {
                          language: 'en',
                          text: 'Signature is required'
                        },
                        {
                          language: 'es',
                          text: 'La firma es obligatoria.'
                        },
                        {
                          language: 'ht',
                          text: 'Siyati a obligatwa'
                        }
                      ]
                    }
                  ]
                },
                ruleType: 'REQUIRED'
              }
            ]
          },
          shownExpr: 'user.studies["testboston"].forms["CONSENT"].questions["WHO_FILLING"].answers.hasOption("SELF")'
        },
        {
          blockType: 'CONTENT',
          bodyTemplate: {
            templateText: '\n          <h4 class="static-header">$tb_consent_s4_date</h4>\n          <p class="static-text">$ddp.date("MM-dd-uuuu")</p>\n        ',
            templateType: 'HTML',
            variables: [
              {
                name: 'tb_consent_s4_date',
                translations: [
                  {
                    language: 'en',
                    text: 'Date'
                  },
                  {
                    language: 'es',
                    text: 'Fecha'
                  },
                  {
                    language: 'ht',
                    text: 'Dat'
                  }
                ]
              }
            ]
          },
          shownExpr: 'user.studies["testboston"].forms["CONSENT"].questions["WHO_FILLING"].answers.hasOption("SELF")',
          titleTemplate: null
        },
        {
          blockType: 'CONTENT',
          bodyTemplate: {
            templateText: '\n          <ul>\n            <li>$tb_consent_s4_staff_auth_item1</li>\n            <li>$tb_consent_s4_staff_auth_item2</li>\n          </ul>\n        ',
            templateType: 'HTML',
            variables: [
              {
                name: 'tb_consent_s4_staff_auth_item1',
                translations: [
                  {
                    language: 'en',
                    text: 'I have explained the research to the study subject.'
                  },
                  {
                    language: 'es',
                    text: 'Le he explicado la investigación al participante voluntario del estudio.'
                  },
                  {
                    language: 'ht',
                    text: 'Mwen eksplike rechèch la pou sijè etid la.'
                  }
                ]
              },
              {
                name: 'tb_consent_s4_staff_auth_item2',
                translations: [
                  {
                    language: 'en',
                    text: 'I have answered all questions about this research study to the best of my ability.'
                  },
                  {
                    language: 'es',
                    text: 'He respondido todas sus preguntas sobre este estudio de investigación en la medida de mis posibilidades.'
                  },
                  {
                    language: 'ht',
                    text: 'Mwen reponn tout kesyon konsènan etid rechèch sa a nan meyè fason mwen kapab.'
                  }
                ]
              }
            ]
          },
          shownExpr: 'user.studies["testboston"].forms["CONSENT"].questions["WHO_FILLING"].answers.hasOption("STAFF")',
          titleTemplate: {
            templateText: '<h3>$tb_consent_s4_staff_auth_title</h3>',
            templateType: 'HTML',
            variables: [
              {
                name: 'tb_consent_s4_staff_auth_title',
                translations: [
                  {
                    language: 'en',
                    text: 'Statement of Study Doctor or Person Obtaining Consent'
                  },
                  {
                    language: 'es',
                    text: 'Declaración de la médica del estudio o de la persona que recibe el consentimiento'
                  },
                  {
                    language: 'ht',
                    text: 'Deklarasyon doktè etid la oswa moun ki resevwa konsantman an'
                  }
                ]
              }
            ]
          }
        },
        {
          blockType: 'QUESTION',
          question: {
            additionalInfoFooterTemplate: null,
            additionalInfoHeaderTemplate: null,
            hideNumber: true,
            inputType: 'SIGNATURE',
            isDeprecated: false,
            isRestricted: true,
            placeholderTemplate: null,
            promptTemplate: {
              templateText: '$staff_sig_prompt<br/>$staff_sig_prompt_phone',
              templateType: 'HTML',
              variables: [
                {
                  name: 'staff_sig_prompt',
                  translations: [
                    {
                      language: 'en',
                      text: 'Study Doctor or Person Obtaining Consent:'
                    },
                    {
                      language: 'es',
                      text: 'Médica del estudio o persona que recibe el consentimiento:'
                    },
                    {
                      language: 'ht',
                      text: 'Doktè etid la oswa moun ki resevwa konsantman an'
                    }
                  ]
                },
                {
                  name: 'staff_sig_prompt_phone',
                  translations: [
                    {
                      language: 'en',
                      text: 'This verbal consent was obtained by phone.'
                    },
                    {
                      language: 'es',
                      text: 'Este consentimiento verbal se recibió por teléfono.'
                    },
                    {
                      language: 'ht',
                      text: 'Yo te jwenn konsantman nan bouch sa a nan telefòn.'
                    }
                  ]
                }
              ]
            },
            questionType: 'TEXT',
            stableId: 'STAFF_SIGNATURE',
            suggestionType: 'NONE',
            suggestions: [],
            validations: [
              {
                hintTemplate: {
                  templateText: '$staff_sig_req_hint',
                  templateType: 'TEXT',
                  variables: [
                    {
                      name: 'staff_sig_req_hint',
                      translations: [
                        {
                          language: 'en',
                          text: 'Signature is required'
                        },
                        {
                          language: 'es',
                          text: 'La firma es obligatoria.'
                        },
                        {
                          language: 'ht',
                          text: 'Siyati a obligatwa'
                        }
                      ]
                    }
                  ]
                },
                ruleType: 'REQUIRED'
              }
            ]
          },
          shownExpr: 'user.studies["testboston"].forms["CONSENT"].questions["WHO_FILLING"].answers.hasOption("STAFF")'
        },
        {
          blockType: 'CONTENT',
          bodyTemplate: {
            templateText: '\n          <h4 class="static-header">$tb_consent_s4_date</h4>\n          <p class="static-text">$ddp.date("MM-dd-uuuu")</p>\n        ',
            templateType: 'HTML',
            variables: [
              {
                name: 'tb_consent_s4_date',
                translations: [
                  {
                    language: 'en',
                    text: 'Date'
                  },
                  {
                    language: 'es',
                    text: 'Fecha'
                  },
                  {
                    language: 'ht',
                    text: 'Dat'
                  }
                ]
              }
            ]
          },
          shownExpr: 'user.studies["testboston"].forms["CONSENT"].questions["WHO_FILLING"].answers.hasOption("STAFF")',
          titleTemplate: null
        },
        {
          blockType: 'CONTENT',
          bodyTemplate: {
            templateText: '<h3>$tb_consent_s4_interpreter_header</h3>',
            templateType: 'HTML',
            variables: [
              {
                name: 'tb_consent_s4_interpreter_header',
                translations: [
                  {
                    language: 'en',
                    text: 'Consent of Non-English Speaking Subjects Using the "Short Form" in the Subject\'s Spoken Language'
                  },
                  {
                    language: 'es',
                    text: 'Consentimiento de los participantes voluntarios no angloparlantes que utilizan el “formulario breve” en su lengua materna'
                  },
                  {
                    language: 'ht',
                    text: 'Konsantman sijè ki pa pale anglè avèk itilizasyon "fòmilè kout" la ekri nan lang sijè a pale a'
                  }
                ]
              }
            ]
          },
          shownExpr: 'user.studies["testboston"].forms["CONSENT"].questions["WHO_FILLING"].answers.hasOption("STAFF")',
          titleTemplate: null
        },
        {
          blockType: 'CONTENT',
          bodyTemplate: {
            templateText: '\n          <p>$tb_consent_s4_interpreter_auth_statement</p>\n        ',
            templateType: 'HTML',
            variables: [
              {
                name: 'tb_consent_s4_interpreter_auth_statement',
                translations: [
                  {
                    language: 'en',
                    text: 'As someone who understands both English and the language spoken by the subject, I interpreted, in the subject\'s language, the researcher\'s presentation of the English consent form. The subject was given the opportunity to ask questions.'
                  },
                  {
                    language: 'es',
                    text: 'Dado que comprendo tanto el idioma inglés como la lengua que habla el participante voluntario, interpreté en su lengua la presentación del formulario de consentimiento en inglés realizada por la investigadora. El participante voluntario tuvo la oportunidad de hacer preguntas.'
                  },
                  {
                    language: 'ht',
                    text: 'Antanke moun ki konprann ni anglè ni lang sijè a pale a, mwen te entèprete, nan lang sijè a, prezantasyon ke chèchè a fè pou fòmilè konsantman anglè a. Yo te bay sijè a okasyon pou l poze kesyon.'
                  }
                ]
              }
            ]
          },
          shownExpr: 'user.studies["testboston"].forms["CONSENT"].questions["WHO_FILLING"].answers.hasOption("STAFF")',
          titleTemplate: {
            templateText: '<h3>$tb_consent_s4_interpreter_auth_title</h3>',
            templateType: 'HTML',
            variables: [
              {
                name: 'tb_consent_s4_interpreter_auth_title',
                translations: [
                  {
                    language: 'en',
                    text: 'Statement of Hospital Medical Interpreter'
                  },
                  {
                    language: 'es',
                    text: 'Declaración del intérprete médico del hospital'
                  },
                  {
                    language: 'ht',
                    text: 'Deklarasyon entèprèt medikal lopital la'
                  }
                ]
              }
            ]
          }
        },
        {
          blockType: 'QUESTION',
          question: {
            additionalInfoFooterTemplate: null,
            additionalInfoHeaderTemplate: null,
            hideNumber: true,
            inputType: 'SIGNATURE',
            isDeprecated: false,
            isRestricted: true,
            placeholderTemplate: null,
            promptTemplate: {
              templateText: '$interpreter_sig_prompt<br/>$interpreter_sig_prompt_phone',
              templateType: 'HTML',
              variables: [
                {
                  name: 'interpreter_sig_prompt',
                  translations: [
                    {
                      language: 'en',
                      text: 'Hospital Medical Interpreter:'
                    },
                    {
                      language: 'es',
                      text: 'Intérprete médico del hospital:'
                    },
                    {
                      language: 'ht',
                      text: 'Entèprèt medikal lopital la:'
                    }
                  ]
                },
                {
                  name: 'interpreter_sig_prompt_phone',
                  translations: [
                    {
                      language: 'en',
                      text: 'This verbal consent was obtained by phone.'
                    },
                    {
                      language: 'es',
                      text: 'Este consentimiento verbal se recibió por teléfono.'
                    },
                    {
                      language: 'ht',
                      text: 'Yo te jwenn konsantman nan bouch sa a nan telefòn.'
                    }
                  ]
                }
              ]
            },
            questionType: 'TEXT',
            stableId: 'INTERPRETER_SIGNATURE',
            suggestionType: 'NONE',
            suggestions: [],
            validations: []
          },
          shownExpr: 'user.studies["testboston"].forms["CONSENT"].questions["WHO_FILLING"].answers.hasOption("STAFF")'
        },
        {
          blockType: 'CONTENT',
          bodyTemplate: {
            templateText: '\n          <h4 class="static-header">$tb_consent_s4_date</h4>\n          <p class="static-text">$ddp.date("MM-dd-uuuu")</p>\n        ',
            templateType: 'HTML',
            variables: [
              {
                name: 'tb_consent_s4_date',
                translations: [
                  {
                    language: 'en',
                    text: 'Date'
                  },
                  {
                    language: 'es',
                    text: 'Fecha'
                  },
                  {
                    language: 'ht',
                    text: 'Dat'
                  }
                ]
              }
            ]
          },
          shownExpr: 'user.studies["testboston"].forms["CONSENT"].questions["WHO_FILLING"].answers.hasOption("STAFF")',
          titleTemplate: null
        }
      ],
      icons: [],
      nameTemplate: {
        templateText: '$tb_consent_s4_name',
        templateType: 'TEXT',
        variables: [
          {
            name: 'tb_consent_s4_name',
            translations: [
              {
                language: 'en',
                text: 'Signature'
              },
              {
                language: 'es',
                text: 'Firma'
              },
              {
                language: 'ht',
                text: 'Siyati'
              }
            ]
          }
        ]
      }
    }
  ],
  snapshotSubstitutionsOnSubmit: true,
  studyGuid: 'testboston',
  translatedDescriptions: [],
  translatedNames: [
    {
      language: 'en',
      text: 'Consent Form'
    },
    {
      language: 'es',
      text: 'Formulario de consentimiento'
    },
    {
      language: 'ht',
      text: 'Fòmilè konsantman'
    }
  ],
  translatedSecondNames: [
    {
      language: 'en',
      text: 'COVID-19 Test Results Month $ddp.activityInstanceNumber()'
    },
    {
      language: 'es',
      text: '[ES]COVID-19 Test Results Month $ddp.activityInstanceNumber()'
    },
    {
      language: 'ht',
      text: '[HT]COVID-19 Test Results Month $ddp.activityInstanceNumber()'
    }
  ],
  translatedSubtitles: [
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
  ],
  translatedSummaries: [],
  translatedTitles: [
    {
      language: 'en',
      text: 'Consent Process<a class="button button_download" href="en/consent.pdf" target="_blank"><img src="assets/images/download.svg" alt="Download" class="activity-header__icon">Download information sheet</a>'
    },
    {
      language: 'es',
      text: 'Proceso de consentimiento<a class="button button_download" href="es/consent.pdf" target="_blank"><img src="assets/images/download.svg" alt="Descargar" class="activity-header__icon">Descargar ficha informativa</a>'
    },
    {
      language: 'ht',
      text: 'Pwosesis konsantman<a class="button button_download" href="ht/consent.pdf" target="_blank"><img src="assets/images/download.svg" alt="Telechaje" class="activity-header__icon">Telechaje fèy enfòmasyon</a>'
    }
  ],
  validations: [],
  versionTag: 'v1',
  writeOnce: true
};
