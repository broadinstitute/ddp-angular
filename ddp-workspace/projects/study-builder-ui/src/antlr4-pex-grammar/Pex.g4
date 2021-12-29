// this file was copied from
// https://github.com/broadinstitute/ddp-study-server/blob/develop/pepper-apis/src/main/antlr4/org/broadinstitute/ddp/pex/lang/Pex.g4
// with few extensions which are marked with EXTN word

// PEX - The Pepper Expression Language
grammar Pex;

// Starting rule for parsing
pex : expr ;

// Ordering of rule alternatives (aka right-hand-side) determines precedence. Top to bottom is highest
// to lowest precedence. Having a higher precedence means that the syntactic elements will "bind" closer together.
expr
  : BOOL              # BoolLiteralExpr
  | INT               # IntLiteralExpr
  | STR               # StrLiteralExpr
  | query             # QueryExpr
  | UNARY_OPERATOR expr          # UnaryExpr
  | expr RELATION_OPERATOR expr  # CompareExpr
  | expr EQUALITY_OPERATOR expr  # EqualityExpr
  | expr '&&' expr    # AndExpr
  | expr '||' expr    # OrExpr
  | '(' expr ')'      # GroupExpr
  ;

query
  : userType '.' study '.' studyPredicate                                                  # StudyQuery
  | userType '.' study '.' form '.' formPredicate                                          # FormQuery
  | userType '.' study '.' form '.' instance '.' formInstancePredicate                     # FormInstanceQuery
  | userType '.' study '.' form '.' question '.' questionPredicate                         # QuestionQuery
  | userType '.' study '.' form '.' question '.' 'answers' '.' predicate                   # DefaultLatestAnswerQuery
  | userType '.' study '.' form '.' question '.' child '.' 'answers' '.' predicate         # DefaultLatestChildAnswerQuery
  | userType '.' study '.' form '.' instance '.' question '.' 'answers' '.' predicate      # AnswerQuery
  | userType '.' study '.' form '.' instance '.' question '.' child '.' 'answers' '.' predicate # ChildAnswerQuery
  | userType '.' 'profile' '.' profileDataQuery                                            # ProfileQuery
  | userType '.' 'event' '.' 'kit' '.' kitEventQuery                                       # EventKitQuery
  | userType '.' 'event' '.' 'testResult' '.' testResultQuery                              # EventTestResultQuery
  ;

study : 'studies' '[' STR ']' ;
form : 'forms' '[' STR ']' ;
instance : 'instances' '[' INSTANCE_TYPE ']' ;
question : 'questions' '[' STR ']' ;
child : 'children' '[' STR ']';

// EXTN allows antlr-c3 tool to suggest 'user' and 'operator' strings instead of 'USER_TYPE'
userType
  : USER  #user
  | OPERATOR  #operator
  ;

// Predicates operating on study-level data
studyPredicate
  : 'hasAgedUp' '(' ')'  # HasAgedUpPredicate
  | 'hasInvitation' '(' STR ')'   # HasInvitationPredicate
  | 'isGovernedParticipant' '(' ')' # IsGovernedParticipantQuery
  | 'isEnrollmentStatus' '(' STR ')' # IsEnrollmentStatusPredicate
  ;

// Form predicate functions that operate on a single piece of data
formPredicate
  : 'isStatus' '(' STR ( ',' STR )* ')'  # IsStatusPredicate
  | 'hasInstance' '(' ')'         # HasInstancePredicate
  ;

// Form predicate functions for a particular instance
formInstancePredicate
  : 'isStatus' '(' STR ( ',' STR )* ')'  # IsInstanceStatusPredicate
  | 'snapshotSubstitution' '(' STR ')'   # InstanceSnapshotSubstitutionQuery
  | 'hasPreviousInstance' '(' ')'   # HasPreviousInstancePredicate
  ;

// Question predicate functions
questionPredicate
  : 'isAnswered' '(' ')'            # IsAnsweredPredicate
  | 'numChildAnswers' '(' STR ')'   # NumChildAnswersQuery
  ;

// Predicate functions that operates on a set/collection of things or a single piece of data
predicate
  : 'hasTrue' '(' ')'   # HasTruePredicate
  | 'hasFalse' '(' ')'  # HasFalsePredicate
  | 'hasText' '(' ')'   # HasTextPredicate
  | 'hasOption' '(' STR ')'                         # HasOptionPredicate
  | 'hasAnyOption' '(' STR ( ',' STR )* ')'         # HasAnyOptionPredicate
  | 'hasOptionStartsWith' '(' STR ( ',' STR )* ')'  # HasOptionStartsWithPredicate
  | 'hasDate' '(' ')'                               # HasDatePredicate
  | 'ageAtLeast' '(' INT ',' TIMEUNIT ')'           # AgeAtLeastPredicate
  | 'value' '(' ')' # ValueQuery    // Not exactly a predicate but putting this here eases implementation and backwards-compatibility.
  ;

// Queries to pull out various pieces of profile data
profileDataQuery
  : 'birthDate' '(' ')'   # ProfileBirthDateQuery
  | 'age' '(' ')'         # ProfileAgeQuery
  | 'language' '(' ')'    # ProfileLanguageQuery
  ;

// Queries for current kit event.
kitEventQuery
  : 'isReason' '(' STR ( ',' STR )* ')'   # IsKitReasonQuery
  ;

// Queries for current test result event.
testResultQuery
  : 'isCorrected' '(' ')'   # IsCorrectedTestResultQuery
  | 'isPositive' '(' ')'    # IsPositiveTestResultQuery
  ;


// Lexical rules
USER: 'user' ;
OPERATOR: 'operator' ;
INSTANCE_TYPE : 'latest' | 'specific' ;
BOOL : 'true' | 'false' ;
STR : '"' .*? '"' ;
INT : ('0'..'9')+ ;
TIMEUNIT : 'DAYS' | 'WEEKS' | 'MONTHS' | 'YEARS' ;  // just a java.time.temporal.ChronoUnit
UNARY_OPERATOR : '!' | '-' ;
RELATION_OPERATOR : '<' | '<=' | '>' | '>=' ;
EQUALITY_OPERATOR : '==' | '!=' ;

// Misc

WS : [ \t\r\n] -> skip ;    // Whitespace is not significant

// EXTN allows to highlight unrecognized symbols with separate color
UNRECOGNIZED : . ;
