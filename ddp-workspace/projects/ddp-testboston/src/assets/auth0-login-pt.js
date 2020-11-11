Auth0.registerLanguageDictionary("pt", {
  "error": {
    "forgotPassword": {
      "too_many_requests": "Atingiu o limite de tentativas de alteração de palavra-passe. Aguarde antes de tentar de novo.",
      "lock.fallback": "Lamentamos, mas ocorreu um erro ao solicitar a alteração da palavra-passe.",
      "enterprise_email": "O domínio do seu e-mail faz parte de um fornecedor de identidade empresarial. Para repor a sua palavra-passe, fale com o administrador de segurança da sua empresa."
    },
    "login": {
      "blocked_user": "O utilizador está bloqueado.",
      "invalid_user_password": "Credenciais erradas.",
      "invalid_captcha": "O texto que introduziu está incorreto. <br /> Tente de novo.",
      "lock.fallback": "Lamentamos, mas ocorreu um erro ao tentar iniciar sessão.",
      "lock.invalid_code": "Código errado.",
      "lock.invalid_email_password": "E-mail ou palavra-passe errados.",
      "lock.invalid_username_password": "Nome de utilizador ou palavra-passe errados.",
      "lock.network": "Não conseguimos ligar ao servidor. Verifique a sua ligação e tente novamente.",
      "lock.popup_closed": "Janela pop-up fechada. Tente novamente.",
      "lock.unauthorized": "Não foram dadas autorizações. Tente novamente.",
      "lock.mfa_registration_required": "É necessária autenticação multifator, mas o seu dispositivo não está inscrito. Inscreva-o antes de avançar.",
      "lock.mfa_invalid_code": "Código errado. Tente de novo.",
      "password_change_required": "Tem de atualizar a sua palavra-passe porque é a primeira vez que está a iniciar sessão ou porque a sua palavra-passe expirou.",
      "password_leaked": "Detetámos um potencial problema de segurança com esta conta. Para proteger a sua conta, bloqueámos estes dados de início de sessão. Foi enviado um e-mail com instruções para desbloquear a sua conta.",
      "too_many_attempts": "A sua conta foi bloqueada após várias tentativas de início de sessão consecutivas.",
      "too_many_requests": "Lamentamos. Há demasiados pedidos neste momento. Recarregue a página e volte a tentar. Se o problema persistir, tente mais tarde.",
      "session_missing": "Não foi possível concluir o seu pedido de autenticação. Tente de novo depois de fechar todas as caixas de diálogo abertas. ",
      "hrd.not_matching_email": "Utilize o seu e-mail empresarial para iniciar sessão."
    },
    "passwordless": {
      "bad.email": "O e-mail não é válido ",
      "bad.phone_number": "O número de telefone não é válido",
      "lock.fallback": "Lamentamos, mas ocorreu um problema"
    },
    "signUp": {
      "invalid_password": "A palavra-passe não é válida.",
      "captcha_required": "Introduza o código abaixo para acabar de fazer o registo.",
      "lock.fallback": "Lamentamos, mas ocorreu um erro ao tentar fazer o registo.",
      "password_dictionary_error": "A palavra-passe é demasiado comum.",
      "password_no_user_info_error": "A palavra-passe é baseada em dados do utilizador.",
      "password_strength_error": "A palavra-passe é demasiado fraca.",
      "user_exists": "O utilizador já existe.",
      "username_exists": "O nome de utilizador já existe.",
      "social_signup_needs_terms_acception": "Aceite as Condições do serviço abaixo para continuar.  "
    }
  },
  "success": {
    "logIn": "Obrigado por iniciar sessão.",
    "forgotPassword": "Acabámos de lhe enviar um e-mail para repor a sua palavra-passe.",
    "magicLink": "Enviámos-lhe uma hiperligação para iniciar sessão<br />em %s.",
    "signUp": "Obrigado por se registar."
  },
  "blankErrorHint": "Não pode ficar em branco",
  "codeInputPlaceholder": "o seu código",
  "databaseEnterpriseLoginInstructions": "",
  "databaseEnterpriseAlternativeLoginInstructions": "ou",
  "databaseSignUpInstructions": "",
  "databaseAlternativeSignUpInstructions": "ou",
  "emailInputPlaceholder": "oseu@exemplo.com",
  "captchaCodeInputPlaceholder": "Introduza o código acima",
  "captchaMathInputPlaceholder": "Resolva a conta acima",
  "enterpriseLoginIntructions": "Inicie sessão com as suas credenciais da empresa.",
  "enterpriseActiveLoginInstructions": "Introduza as suas credenciais da empresa em %s.",
  "failedLabel": "Falhou!",
  "forgotPasswordTitle": "Reponha a sua palavra-passe",
  "forgotPasswordAction": "Esqueceu-se da sua palavra-passe?",
  "forgotPasswordInstructions": "Introduza o seu endereço de e-mail. Vamos enviar-lhe um e-mail para repor a sua palavra-passe.",
  "forgotPasswordSubmitLabel": "Enviar e-mail",
  "invalidErrorHint": "Inválido",
  "lastLoginInstructions": "Da última vez, iniciou sessão com",
  "loginAtLabel": "Inicie sessão em %s",
  "loginLabel": "Iniciar sessão",
  "loginSubmitLabel": "Iniciar sessão",
  "loginWithLabel": "Iniciar sessão com %s",
  "notYourAccountAction": "Não é a sua conta?",
  "passwordInputPlaceholder": "a sua palavra-passe",
  "passwordStrength": {
    "containsAtLeast": "Conter pelo menos %d dos seguintes %d tipos de caracteres:",
    "identicalChars": "Não mais do que %d caracteres idênticos seguidos (por ex., \"%s\" não é permitido)",
    "nonEmpty": "Palavra-passe não-vazia obrigatória",
    "numbers": "Números (i.e. 0-9)",
    "lengthAtLeast": "Com pelo menos %d caracteres",
    "lowerCase": "Letras minúsculas (a-z)",
    "shouldContain": "Deve conter:",
    "specialCharacters": "Caracteres especiais (por ex., !@#$%^&*)",
    "upperCase": "Letras maiúsculas (A-Z)"
  },
  "passwordlessEmailAlternativeInstructions": "Ou introduza o seu e-mail para fazer o registo<br/>ou crie uma conta",
  "passwordlessEmailCodeInstructions": "Foi enviado um e-mail com o código para %s.",
  "passwordlessEmailInstructions": "Introduza o seu e-mail para fazer o registo<br/>ou crie uma conta",
  "passwordlessSMSAlternativeInstructions": "Caso contrário, introduza o seu telemóvel para fazer o registo<br/>ou crie uma conta",
  "passwordlessSMSCodeInstructions": "Foi enviada uma mensagem de texto com o código<br/>para %s.",
  "passwordlessSMSInstructions": "Introduza o seu telemóvel para fazer o registo<br/>ou crie uma conta",
  "phoneNumberInputPlaceholder": "o seu telemóvel",
  "resendCodeAction": "Não recebeu o código?",
  "resendLabel": "Reenviar",
  "resendingLabel": "A reenviar...",
  "retryLabel": "Voltar a tentar",
  "sentLabel": "Enviado!",
  "showPassword": "Mostrar palavra-passe",
  "signUpTitle": "Registo",
  "signUpLabel": "Registo",
  "signUpSubmitLabel": "Registo",
  "signUpTerms": "Ao fazer o registo está a concordar com as nossas condições de serviço e política de privacidade. ",
  "signUpWithLabel": "Registe-se com %s",
  "socialLoginInstructions": "",
  "socialSignUpInstructions": "",
  "ssoEnabled": "Início de sessão único ativado",
  "submitLabel": "Submeter",
  "unrecoverableError": "Ocorreu um problema.<br />Contacte o apoio técnico.",
  "usernameFormatErrorHint": "Utilize %d-%d letras, números e os seguintes caracteres: \"_\", \".\", \"+\", \"-\"",
  "usernameInputPlaceholder": "o seu nome de utilizador",
  "usernameOrEmailInputPlaceholder": "nome de utilizador/e-mail",
  "title": "Auth0",
  "welcome": "Bem-vindo %s!",
  "windowsAuthInstructions": "Está ligado a partir da rede da sua empresa...",
  "windowsAuthLabel": "Autenticação Windows",
  "mfaInputPlaceholder": "Código",
  "mfaLoginTitle": "Validação em 2 passos",
  "mfaLoginInstructions": "Introduza o código de validação gerado pela sua aplicação móvel.",
  "mfaSubmitLabel": "Iniciar sessão",
  "mfaCodeErrorHint": "Utilize %d números"
});
