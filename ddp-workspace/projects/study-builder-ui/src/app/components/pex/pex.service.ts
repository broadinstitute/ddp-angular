import { Injectable } from '@angular/core';
import { LogicalOperator, ProfilePredicate, StudyPredicate, UnaryOperator, UserType } from './enums';
import { IComplexExpression, IExpression, IQuery } from './interfaces';

// USER_TYPE : 'user' | 'operator' ;
// INSTANCE_TYPE : 'latest' | 'specific' ;
// BOOL : 'true' | 'false' ;
// STR : '"' .*? '"' ;
// INT : ('0'..'9')+ ;
// TIMEUNIT : 'DAYS' | 'WEEKS' | 'MONTHS' | 'YEARS' ;
// UNARY_OPERATOR : '!' | '-' ;
// RELATION_OPERATOR : '<' | '<=' | '>' | '>=' ;
// EQUALITY_OPERATOR : '==' | '!=' ;

const pexQuery1: IQuery = {
    user: {
        query: {
            query: UserType.user
        },
        content: {
            query: {
                query: 'profile'
            },
            predicate: {
                predicate: ProfilePredicate.language,
                argument: ''
            }
        }
    }
};
const pexQuery2: IQuery = {
    unaryOperator: UnaryOperator.not,
    user: {
        query: {
            query: UserType.user
        },
        content: {
            query: {
                query: 'studies',
                argument: 'pancan'
            },
            predicate: {
                predicate: StudyPredicate.isEnrollmentStatus,
                argument: 'REGISTERED'
            }
        }
    }
};
const pexExpMock: IComplexExpression = {
    expressions: [pexQuery1, pexQuery2],
    operators: [LogicalOperator.and]
};

const PARENTHESES = ['(', ')'];
const STRAIGHT_BRACKETS = ['[', ']'];

@Injectable({
    providedIn: 'root'
})
export class PexService {

    mapStringToPEXModel(pexString: string): IExpression {
        // parse PEX expression string - the most toughest part
        return null;
    }

    mapPEXModeltoString(pexExp = pexExpMock): string {
        const resArray = [];

        const queries = pexExp.expressions.map(expr => ((expr.unaryOperator ?? '') + this.parseUserQuery(expr.user)));
        for (const [index, query] of queries.entries()) {
            resArray.push(query);
            resArray.push(pexExp.operators[index]);
        }
        const result = resArray.filter(Boolean).join(' ');

        const css = 'font-size: 17px; color: green;';
        console.log(`PEX: ${resArray}: %c ${result}`, css);

        return result;
    }

    parseUserQuery(userQuery: any): string {
        const queryArray = [];

        for (const [ key, value ] of Object.entries(userQuery)) {
            if (key === 'query') {
                const queryString = this.buildStringWithArgument(key, value);
                queryArray.push(queryString);
            }
            if (key === 'predicate') {
                const predicate = this.buildStringWithArgument(key, value);
                queryArray.push(predicate);
            } else if (key === 'content') {
                queryArray.push(
                    this.parseUserQuery(value)
                );
            }
        }

        return queryArray.join('.');
    }

    private buildStringWithArgument(key, value): string {
        const brackets = key === 'query' ? STRAIGHT_BRACKETS : PARENTHESES;
        const arg = value['argument'];
        const argument = arg != null ?
            brackets.join(arg.length ? `"${arg}"` : '')
            : '';

        return value[key] + argument;
    }
}
