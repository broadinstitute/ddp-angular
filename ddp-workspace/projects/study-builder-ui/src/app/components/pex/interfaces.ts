// query
//   : USER_TYPE '.' study '.' studyPredicate                                                  # StudyQuery
//   | USER_TYPE '.' study '.' form '.' formPredicate                                          # FormQuery
//   | USER_TYPE '.' study '.' form '.' instance '.' formInstancePredicate                     # FormInstanceQuery
//   | USER_TYPE '.' study '.' form '.' question '.' questionPredicate                         # QuestionQuery
//   | USER_TYPE '.' study '.' form '.' question '.' 'answers' '.' predicate                   # DefaultLatestAnswerQuery
//   | USER_TYPE '.' study '.' form '.' question '.' child '.' 'answers' '.' predicate         # DefaultLatestChildAnswerQuery
//   | USER_TYPE '.' study '.' form '.' instance '.' question '.' 'answers' '.' predicate      # AnswerQuery
//   | USER_TYPE '.' study '.' form '.' instance '.' question '.' child '.' 'answers' '.' predicate # ChildAnswerQuery
//   | USER_TYPE '.' 'profile' '.' profileDataQuery                                            # ProfileQuery
//   | USER_TYPE '.' 'event' '.' 'kit' '.' kitEventQuery                                       # EventKitQuery
//   | USER_TYPE '.' 'event' '.' 'testResult' '.' testResultQuery                              # EventTestResultQuery
//   ;


import {
    EqualityOperator,
    FormPredicate,
    LogicalOperator,
    ProfilePredicate,
    RelationOperator,
    StudyPredicate,
    UnaryOperator,
    UserType
} from './enums';

type Implements<T, U extends T> = {}; // a trick in order to an interface can implement another interface

type Predicates = StudyPredicate | ProfilePredicate | FormPredicate;

export interface IContentQuery {
    query: {
        query: string; // to write in the PEX string, first part, e.g. 'study'
        argument?: string; // to write in the PEX string, second part => '[' STR ']'
    };
    content?: any; // children:  IForm | IInstance | IQuestion | etc;
    predicate?: IPredicate<Predicates>;
    // TODO: should we combine `predicate` and `method` ?
    // method?: any; // like predicates, but return any value
}

export interface IPredicate<T> {
    predicate: T;
    argument?: string;
}

export interface IFormQuery extends Implements<IContentQuery, IFormQuery> {
    query: {
        query: 'forms';
        argument: string; // '[' STR ']'
    };
    content?: any; // IInstanceQuery;
    predicate?: IPredicate<FormPredicate>;
}

export interface IStudyQuery extends Implements<IContentQuery, IStudyQuery> {
    query: {
        query: 'studies';
        argument: string; // '[' STR ']'
    };
    content?: IFormQuery | null;
    predicate?: IPredicate<StudyPredicate>;
}

export interface IProfileQuery extends Implements<IContentQuery, IProfileQuery> {
    query: {
        query: 'profile';
    };
    predicate: IPredicate<ProfilePredicate>;
}

export interface IUserQuery extends Implements<IContentQuery, IUserQuery> {
    query: {
        query: UserType;
    };
    content: IStudyQuery | IProfileQuery;
}

export interface IQuery {
    unaryOperator?: UnaryOperator;
    user: IUserQuery;
}

export interface IComplexExpression {
    expressions: IQuery[];
    operators: Array<RelationOperator | EqualityOperator | LogicalOperator>;
}

export type IExpression = IQuery | IComplexExpression;


