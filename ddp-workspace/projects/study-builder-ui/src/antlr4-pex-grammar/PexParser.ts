// Generated from Pex.g4 by ANTLR 4.9.0-SNAPSHOT


import { ATN } from "antlr4ts/atn/ATN";
import { ATNDeserializer } from "antlr4ts/atn/ATNDeserializer";
import { FailedPredicateException } from "antlr4ts/FailedPredicateException";
import { NotNull } from "antlr4ts/Decorators";
import { NoViableAltException } from "antlr4ts/NoViableAltException";
import { Override } from "antlr4ts/Decorators";
import { Parser } from "antlr4ts/Parser";
import { ParserRuleContext } from "antlr4ts/ParserRuleContext";
import { ParserATNSimulator } from "antlr4ts/atn/ParserATNSimulator";
import { ParseTreeListener } from "antlr4ts/tree/ParseTreeListener";
import { ParseTreeVisitor } from "antlr4ts/tree/ParseTreeVisitor";
import { RecognitionException } from "antlr4ts/RecognitionException";
import { RuleContext } from "antlr4ts/RuleContext";
//import { RuleVersion } from "antlr4ts/RuleVersion";
import { TerminalNode } from "antlr4ts/tree/TerminalNode";
import { Token } from "antlr4ts/Token";
import { TokenStream } from "antlr4ts/TokenStream";
import { Vocabulary } from "antlr4ts/Vocabulary";
import { VocabularyImpl } from "antlr4ts/VocabularyImpl";

import * as Utils from "antlr4ts/misc/Utils";

import { PexListener } from "./PexListener";

export class PexParser extends Parser {
	public static readonly T__0 = 1;
	public static readonly T__1 = 2;
	public static readonly T__2 = 3;
	public static readonly T__3 = 4;
	public static readonly T__4 = 5;
	public static readonly T__5 = 6;
	public static readonly T__6 = 7;
	public static readonly T__7 = 8;
	public static readonly T__8 = 9;
	public static readonly T__9 = 10;
	public static readonly T__10 = 11;
	public static readonly T__11 = 12;
	public static readonly T__12 = 13;
	public static readonly T__13 = 14;
	public static readonly T__14 = 15;
	public static readonly T__15 = 16;
	public static readonly T__16 = 17;
	public static readonly T__17 = 18;
	public static readonly T__18 = 19;
	public static readonly T__19 = 20;
	public static readonly T__20 = 21;
	public static readonly T__21 = 22;
	public static readonly T__22 = 23;
	public static readonly T__23 = 24;
	public static readonly T__24 = 25;
	public static readonly T__25 = 26;
	public static readonly T__26 = 27;
	public static readonly T__27 = 28;
	public static readonly T__28 = 29;
	public static readonly T__29 = 30;
	public static readonly T__30 = 31;
	public static readonly T__31 = 32;
	public static readonly T__32 = 33;
	public static readonly T__33 = 34;
	public static readonly T__34 = 35;
	public static readonly T__35 = 36;
	public static readonly T__36 = 37;
	public static readonly T__37 = 38;
	public static readonly T__38 = 39;
	public static readonly T__39 = 40;
	public static readonly T__40 = 41;
	public static readonly T__41 = 42;
	public static readonly T__42 = 43;
	public static readonly USER = 44;
	public static readonly OPERATOR = 45;
	public static readonly INSTANCE_TYPE = 46;
	public static readonly BOOL = 47;
	public static readonly STR = 48;
	public static readonly INT = 49;
	public static readonly TIMEUNIT = 50;
	public static readonly UNARY_OPERATOR = 51;
	public static readonly RELATION_OPERATOR = 52;
	public static readonly EQUALITY_OPERATOR = 53;
	public static readonly WS = 54;
	public static readonly UNRECOGNIZED = 55;
	public static readonly RULE_pex = 0;
	public static readonly RULE_expr = 1;
	public static readonly RULE_query = 2;
	public static readonly RULE_study = 3;
	public static readonly RULE_form = 4;
	public static readonly RULE_instance = 5;
	public static readonly RULE_question = 6;
	public static readonly RULE_child = 7;
	public static readonly RULE_userType = 8;
	public static readonly RULE_studyPredicate = 9;
	public static readonly RULE_formPredicate = 10;
	public static readonly RULE_formInstancePredicate = 11;
	public static readonly RULE_questionPredicate = 12;
	public static readonly RULE_predicate = 13;
	public static readonly RULE_profileDataQuery = 14;
	public static readonly RULE_kitEventQuery = 15;
	public static readonly RULE_testResultQuery = 16;
	// tslint:disable:no-trailing-whitespace
	public static readonly ruleNames: string[] = [
		"pex", "expr", "query", "study", "form", "instance", "question", "child", 
		"userType", "studyPredicate", "formPredicate", "formInstancePredicate", 
		"questionPredicate", "predicate", "profileDataQuery", "kitEventQuery", 
		"testResultQuery",
	];

	private static readonly _LITERAL_NAMES: Array<string | undefined> = [
		undefined, "'&&'", "'||'", "'('", "')'", "'.'", "'answers'", "'profile'", 
		"'event'", "'kit'", "'testResult'", "'studies'", "'['", "']'", "'forms'", 
		"'instances'", "'questions'", "'children'", "'hasAgedUp'", "'hasInvitation'", 
		"'isGovernedParticipant'", "'isEnrollmentStatus'", "'isStatus'", "','", 
		"'hasInstance'", "'snapshotSubstitution'", "'hasPreviousInstance'", "'isAnswered'", 
		"'numChildAnswers'", "'hasTrue'", "'hasFalse'", "'hasText'", "'hasOption'", 
		"'hasAnyOption'", "'hasOptionStartsWith'", "'hasDate'", "'ageAtLeast'", 
		"'value'", "'birthDate'", "'age'", "'language'", "'isReason'", "'isCorrected'", 
		"'isPositive'", "'user'", "'operator'",
	];
	private static readonly _SYMBOLIC_NAMES: Array<string | undefined> = [
		undefined, undefined, undefined, undefined, undefined, undefined, undefined, 
		undefined, undefined, undefined, undefined, undefined, undefined, undefined, 
		undefined, undefined, undefined, undefined, undefined, undefined, undefined, 
		undefined, undefined, undefined, undefined, undefined, undefined, undefined, 
		undefined, undefined, undefined, undefined, undefined, undefined, undefined, 
		undefined, undefined, undefined, undefined, undefined, undefined, undefined, 
		undefined, undefined, "USER", "OPERATOR", "INSTANCE_TYPE", "BOOL", "STR", 
		"INT", "TIMEUNIT", "UNARY_OPERATOR", "RELATION_OPERATOR", "EQUALITY_OPERATOR", 
		"WS", "UNRECOGNIZED",
	];
	public static readonly VOCABULARY: Vocabulary = new VocabularyImpl(PexParser._LITERAL_NAMES, PexParser._SYMBOLIC_NAMES, []);

	// @Override
	// @NotNull
	public get vocabulary(): Vocabulary {
		return PexParser.VOCABULARY;
	}
	// tslint:enable:no-trailing-whitespace

	// @Override
	public get grammarFileName(): string { return "Pex.g4"; }

	// @Override
	public get ruleNames(): string[] { return PexParser.ruleNames; }

	// @Override
	public get serializedATN(): string { return PexParser._serializedATN; }

	protected createFailedPredicateException(predicate?: string, message?: string): FailedPredicateException {
		return new FailedPredicateException(this, predicate, message);
	}

	constructor(input: TokenStream) {
		super(input);
		this._interp = new ParserATNSimulator(PexParser._ATN, this);
	}
	// @RuleVersion(0)
	public pex(): PexContext {
		let _localctx: PexContext = new PexContext(this._ctx, this.state);
		this.enterRule(_localctx, 0, PexParser.RULE_pex);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 34;
			this.expr(0);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}

	public expr(): ExprContext;
	public expr(_p: number): ExprContext;
	// @RuleVersion(0)
	public expr(_p?: number): ExprContext {
		if (_p === undefined) {
			_p = 0;
		}

		let _parentctx: ParserRuleContext = this._ctx;
		let _parentState: number = this.state;
		let _localctx: ExprContext = new ExprContext(this._ctx, _parentState);
		let _prevctx: ExprContext = _localctx;
		let _startState: number = 2;
		this.enterRecursionRule(_localctx, 2, PexParser.RULE_expr, _p);
		try {
			let _alt: number;
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 47;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case PexParser.BOOL:
				{
				_localctx = new BoolLiteralExprContext(_localctx);
				this._ctx = _localctx;
				_prevctx = _localctx;

				this.state = 37;
				this.match(PexParser.BOOL);
				}
				break;
			case PexParser.INT:
				{
				_localctx = new IntLiteralExprContext(_localctx);
				this._ctx = _localctx;
				_prevctx = _localctx;
				this.state = 38;
				this.match(PexParser.INT);
				}
				break;
			case PexParser.STR:
				{
				_localctx = new StrLiteralExprContext(_localctx);
				this._ctx = _localctx;
				_prevctx = _localctx;
				this.state = 39;
				this.match(PexParser.STR);
				}
				break;
			case PexParser.USER:
			case PexParser.OPERATOR:
				{
				_localctx = new QueryExprContext(_localctx);
				this._ctx = _localctx;
				_prevctx = _localctx;
				this.state = 40;
				this.query();
				}
				break;
			case PexParser.UNARY_OPERATOR:
				{
				_localctx = new UnaryExprContext(_localctx);
				this._ctx = _localctx;
				_prevctx = _localctx;
				this.state = 41;
				this.match(PexParser.UNARY_OPERATOR);
				this.state = 42;
				this.expr(6);
				}
				break;
			case PexParser.T__2:
				{
				_localctx = new GroupExprContext(_localctx);
				this._ctx = _localctx;
				_prevctx = _localctx;
				this.state = 43;
				this.match(PexParser.T__2);
				this.state = 44;
				this.expr(0);
				this.state = 45;
				this.match(PexParser.T__3);
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
			this._ctx._stop = this._input.tryLT(-1);
			this.state = 63;
			this._errHandler.sync(this);
			_alt = this.interpreter.adaptivePredict(this._input, 2, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					if (this._parseListeners != null) {
						this.triggerExitRuleEvent();
					}
					_prevctx = _localctx;
					{
					this.state = 61;
					this._errHandler.sync(this);
					switch ( this.interpreter.adaptivePredict(this._input, 1, this._ctx) ) {
					case 1:
						{
						_localctx = new CompareExprContext(new ExprContext(_parentctx, _parentState));
						this.pushNewRecursionContext(_localctx, _startState, PexParser.RULE_expr);
						this.state = 49;
						if (!(this.precpred(this._ctx, 5))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 5)");
						}
						this.state = 50;
						this.match(PexParser.RELATION_OPERATOR);
						this.state = 51;
						this.expr(6);
						}
						break;

					case 2:
						{
						_localctx = new EqualityExprContext(new ExprContext(_parentctx, _parentState));
						this.pushNewRecursionContext(_localctx, _startState, PexParser.RULE_expr);
						this.state = 52;
						if (!(this.precpred(this._ctx, 4))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 4)");
						}
						this.state = 53;
						this.match(PexParser.EQUALITY_OPERATOR);
						this.state = 54;
						this.expr(5);
						}
						break;

					case 3:
						{
						_localctx = new AndExprContext(new ExprContext(_parentctx, _parentState));
						this.pushNewRecursionContext(_localctx, _startState, PexParser.RULE_expr);
						this.state = 55;
						if (!(this.precpred(this._ctx, 3))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 3)");
						}
						this.state = 56;
						this.match(PexParser.T__0);
						this.state = 57;
						this.expr(4);
						}
						break;

					case 4:
						{
						_localctx = new OrExprContext(new ExprContext(_parentctx, _parentState));
						this.pushNewRecursionContext(_localctx, _startState, PexParser.RULE_expr);
						this.state = 58;
						if (!(this.precpred(this._ctx, 2))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 2)");
						}
						this.state = 59;
						this.match(PexParser.T__1);
						this.state = 60;
						this.expr(3);
						}
						break;
					}
					}
				}
				this.state = 65;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input, 2, this._ctx);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.unrollRecursionContexts(_parentctx);
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public query(): QueryContext {
		let _localctx: QueryContext = new QueryContext(this._ctx, this.state);
		this.enterRule(_localctx, 4, PexParser.RULE_query);
		try {
			this.state = 178;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 3, this._ctx) ) {
			case 1:
				_localctx = new StudyQueryContext(_localctx);
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 66;
				this.userType();
				this.state = 67;
				this.match(PexParser.T__4);
				this.state = 68;
				this.study();
				this.state = 69;
				this.match(PexParser.T__4);
				this.state = 70;
				this.studyPredicate();
				}
				break;

			case 2:
				_localctx = new FormQueryContext(_localctx);
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 72;
				this.userType();
				this.state = 73;
				this.match(PexParser.T__4);
				this.state = 74;
				this.study();
				this.state = 75;
				this.match(PexParser.T__4);
				this.state = 76;
				this.form();
				this.state = 77;
				this.match(PexParser.T__4);
				this.state = 78;
				this.formPredicate();
				}
				break;

			case 3:
				_localctx = new FormInstanceQueryContext(_localctx);
				this.enterOuterAlt(_localctx, 3);
				{
				this.state = 80;
				this.userType();
				this.state = 81;
				this.match(PexParser.T__4);
				this.state = 82;
				this.study();
				this.state = 83;
				this.match(PexParser.T__4);
				this.state = 84;
				this.form();
				this.state = 85;
				this.match(PexParser.T__4);
				this.state = 86;
				this.instance();
				this.state = 87;
				this.match(PexParser.T__4);
				this.state = 88;
				this.formInstancePredicate();
				}
				break;

			case 4:
				_localctx = new QuestionQueryContext(_localctx);
				this.enterOuterAlt(_localctx, 4);
				{
				this.state = 90;
				this.userType();
				this.state = 91;
				this.match(PexParser.T__4);
				this.state = 92;
				this.study();
				this.state = 93;
				this.match(PexParser.T__4);
				this.state = 94;
				this.form();
				this.state = 95;
				this.match(PexParser.T__4);
				this.state = 96;
				this.question();
				this.state = 97;
				this.match(PexParser.T__4);
				this.state = 98;
				this.questionPredicate();
				}
				break;

			case 5:
				_localctx = new DefaultLatestAnswerQueryContext(_localctx);
				this.enterOuterAlt(_localctx, 5);
				{
				this.state = 100;
				this.userType();
				this.state = 101;
				this.match(PexParser.T__4);
				this.state = 102;
				this.study();
				this.state = 103;
				this.match(PexParser.T__4);
				this.state = 104;
				this.form();
				this.state = 105;
				this.match(PexParser.T__4);
				this.state = 106;
				this.question();
				this.state = 107;
				this.match(PexParser.T__4);
				this.state = 108;
				this.match(PexParser.T__5);
				this.state = 109;
				this.match(PexParser.T__4);
				this.state = 110;
				this.predicate();
				}
				break;

			case 6:
				_localctx = new DefaultLatestChildAnswerQueryContext(_localctx);
				this.enterOuterAlt(_localctx, 6);
				{
				this.state = 112;
				this.userType();
				this.state = 113;
				this.match(PexParser.T__4);
				this.state = 114;
				this.study();
				this.state = 115;
				this.match(PexParser.T__4);
				this.state = 116;
				this.form();
				this.state = 117;
				this.match(PexParser.T__4);
				this.state = 118;
				this.question();
				this.state = 119;
				this.match(PexParser.T__4);
				this.state = 120;
				this.child();
				this.state = 121;
				this.match(PexParser.T__4);
				this.state = 122;
				this.match(PexParser.T__5);
				this.state = 123;
				this.match(PexParser.T__4);
				this.state = 124;
				this.predicate();
				}
				break;

			case 7:
				_localctx = new AnswerQueryContext(_localctx);
				this.enterOuterAlt(_localctx, 7);
				{
				this.state = 126;
				this.userType();
				this.state = 127;
				this.match(PexParser.T__4);
				this.state = 128;
				this.study();
				this.state = 129;
				this.match(PexParser.T__4);
				this.state = 130;
				this.form();
				this.state = 131;
				this.match(PexParser.T__4);
				this.state = 132;
				this.instance();
				this.state = 133;
				this.match(PexParser.T__4);
				this.state = 134;
				this.question();
				this.state = 135;
				this.match(PexParser.T__4);
				this.state = 136;
				this.match(PexParser.T__5);
				this.state = 137;
				this.match(PexParser.T__4);
				this.state = 138;
				this.predicate();
				}
				break;

			case 8:
				_localctx = new ChildAnswerQueryContext(_localctx);
				this.enterOuterAlt(_localctx, 8);
				{
				this.state = 140;
				this.userType();
				this.state = 141;
				this.match(PexParser.T__4);
				this.state = 142;
				this.study();
				this.state = 143;
				this.match(PexParser.T__4);
				this.state = 144;
				this.form();
				this.state = 145;
				this.match(PexParser.T__4);
				this.state = 146;
				this.instance();
				this.state = 147;
				this.match(PexParser.T__4);
				this.state = 148;
				this.question();
				this.state = 149;
				this.match(PexParser.T__4);
				this.state = 150;
				this.child();
				this.state = 151;
				this.match(PexParser.T__4);
				this.state = 152;
				this.match(PexParser.T__5);
				this.state = 153;
				this.match(PexParser.T__4);
				this.state = 154;
				this.predicate();
				}
				break;

			case 9:
				_localctx = new ProfileQueryContext(_localctx);
				this.enterOuterAlt(_localctx, 9);
				{
				this.state = 156;
				this.userType();
				this.state = 157;
				this.match(PexParser.T__4);
				this.state = 158;
				this.match(PexParser.T__6);
				this.state = 159;
				this.match(PexParser.T__4);
				this.state = 160;
				this.profileDataQuery();
				}
				break;

			case 10:
				_localctx = new EventKitQueryContext(_localctx);
				this.enterOuterAlt(_localctx, 10);
				{
				this.state = 162;
				this.userType();
				this.state = 163;
				this.match(PexParser.T__4);
				this.state = 164;
				this.match(PexParser.T__7);
				this.state = 165;
				this.match(PexParser.T__4);
				this.state = 166;
				this.match(PexParser.T__8);
				this.state = 167;
				this.match(PexParser.T__4);
				this.state = 168;
				this.kitEventQuery();
				}
				break;

			case 11:
				_localctx = new EventTestResultQueryContext(_localctx);
				this.enterOuterAlt(_localctx, 11);
				{
				this.state = 170;
				this.userType();
				this.state = 171;
				this.match(PexParser.T__4);
				this.state = 172;
				this.match(PexParser.T__7);
				this.state = 173;
				this.match(PexParser.T__4);
				this.state = 174;
				this.match(PexParser.T__9);
				this.state = 175;
				this.match(PexParser.T__4);
				this.state = 176;
				this.testResultQuery();
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public study(): StudyContext {
		let _localctx: StudyContext = new StudyContext(this._ctx, this.state);
		this.enterRule(_localctx, 6, PexParser.RULE_study);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 180;
			this.match(PexParser.T__10);
			this.state = 181;
			this.match(PexParser.T__11);
			this.state = 182;
			this.match(PexParser.STR);
			this.state = 183;
			this.match(PexParser.T__12);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public form(): FormContext {
		let _localctx: FormContext = new FormContext(this._ctx, this.state);
		this.enterRule(_localctx, 8, PexParser.RULE_form);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 185;
			this.match(PexParser.T__13);
			this.state = 186;
			this.match(PexParser.T__11);
			this.state = 187;
			this.match(PexParser.STR);
			this.state = 188;
			this.match(PexParser.T__12);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public instance(): InstanceContext {
		let _localctx: InstanceContext = new InstanceContext(this._ctx, this.state);
		this.enterRule(_localctx, 10, PexParser.RULE_instance);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 190;
			this.match(PexParser.T__14);
			this.state = 191;
			this.match(PexParser.T__11);
			this.state = 192;
			this.match(PexParser.INSTANCE_TYPE);
			this.state = 193;
			this.match(PexParser.T__12);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public question(): QuestionContext {
		let _localctx: QuestionContext = new QuestionContext(this._ctx, this.state);
		this.enterRule(_localctx, 12, PexParser.RULE_question);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 195;
			this.match(PexParser.T__15);
			this.state = 196;
			this.match(PexParser.T__11);
			this.state = 197;
			this.match(PexParser.STR);
			this.state = 198;
			this.match(PexParser.T__12);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public child(): ChildContext {
		let _localctx: ChildContext = new ChildContext(this._ctx, this.state);
		this.enterRule(_localctx, 14, PexParser.RULE_child);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 200;
			this.match(PexParser.T__16);
			this.state = 201;
			this.match(PexParser.T__11);
			this.state = 202;
			this.match(PexParser.STR);
			this.state = 203;
			this.match(PexParser.T__12);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public userType(): UserTypeContext {
		let _localctx: UserTypeContext = new UserTypeContext(this._ctx, this.state);
		this.enterRule(_localctx, 16, PexParser.RULE_userType);
		try {
			this.state = 207;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case PexParser.USER:
				_localctx = new UserContext(_localctx);
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 205;
				this.match(PexParser.USER);
				}
				break;
			case PexParser.OPERATOR:
				_localctx = new OperatorContext(_localctx);
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 206;
				this.match(PexParser.OPERATOR);
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public studyPredicate(): StudyPredicateContext {
		let _localctx: StudyPredicateContext = new StudyPredicateContext(this._ctx, this.state);
		this.enterRule(_localctx, 18, PexParser.RULE_studyPredicate);
		try {
			this.state = 223;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case PexParser.T__17:
				_localctx = new HasAgedUpPredicateContext(_localctx);
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 209;
				this.match(PexParser.T__17);
				this.state = 210;
				this.match(PexParser.T__2);
				this.state = 211;
				this.match(PexParser.T__3);
				}
				break;
			case PexParser.T__18:
				_localctx = new HasInvitationPredicateContext(_localctx);
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 212;
				this.match(PexParser.T__18);
				this.state = 213;
				this.match(PexParser.T__2);
				this.state = 214;
				this.match(PexParser.STR);
				this.state = 215;
				this.match(PexParser.T__3);
				}
				break;
			case PexParser.T__19:
				_localctx = new IsGovernedParticipantQueryContext(_localctx);
				this.enterOuterAlt(_localctx, 3);
				{
				this.state = 216;
				this.match(PexParser.T__19);
				this.state = 217;
				this.match(PexParser.T__2);
				this.state = 218;
				this.match(PexParser.T__3);
				}
				break;
			case PexParser.T__20:
				_localctx = new IsEnrollmentStatusPredicateContext(_localctx);
				this.enterOuterAlt(_localctx, 4);
				{
				this.state = 219;
				this.match(PexParser.T__20);
				this.state = 220;
				this.match(PexParser.T__2);
				this.state = 221;
				this.match(PexParser.STR);
				this.state = 222;
				this.match(PexParser.T__3);
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public formPredicate(): FormPredicateContext {
		let _localctx: FormPredicateContext = new FormPredicateContext(this._ctx, this.state);
		this.enterRule(_localctx, 20, PexParser.RULE_formPredicate);
		let _la: number;
		try {
			this.state = 239;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case PexParser.T__21:
				_localctx = new IsStatusPredicateContext(_localctx);
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 225;
				this.match(PexParser.T__21);
				this.state = 226;
				this.match(PexParser.T__2);
				this.state = 227;
				this.match(PexParser.STR);
				this.state = 232;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la === PexParser.T__22) {
					{
					{
					this.state = 228;
					this.match(PexParser.T__22);
					this.state = 229;
					this.match(PexParser.STR);
					}
					}
					this.state = 234;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				this.state = 235;
				this.match(PexParser.T__3);
				}
				break;
			case PexParser.T__23:
				_localctx = new HasInstancePredicateContext(_localctx);
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 236;
				this.match(PexParser.T__23);
				this.state = 237;
				this.match(PexParser.T__2);
				this.state = 238;
				this.match(PexParser.T__3);
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public formInstancePredicate(): FormInstancePredicateContext {
		let _localctx: FormInstancePredicateContext = new FormInstancePredicateContext(this._ctx, this.state);
		this.enterRule(_localctx, 22, PexParser.RULE_formInstancePredicate);
		let _la: number;
		try {
			this.state = 259;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case PexParser.T__21:
				_localctx = new IsInstanceStatusPredicateContext(_localctx);
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 241;
				this.match(PexParser.T__21);
				this.state = 242;
				this.match(PexParser.T__2);
				this.state = 243;
				this.match(PexParser.STR);
				this.state = 248;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la === PexParser.T__22) {
					{
					{
					this.state = 244;
					this.match(PexParser.T__22);
					this.state = 245;
					this.match(PexParser.STR);
					}
					}
					this.state = 250;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				this.state = 251;
				this.match(PexParser.T__3);
				}
				break;
			case PexParser.T__24:
				_localctx = new InstanceSnapshotSubstitutionQueryContext(_localctx);
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 252;
				this.match(PexParser.T__24);
				this.state = 253;
				this.match(PexParser.T__2);
				this.state = 254;
				this.match(PexParser.STR);
				this.state = 255;
				this.match(PexParser.T__3);
				}
				break;
			case PexParser.T__25:
				_localctx = new HasPreviousInstancePredicateContext(_localctx);
				this.enterOuterAlt(_localctx, 3);
				{
				this.state = 256;
				this.match(PexParser.T__25);
				this.state = 257;
				this.match(PexParser.T__2);
				this.state = 258;
				this.match(PexParser.T__3);
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public questionPredicate(): QuestionPredicateContext {
		let _localctx: QuestionPredicateContext = new QuestionPredicateContext(this._ctx, this.state);
		this.enterRule(_localctx, 24, PexParser.RULE_questionPredicate);
		try {
			this.state = 268;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case PexParser.T__26:
				_localctx = new IsAnsweredPredicateContext(_localctx);
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 261;
				this.match(PexParser.T__26);
				this.state = 262;
				this.match(PexParser.T__2);
				this.state = 263;
				this.match(PexParser.T__3);
				}
				break;
			case PexParser.T__27:
				_localctx = new NumChildAnswersQueryContext(_localctx);
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 264;
				this.match(PexParser.T__27);
				this.state = 265;
				this.match(PexParser.T__2);
				this.state = 266;
				this.match(PexParser.STR);
				this.state = 267;
				this.match(PexParser.T__3);
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public predicate(): PredicateContext {
		let _localctx: PredicateContext = new PredicateContext(this._ctx, this.state);
		this.enterRule(_localctx, 26, PexParser.RULE_predicate);
		let _la: number;
		try {
			this.state = 317;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case PexParser.T__28:
				_localctx = new HasTruePredicateContext(_localctx);
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 270;
				this.match(PexParser.T__28);
				this.state = 271;
				this.match(PexParser.T__2);
				this.state = 272;
				this.match(PexParser.T__3);
				}
				break;
			case PexParser.T__29:
				_localctx = new HasFalsePredicateContext(_localctx);
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 273;
				this.match(PexParser.T__29);
				this.state = 274;
				this.match(PexParser.T__2);
				this.state = 275;
				this.match(PexParser.T__3);
				}
				break;
			case PexParser.T__30:
				_localctx = new HasTextPredicateContext(_localctx);
				this.enterOuterAlt(_localctx, 3);
				{
				this.state = 276;
				this.match(PexParser.T__30);
				this.state = 277;
				this.match(PexParser.T__2);
				this.state = 278;
				this.match(PexParser.T__3);
				}
				break;
			case PexParser.T__31:
				_localctx = new HasOptionPredicateContext(_localctx);
				this.enterOuterAlt(_localctx, 4);
				{
				this.state = 279;
				this.match(PexParser.T__31);
				this.state = 280;
				this.match(PexParser.T__2);
				this.state = 281;
				this.match(PexParser.STR);
				this.state = 282;
				this.match(PexParser.T__3);
				}
				break;
			case PexParser.T__32:
				_localctx = new HasAnyOptionPredicateContext(_localctx);
				this.enterOuterAlt(_localctx, 5);
				{
				this.state = 283;
				this.match(PexParser.T__32);
				this.state = 284;
				this.match(PexParser.T__2);
				this.state = 285;
				this.match(PexParser.STR);
				this.state = 290;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la === PexParser.T__22) {
					{
					{
					this.state = 286;
					this.match(PexParser.T__22);
					this.state = 287;
					this.match(PexParser.STR);
					}
					}
					this.state = 292;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				this.state = 293;
				this.match(PexParser.T__3);
				}
				break;
			case PexParser.T__33:
				_localctx = new HasOptionStartsWithPredicateContext(_localctx);
				this.enterOuterAlt(_localctx, 6);
				{
				this.state = 294;
				this.match(PexParser.T__33);
				this.state = 295;
				this.match(PexParser.T__2);
				this.state = 296;
				this.match(PexParser.STR);
				this.state = 301;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la === PexParser.T__22) {
					{
					{
					this.state = 297;
					this.match(PexParser.T__22);
					this.state = 298;
					this.match(PexParser.STR);
					}
					}
					this.state = 303;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				this.state = 304;
				this.match(PexParser.T__3);
				}
				break;
			case PexParser.T__34:
				_localctx = new HasDatePredicateContext(_localctx);
				this.enterOuterAlt(_localctx, 7);
				{
				this.state = 305;
				this.match(PexParser.T__34);
				this.state = 306;
				this.match(PexParser.T__2);
				this.state = 307;
				this.match(PexParser.T__3);
				}
				break;
			case PexParser.T__35:
				_localctx = new AgeAtLeastPredicateContext(_localctx);
				this.enterOuterAlt(_localctx, 8);
				{
				this.state = 308;
				this.match(PexParser.T__35);
				this.state = 309;
				this.match(PexParser.T__2);
				this.state = 310;
				this.match(PexParser.INT);
				this.state = 311;
				this.match(PexParser.T__22);
				this.state = 312;
				this.match(PexParser.TIMEUNIT);
				this.state = 313;
				this.match(PexParser.T__3);
				}
				break;
			case PexParser.T__36:
				_localctx = new ValueQueryContext(_localctx);
				this.enterOuterAlt(_localctx, 9);
				{
				this.state = 314;
				this.match(PexParser.T__36);
				this.state = 315;
				this.match(PexParser.T__2);
				this.state = 316;
				this.match(PexParser.T__3);
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public profileDataQuery(): ProfileDataQueryContext {
		let _localctx: ProfileDataQueryContext = new ProfileDataQueryContext(this._ctx, this.state);
		this.enterRule(_localctx, 28, PexParser.RULE_profileDataQuery);
		try {
			this.state = 328;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case PexParser.T__37:
				_localctx = new ProfileBirthDateQueryContext(_localctx);
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 319;
				this.match(PexParser.T__37);
				this.state = 320;
				this.match(PexParser.T__2);
				this.state = 321;
				this.match(PexParser.T__3);
				}
				break;
			case PexParser.T__38:
				_localctx = new ProfileAgeQueryContext(_localctx);
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 322;
				this.match(PexParser.T__38);
				this.state = 323;
				this.match(PexParser.T__2);
				this.state = 324;
				this.match(PexParser.T__3);
				}
				break;
			case PexParser.T__39:
				_localctx = new ProfileLanguageQueryContext(_localctx);
				this.enterOuterAlt(_localctx, 3);
				{
				this.state = 325;
				this.match(PexParser.T__39);
				this.state = 326;
				this.match(PexParser.T__2);
				this.state = 327;
				this.match(PexParser.T__3);
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public kitEventQuery(): KitEventQueryContext {
		let _localctx: KitEventQueryContext = new KitEventQueryContext(this._ctx, this.state);
		this.enterRule(_localctx, 30, PexParser.RULE_kitEventQuery);
		let _la: number;
		try {
			_localctx = new IsKitReasonQueryContext(_localctx);
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 330;
			this.match(PexParser.T__40);
			this.state = 331;
			this.match(PexParser.T__2);
			this.state = 332;
			this.match(PexParser.STR);
			this.state = 337;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === PexParser.T__22) {
				{
				{
				this.state = 333;
				this.match(PexParser.T__22);
				this.state = 334;
				this.match(PexParser.STR);
				}
				}
				this.state = 339;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 340;
			this.match(PexParser.T__3);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public testResultQuery(): TestResultQueryContext {
		let _localctx: TestResultQueryContext = new TestResultQueryContext(this._ctx, this.state);
		this.enterRule(_localctx, 32, PexParser.RULE_testResultQuery);
		try {
			this.state = 348;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case PexParser.T__41:
				_localctx = new IsCorrectedTestResultQueryContext(_localctx);
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 342;
				this.match(PexParser.T__41);
				this.state = 343;
				this.match(PexParser.T__2);
				this.state = 344;
				this.match(PexParser.T__3);
				}
				break;
			case PexParser.T__42:
				_localctx = new IsPositiveTestResultQueryContext(_localctx);
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 345;
				this.match(PexParser.T__42);
				this.state = 346;
				this.match(PexParser.T__2);
				this.state = 347;
				this.match(PexParser.T__3);
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}

	public sempred(_localctx: RuleContext, ruleIndex: number, predIndex: number): boolean {
		switch (ruleIndex) {
		case 1:
			return this.expr_sempred(_localctx as ExprContext, predIndex);
		}
		return true;
	}
	private expr_sempred(_localctx: ExprContext, predIndex: number): boolean {
		switch (predIndex) {
		case 0:
			return this.precpred(this._ctx, 5);

		case 1:
			return this.precpred(this._ctx, 4);

		case 2:
			return this.precpred(this._ctx, 3);

		case 3:
			return this.precpred(this._ctx, 2);
		}
		return true;
	}

	public static readonly _serializedATN: string =
		"\x03\uC91D\uCABA\u058D\uAFBA\u4F53\u0607\uEA8B\uC241\x039\u0161\x04\x02" +
		"\t\x02\x04\x03\t\x03\x04\x04\t\x04\x04\x05\t\x05\x04\x06\t\x06\x04\x07" +
		"\t\x07\x04\b\t\b\x04\t\t\t\x04\n\t\n\x04\v\t\v\x04\f\t\f\x04\r\t\r\x04" +
		"\x0E\t\x0E\x04\x0F\t\x0F\x04\x10\t\x10\x04\x11\t\x11\x04\x12\t\x12\x03" +
		"\x02\x03\x02\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03" +
		"\x03\x03\x03\x03\x03\x03\x03\x05\x032\n\x03\x03\x03\x03\x03\x03\x03\x03" +
		"\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x07" +
		"\x03@\n\x03\f\x03\x0E\x03C\v\x03\x03\x04\x03\x04\x03\x04\x03\x04\x03\x04" +
		"\x03\x04\x03\x04\x03\x04\x03\x04\x03\x04\x03\x04\x03\x04\x03\x04\x03\x04" +
		"\x03\x04\x03\x04\x03\x04\x03\x04\x03\x04\x03\x04\x03\x04\x03\x04\x03\x04" +
		"\x03\x04\x03\x04\x03\x04\x03\x04\x03\x04\x03\x04\x03\x04\x03\x04\x03\x04" +
		"\x03\x04\x03\x04\x03\x04\x03\x04\x03\x04\x03\x04\x03\x04\x03\x04\x03\x04" +
		"\x03\x04\x03\x04\x03\x04\x03\x04\x03\x04\x03\x04\x03\x04\x03\x04\x03\x04" +
		"\x03\x04\x03\x04\x03\x04\x03\x04\x03\x04\x03\x04\x03\x04\x03\x04\x03\x04" +
		"\x03\x04\x03\x04\x03\x04\x03\x04\x03\x04\x03\x04\x03\x04\x03\x04\x03\x04" +
		"\x03\x04\x03\x04\x03\x04\x03\x04\x03\x04\x03\x04\x03\x04\x03\x04\x03\x04" +
		"\x03\x04\x03\x04\x03\x04\x03\x04\x03\x04\x03\x04\x03\x04\x03\x04\x03\x04" +
		"\x03\x04\x03\x04\x03\x04\x03\x04\x03\x04\x03\x04\x03\x04\x03\x04\x03\x04" +
		"\x03\x04\x03\x04\x03\x04\x03\x04\x03\x04\x03\x04\x03\x04\x03\x04\x03\x04" +
		"\x03\x04\x03\x04\x03\x04\x03\x04\x03\x04\x03\x04\x03\x04\x03\x04\x05\x04" +
		"\xB5\n\x04\x03\x05\x03\x05\x03\x05\x03\x05\x03\x05\x03\x06\x03\x06\x03" +
		"\x06\x03\x06\x03\x06\x03\x07\x03\x07\x03\x07\x03\x07\x03\x07\x03\b\x03" +
		"\b\x03\b\x03\b\x03\b\x03\t\x03\t\x03\t\x03\t\x03\t\x03\n\x03\n\x05\n\xD2" +
		"\n\n\x03\v\x03\v\x03\v\x03\v\x03\v\x03\v\x03\v\x03\v\x03\v\x03\v\x03\v" +
		"\x03\v\x03\v\x03\v\x05\v\xE2\n\v\x03\f\x03\f\x03\f\x03\f\x03\f\x07\f\xE9" +
		"\n\f\f\f\x0E\f\xEC\v\f\x03\f\x03\f\x03\f\x03\f\x05\f\xF2\n\f\x03\r\x03" +
		"\r\x03\r\x03\r\x03\r\x07\r\xF9\n\r\f\r\x0E\r\xFC\v\r\x03\r\x03\r\x03\r" +
		"\x03\r\x03\r\x03\r\x03\r\x03\r\x05\r\u0106\n\r\x03\x0E\x03\x0E\x03\x0E" +
		"\x03\x0E\x03\x0E\x03\x0E\x03\x0E\x05\x0E\u010F\n\x0E\x03\x0F\x03\x0F\x03" +
		"\x0F\x03\x0F\x03\x0F\x03\x0F\x03\x0F\x03\x0F\x03\x0F\x03\x0F\x03\x0F\x03" +
		"\x0F\x03\x0F\x03\x0F\x03\x0F\x03\x0F\x03\x0F\x03\x0F\x07\x0F\u0123\n\x0F" +
		"\f\x0F\x0E\x0F\u0126\v\x0F\x03\x0F\x03\x0F\x03\x0F\x03\x0F\x03\x0F\x03" +
		"\x0F\x07\x0F\u012E\n\x0F\f\x0F\x0E\x0F\u0131\v\x0F\x03\x0F\x03\x0F\x03" +
		"\x0F\x03\x0F\x03\x0F\x03\x0F\x03\x0F\x03\x0F\x03\x0F\x03\x0F\x03\x0F\x03" +
		"\x0F\x03\x0F\x05\x0F\u0140\n\x0F\x03\x10\x03\x10\x03\x10\x03\x10\x03\x10" +
		"\x03\x10\x03\x10\x03\x10\x03\x10\x05\x10\u014B\n\x10\x03\x11\x03\x11\x03" +
		"\x11\x03\x11\x03\x11\x07\x11\u0152\n\x11\f\x11\x0E\x11\u0155\v\x11\x03" +
		"\x11\x03\x11\x03\x12\x03\x12\x03\x12\x03\x12\x03\x12\x03\x12\x05\x12\u015F" +
		"\n\x12\x03\x12\x02\x02\x03\x04\x13\x02\x02\x04\x02\x06\x02\b\x02\n\x02" +
		"\f\x02\x0E\x02\x10\x02\x12\x02\x14\x02\x16\x02\x18\x02\x1A\x02\x1C\x02" +
		"\x1E\x02 \x02\"\x02\x02\x02\x02\u017A\x02$\x03\x02\x02\x02\x041\x03\x02" +
		"\x02\x02\x06\xB4\x03\x02\x02\x02\b\xB6\x03\x02\x02\x02\n\xBB\x03\x02\x02" +
		"\x02\f\xC0\x03\x02\x02\x02\x0E\xC5\x03\x02\x02\x02\x10\xCA\x03\x02\x02" +
		"\x02\x12\xD1\x03\x02\x02\x02\x14\xE1\x03\x02\x02\x02\x16\xF1\x03\x02\x02" +
		"\x02\x18\u0105\x03\x02\x02\x02\x1A\u010E\x03\x02\x02\x02\x1C\u013F\x03" +
		"\x02\x02\x02\x1E\u014A\x03\x02\x02\x02 \u014C\x03\x02\x02\x02\"\u015E" +
		"\x03\x02\x02\x02$%\x05\x04\x03\x02%\x03\x03\x02\x02\x02&\'\b\x03\x01\x02" +
		"\'2\x071\x02\x02(2\x073\x02\x02)2\x072\x02\x02*2\x05\x06\x04\x02+,\x07" +
		"5\x02\x02,2\x05\x04\x03\b-.\x07\x05\x02\x02./\x05\x04\x03\x02/0\x07\x06" +
		"\x02\x0202\x03\x02\x02\x021&\x03\x02\x02\x021(\x03\x02\x02\x021)\x03\x02" +
		"\x02\x021*\x03\x02\x02\x021+\x03\x02\x02\x021-\x03\x02\x02\x022A\x03\x02" +
		"\x02\x0234\f\x07\x02\x0245\x076\x02\x025@\x05\x04\x03\b67\f\x06\x02\x02" +
		"78\x077\x02\x028@\x05\x04\x03\x079:\f\x05\x02\x02:;\x07\x03\x02\x02;@" +
		"\x05\x04\x03\x06<=\f\x04\x02\x02=>\x07\x04\x02\x02>@\x05\x04\x03\x05?" +
		"3\x03\x02\x02\x02?6\x03\x02\x02\x02?9\x03\x02\x02\x02?<\x03\x02\x02\x02" +
		"@C\x03\x02\x02\x02A?\x03\x02\x02\x02AB\x03\x02\x02\x02B\x05\x03\x02\x02" +
		"\x02CA\x03\x02\x02\x02DE\x05\x12\n\x02EF\x07\x07\x02\x02FG\x05\b\x05\x02" +
		"GH\x07\x07\x02\x02HI\x05\x14\v\x02I\xB5\x03\x02\x02\x02JK\x05\x12\n\x02" +
		"KL\x07\x07\x02\x02LM\x05\b\x05\x02MN\x07\x07\x02\x02NO\x05\n\x06\x02O" +
		"P\x07\x07\x02\x02PQ\x05\x16\f\x02Q\xB5\x03\x02\x02\x02RS\x05\x12\n\x02" +
		"ST\x07\x07\x02\x02TU\x05\b\x05\x02UV\x07\x07\x02\x02VW\x05\n\x06\x02W" +
		"X\x07\x07\x02\x02XY\x05\f\x07\x02YZ\x07\x07\x02\x02Z[\x05\x18\r\x02[\xB5" +
		"\x03\x02\x02\x02\\]\x05\x12\n\x02]^\x07\x07\x02\x02^_\x05\b\x05\x02_`" +
		"\x07\x07\x02\x02`a\x05\n\x06\x02ab\x07\x07\x02\x02bc\x05\x0E\b\x02cd\x07" +
		"\x07\x02\x02de\x05\x1A\x0E\x02e\xB5\x03\x02\x02\x02fg\x05\x12\n\x02gh" +
		"\x07\x07\x02\x02hi\x05\b\x05\x02ij\x07\x07\x02\x02jk\x05\n\x06\x02kl\x07" +
		"\x07\x02\x02lm\x05\x0E\b\x02mn\x07\x07\x02\x02no\x07\b\x02\x02op\x07\x07" +
		"\x02\x02pq\x05\x1C\x0F\x02q\xB5\x03\x02\x02\x02rs\x05\x12\n\x02st\x07" +
		"\x07\x02\x02tu\x05\b\x05\x02uv\x07\x07\x02\x02vw\x05\n\x06\x02wx\x07\x07" +
		"\x02\x02xy\x05\x0E\b\x02yz\x07\x07\x02\x02z{\x05\x10\t\x02{|\x07\x07\x02" +
		"\x02|}\x07\b\x02\x02}~\x07\x07\x02\x02~\x7F\x05\x1C\x0F\x02\x7F\xB5\x03" +
		"\x02\x02\x02\x80\x81\x05\x12\n\x02\x81\x82\x07\x07\x02\x02\x82\x83\x05" +
		"\b\x05\x02\x83\x84\x07\x07\x02\x02\x84\x85\x05\n\x06\x02\x85\x86\x07\x07" +
		"\x02\x02\x86\x87\x05\f\x07\x02\x87\x88\x07\x07\x02\x02\x88\x89\x05\x0E" +
		"\b\x02\x89\x8A\x07\x07\x02\x02\x8A\x8B\x07\b\x02\x02\x8B\x8C\x07\x07\x02" +
		"\x02\x8C\x8D\x05\x1C\x0F\x02\x8D\xB5\x03\x02\x02\x02\x8E\x8F\x05\x12\n" +
		"\x02\x8F\x90\x07\x07\x02\x02\x90\x91\x05\b\x05\x02\x91\x92\x07\x07\x02" +
		"\x02\x92\x93\x05\n\x06\x02\x93\x94\x07\x07\x02\x02\x94\x95\x05\f\x07\x02" +
		"\x95\x96\x07\x07\x02\x02\x96\x97\x05\x0E\b\x02\x97\x98\x07\x07\x02\x02" +
		"\x98\x99\x05\x10\t\x02\x99\x9A\x07\x07\x02\x02\x9A\x9B\x07\b\x02\x02\x9B" +
		"\x9C\x07\x07\x02\x02\x9C\x9D\x05\x1C\x0F\x02\x9D\xB5\x03\x02\x02\x02\x9E" +
		"\x9F\x05\x12\n\x02\x9F\xA0\x07\x07\x02\x02\xA0\xA1\x07\t\x02\x02\xA1\xA2" +
		"\x07\x07\x02\x02\xA2\xA3\x05\x1E\x10\x02\xA3\xB5\x03\x02\x02\x02\xA4\xA5" +
		"\x05\x12\n\x02\xA5\xA6\x07\x07\x02\x02\xA6\xA7\x07\n\x02\x02\xA7\xA8\x07" +
		"\x07\x02\x02\xA8\xA9\x07\v\x02\x02\xA9\xAA\x07\x07\x02\x02\xAA\xAB\x05" +
		" \x11\x02\xAB\xB5\x03\x02\x02\x02\xAC\xAD\x05\x12\n\x02\xAD\xAE\x07\x07" +
		"\x02\x02\xAE\xAF\x07\n\x02\x02\xAF\xB0\x07\x07\x02\x02\xB0\xB1\x07\f\x02" +
		"\x02\xB1\xB2\x07\x07\x02\x02\xB2\xB3\x05\"\x12\x02\xB3\xB5\x03\x02\x02" +
		"\x02\xB4D\x03\x02\x02\x02\xB4J\x03\x02\x02\x02\xB4R\x03\x02\x02\x02\xB4" +
		"\\\x03\x02\x02\x02\xB4f\x03\x02\x02\x02\xB4r\x03\x02\x02\x02\xB4\x80\x03" +
		"\x02\x02\x02\xB4\x8E\x03\x02\x02\x02\xB4\x9E\x03\x02\x02\x02\xB4\xA4\x03" +
		"\x02\x02\x02\xB4\xAC\x03\x02\x02\x02\xB5\x07\x03\x02\x02\x02\xB6\xB7\x07" +
		"\r\x02\x02\xB7\xB8\x07\x0E\x02\x02\xB8\xB9\x072\x02\x02\xB9\xBA\x07\x0F" +
		"\x02\x02\xBA\t\x03\x02\x02\x02\xBB\xBC\x07\x10\x02\x02\xBC\xBD\x07\x0E" +
		"\x02\x02\xBD\xBE\x072\x02\x02\xBE\xBF\x07\x0F\x02\x02\xBF\v\x03\x02\x02" +
		"\x02\xC0\xC1\x07\x11\x02\x02\xC1\xC2\x07\x0E\x02\x02\xC2\xC3\x070\x02" +
		"\x02\xC3\xC4\x07\x0F\x02\x02\xC4\r\x03\x02\x02\x02\xC5\xC6\x07\x12\x02" +
		"\x02\xC6\xC7\x07\x0E\x02\x02\xC7\xC8\x072\x02\x02\xC8\xC9\x07\x0F\x02" +
		"\x02\xC9\x0F\x03\x02\x02\x02\xCA\xCB\x07\x13\x02\x02\xCB\xCC\x07\x0E\x02" +
		"\x02\xCC\xCD\x072\x02\x02\xCD\xCE\x07\x0F\x02\x02\xCE\x11\x03\x02\x02" +
		"\x02\xCF\xD2\x07.\x02\x02\xD0\xD2\x07/\x02\x02\xD1\xCF\x03\x02\x02\x02" +
		"\xD1\xD0\x03\x02\x02\x02\xD2\x13\x03\x02\x02\x02\xD3\xD4\x07\x14\x02\x02" +
		"\xD4\xD5\x07\x05\x02\x02\xD5\xE2\x07\x06\x02\x02\xD6\xD7\x07\x15\x02\x02" +
		"\xD7\xD8\x07\x05\x02\x02\xD8\xD9\x072\x02\x02\xD9\xE2\x07\x06\x02\x02" +
		"\xDA\xDB\x07\x16\x02\x02\xDB\xDC\x07\x05\x02\x02\xDC\xE2\x07\x06\x02\x02" +
		"\xDD\xDE\x07\x17\x02\x02\xDE\xDF\x07\x05\x02\x02\xDF\xE0\x072\x02\x02" +
		"\xE0\xE2\x07\x06\x02\x02\xE1\xD3\x03\x02\x02\x02\xE1\xD6\x03\x02\x02\x02" +
		"\xE1\xDA\x03\x02\x02\x02\xE1\xDD\x03\x02\x02\x02\xE2\x15\x03\x02\x02\x02" +
		"\xE3\xE4\x07\x18\x02\x02\xE4\xE5\x07\x05\x02\x02\xE5\xEA\x072\x02\x02" +
		"\xE6\xE7\x07\x19\x02\x02\xE7\xE9\x072\x02\x02\xE8\xE6\x03\x02\x02\x02" +
		"\xE9\xEC\x03\x02\x02\x02\xEA\xE8\x03\x02\x02\x02\xEA\xEB\x03\x02\x02\x02" +
		"\xEB\xED\x03\x02\x02\x02\xEC\xEA\x03\x02\x02\x02\xED\xF2\x07\x06\x02\x02" +
		"\xEE\xEF\x07\x1A\x02\x02\xEF\xF0\x07\x05\x02\x02\xF0\xF2\x07\x06\x02\x02" +
		"\xF1\xE3\x03\x02\x02\x02\xF1\xEE\x03\x02\x02\x02\xF2\x17\x03\x02\x02\x02" +
		"\xF3\xF4\x07\x18\x02\x02\xF4\xF5\x07\x05\x02\x02\xF5\xFA\x072\x02\x02" +
		"\xF6\xF7\x07\x19\x02\x02\xF7\xF9\x072\x02\x02\xF8\xF6\x03\x02\x02\x02" +
		"\xF9\xFC\x03\x02\x02\x02\xFA\xF8\x03\x02\x02\x02\xFA\xFB\x03\x02\x02\x02" +
		"\xFB\xFD\x03\x02\x02\x02\xFC\xFA\x03\x02\x02\x02\xFD\u0106\x07\x06\x02" +
		"\x02\xFE\xFF\x07\x1B\x02\x02\xFF\u0100\x07\x05\x02\x02\u0100\u0101\x07" +
		"2\x02\x02\u0101\u0106\x07\x06\x02\x02\u0102\u0103\x07\x1C\x02\x02\u0103" +
		"\u0104\x07\x05\x02\x02\u0104\u0106\x07\x06\x02\x02\u0105\xF3\x03\x02\x02" +
		"\x02\u0105\xFE\x03\x02\x02\x02\u0105\u0102\x03\x02\x02\x02\u0106\x19\x03" +
		"\x02\x02\x02\u0107\u0108\x07\x1D\x02\x02\u0108\u0109\x07\x05\x02\x02\u0109" +
		"\u010F\x07\x06\x02\x02\u010A\u010B\x07\x1E\x02\x02\u010B\u010C\x07\x05" +
		"\x02\x02\u010C\u010D\x072\x02\x02\u010D\u010F\x07\x06\x02\x02\u010E\u0107" +
		"\x03\x02\x02\x02\u010E\u010A\x03\x02\x02\x02\u010F\x1B\x03\x02\x02\x02" +
		"\u0110\u0111\x07\x1F\x02\x02\u0111\u0112\x07\x05\x02\x02\u0112\u0140\x07" +
		"\x06\x02\x02\u0113\u0114\x07 \x02\x02\u0114\u0115\x07\x05\x02\x02\u0115" +
		"\u0140\x07\x06\x02\x02\u0116\u0117\x07!\x02\x02\u0117\u0118\x07\x05\x02" +
		"\x02\u0118\u0140\x07\x06\x02\x02\u0119\u011A\x07\"\x02\x02\u011A\u011B" +
		"\x07\x05\x02\x02\u011B\u011C\x072\x02\x02\u011C\u0140\x07\x06\x02\x02" +
		"\u011D\u011E\x07#\x02\x02\u011E\u011F\x07\x05\x02\x02\u011F\u0124\x07" +
		"2\x02\x02\u0120\u0121\x07\x19\x02\x02\u0121\u0123\x072\x02\x02\u0122\u0120" +
		"\x03\x02\x02\x02\u0123\u0126\x03\x02\x02\x02\u0124\u0122\x03\x02\x02\x02" +
		"\u0124\u0125\x03\x02\x02\x02\u0125\u0127\x03\x02\x02\x02\u0126\u0124\x03" +
		"\x02\x02\x02\u0127\u0140\x07\x06\x02\x02\u0128\u0129\x07$\x02\x02\u0129" +
		"\u012A\x07\x05\x02\x02\u012A\u012F\x072\x02\x02\u012B\u012C\x07\x19\x02" +
		"\x02\u012C\u012E\x072\x02\x02\u012D\u012B\x03\x02\x02\x02\u012E\u0131" +
		"\x03\x02\x02\x02\u012F\u012D\x03\x02\x02\x02\u012F\u0130\x03\x02\x02\x02" +
		"\u0130\u0132\x03\x02\x02\x02\u0131\u012F\x03\x02\x02\x02\u0132\u0140\x07" +
		"\x06\x02\x02\u0133\u0134\x07%\x02\x02\u0134\u0135\x07\x05\x02\x02\u0135" +
		"\u0140\x07\x06\x02\x02\u0136\u0137\x07&\x02\x02\u0137\u0138\x07\x05\x02" +
		"\x02\u0138\u0139\x073\x02\x02\u0139\u013A\x07\x19\x02\x02\u013A\u013B" +
		"\x074\x02\x02\u013B\u0140\x07\x06\x02\x02\u013C\u013D\x07\'\x02\x02\u013D" +
		"\u013E\x07\x05\x02\x02\u013E\u0140\x07\x06\x02\x02\u013F\u0110\x03\x02" +
		"\x02\x02\u013F\u0113\x03\x02\x02\x02\u013F\u0116\x03\x02\x02\x02\u013F" +
		"\u0119\x03\x02\x02\x02\u013F\u011D\x03\x02\x02\x02\u013F\u0128\x03\x02" +
		"\x02\x02\u013F\u0133\x03\x02\x02\x02\u013F\u0136\x03\x02\x02\x02\u013F" +
		"\u013C\x03\x02\x02\x02\u0140\x1D\x03\x02\x02\x02\u0141\u0142\x07(\x02" +
		"\x02\u0142\u0143\x07\x05\x02\x02\u0143\u014B\x07\x06\x02\x02\u0144\u0145" +
		"\x07)\x02\x02\u0145\u0146\x07\x05\x02\x02\u0146\u014B\x07\x06\x02\x02" +
		"\u0147\u0148\x07*\x02\x02\u0148\u0149\x07\x05\x02\x02\u0149\u014B\x07" +
		"\x06\x02\x02\u014A\u0141\x03\x02\x02\x02\u014A\u0144\x03\x02\x02\x02\u014A" +
		"\u0147\x03\x02\x02\x02\u014B\x1F\x03\x02\x02\x02\u014C\u014D\x07+\x02" +
		"\x02\u014D\u014E\x07\x05\x02\x02\u014E\u0153\x072\x02\x02\u014F\u0150" +
		"\x07\x19\x02\x02\u0150\u0152\x072\x02\x02\u0151\u014F\x03\x02\x02\x02" +
		"\u0152\u0155\x03\x02\x02\x02\u0153\u0151\x03\x02\x02\x02\u0153\u0154\x03" +
		"\x02\x02\x02\u0154\u0156\x03\x02\x02\x02\u0155\u0153\x03\x02\x02\x02\u0156" +
		"\u0157\x07\x06\x02\x02\u0157!\x03\x02\x02\x02\u0158\u0159\x07,\x02\x02" +
		"\u0159\u015A\x07\x05\x02\x02\u015A\u015F\x07\x06\x02\x02\u015B\u015C\x07" +
		"-\x02\x02\u015C\u015D\x07\x05\x02\x02\u015D\u015F\x07\x06\x02\x02\u015E" +
		"\u0158\x03\x02\x02\x02\u015E\u015B\x03\x02\x02\x02\u015F#\x03\x02\x02" +
		"\x02\x131?A\xB4\xD1\xE1\xEA\xF1\xFA\u0105\u010E\u0124\u012F\u013F\u014A" +
		"\u0153\u015E";
	public static __ATN: ATN;
	public static get _ATN(): ATN {
		if (!PexParser.__ATN) {
			PexParser.__ATN = new ATNDeserializer().deserialize(Utils.toCharArray(PexParser._serializedATN));
		}

		return PexParser.__ATN;
	}

}

export class PexContext extends ParserRuleContext {
	public expr(): ExprContext {
		return this.getRuleContext(0, ExprContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return PexParser.RULE_pex; }
	// @Override
	public enterRule(listener: PexListener): void {
		if (listener.enterPex) {
			listener.enterPex(this);
		}
	}
	// @Override
	public exitRule(listener: PexListener): void {
		if (listener.exitPex) {
			listener.exitPex(this);
		}
	}
}


export class ExprContext extends ParserRuleContext {
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return PexParser.RULE_expr; }
	public copyFrom(ctx: ExprContext): void {
		super.copyFrom(ctx);
	}
}
export class BoolLiteralExprContext extends ExprContext {
	public BOOL(): TerminalNode { return this.getToken(PexParser.BOOL, 0); }
	constructor(ctx: ExprContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: PexListener): void {
		if (listener.enterBoolLiteralExpr) {
			listener.enterBoolLiteralExpr(this);
		}
	}
	// @Override
	public exitRule(listener: PexListener): void {
		if (listener.exitBoolLiteralExpr) {
			listener.exitBoolLiteralExpr(this);
		}
	}
}
export class IntLiteralExprContext extends ExprContext {
	public INT(): TerminalNode { return this.getToken(PexParser.INT, 0); }
	constructor(ctx: ExprContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: PexListener): void {
		if (listener.enterIntLiteralExpr) {
			listener.enterIntLiteralExpr(this);
		}
	}
	// @Override
	public exitRule(listener: PexListener): void {
		if (listener.exitIntLiteralExpr) {
			listener.exitIntLiteralExpr(this);
		}
	}
}
export class StrLiteralExprContext extends ExprContext {
	public STR(): TerminalNode { return this.getToken(PexParser.STR, 0); }
	constructor(ctx: ExprContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: PexListener): void {
		if (listener.enterStrLiteralExpr) {
			listener.enterStrLiteralExpr(this);
		}
	}
	// @Override
	public exitRule(listener: PexListener): void {
		if (listener.exitStrLiteralExpr) {
			listener.exitStrLiteralExpr(this);
		}
	}
}
export class QueryExprContext extends ExprContext {
	public query(): QueryContext {
		return this.getRuleContext(0, QueryContext);
	}
	constructor(ctx: ExprContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: PexListener): void {
		if (listener.enterQueryExpr) {
			listener.enterQueryExpr(this);
		}
	}
	// @Override
	public exitRule(listener: PexListener): void {
		if (listener.exitQueryExpr) {
			listener.exitQueryExpr(this);
		}
	}
}
export class UnaryExprContext extends ExprContext {
	public UNARY_OPERATOR(): TerminalNode { return this.getToken(PexParser.UNARY_OPERATOR, 0); }
	public expr(): ExprContext {
		return this.getRuleContext(0, ExprContext);
	}
	constructor(ctx: ExprContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: PexListener): void {
		if (listener.enterUnaryExpr) {
			listener.enterUnaryExpr(this);
		}
	}
	// @Override
	public exitRule(listener: PexListener): void {
		if (listener.exitUnaryExpr) {
			listener.exitUnaryExpr(this);
		}
	}
}
export class CompareExprContext extends ExprContext {
	public expr(): ExprContext[];
	public expr(i: number): ExprContext;
	public expr(i?: number): ExprContext | ExprContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ExprContext);
		} else {
			return this.getRuleContext(i, ExprContext);
		}
	}
	public RELATION_OPERATOR(): TerminalNode { return this.getToken(PexParser.RELATION_OPERATOR, 0); }
	constructor(ctx: ExprContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: PexListener): void {
		if (listener.enterCompareExpr) {
			listener.enterCompareExpr(this);
		}
	}
	// @Override
	public exitRule(listener: PexListener): void {
		if (listener.exitCompareExpr) {
			listener.exitCompareExpr(this);
		}
	}
}
export class EqualityExprContext extends ExprContext {
	public expr(): ExprContext[];
	public expr(i: number): ExprContext;
	public expr(i?: number): ExprContext | ExprContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ExprContext);
		} else {
			return this.getRuleContext(i, ExprContext);
		}
	}
	public EQUALITY_OPERATOR(): TerminalNode { return this.getToken(PexParser.EQUALITY_OPERATOR, 0); }
	constructor(ctx: ExprContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: PexListener): void {
		if (listener.enterEqualityExpr) {
			listener.enterEqualityExpr(this);
		}
	}
	// @Override
	public exitRule(listener: PexListener): void {
		if (listener.exitEqualityExpr) {
			listener.exitEqualityExpr(this);
		}
	}
}
export class AndExprContext extends ExprContext {
	public expr(): ExprContext[];
	public expr(i: number): ExprContext;
	public expr(i?: number): ExprContext | ExprContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ExprContext);
		} else {
			return this.getRuleContext(i, ExprContext);
		}
	}
	constructor(ctx: ExprContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: PexListener): void {
		if (listener.enterAndExpr) {
			listener.enterAndExpr(this);
		}
	}
	// @Override
	public exitRule(listener: PexListener): void {
		if (listener.exitAndExpr) {
			listener.exitAndExpr(this);
		}
	}
}
export class OrExprContext extends ExprContext {
	public expr(): ExprContext[];
	public expr(i: number): ExprContext;
	public expr(i?: number): ExprContext | ExprContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ExprContext);
		} else {
			return this.getRuleContext(i, ExprContext);
		}
	}
	constructor(ctx: ExprContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: PexListener): void {
		if (listener.enterOrExpr) {
			listener.enterOrExpr(this);
		}
	}
	// @Override
	public exitRule(listener: PexListener): void {
		if (listener.exitOrExpr) {
			listener.exitOrExpr(this);
		}
	}
}
export class GroupExprContext extends ExprContext {
	public expr(): ExprContext {
		return this.getRuleContext(0, ExprContext);
	}
	constructor(ctx: ExprContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: PexListener): void {
		if (listener.enterGroupExpr) {
			listener.enterGroupExpr(this);
		}
	}
	// @Override
	public exitRule(listener: PexListener): void {
		if (listener.exitGroupExpr) {
			listener.exitGroupExpr(this);
		}
	}
}


export class QueryContext extends ParserRuleContext {
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return PexParser.RULE_query; }
	public copyFrom(ctx: QueryContext): void {
		super.copyFrom(ctx);
	}
}
export class StudyQueryContext extends QueryContext {
	public userType(): UserTypeContext {
		return this.getRuleContext(0, UserTypeContext);
	}
	public study(): StudyContext {
		return this.getRuleContext(0, StudyContext);
	}
	public studyPredicate(): StudyPredicateContext {
		return this.getRuleContext(0, StudyPredicateContext);
	}
	constructor(ctx: QueryContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: PexListener): void {
		if (listener.enterStudyQuery) {
			listener.enterStudyQuery(this);
		}
	}
	// @Override
	public exitRule(listener: PexListener): void {
		if (listener.exitStudyQuery) {
			listener.exitStudyQuery(this);
		}
	}
}
export class FormQueryContext extends QueryContext {
	public userType(): UserTypeContext {
		return this.getRuleContext(0, UserTypeContext);
	}
	public study(): StudyContext {
		return this.getRuleContext(0, StudyContext);
	}
	public form(): FormContext {
		return this.getRuleContext(0, FormContext);
	}
	public formPredicate(): FormPredicateContext {
		return this.getRuleContext(0, FormPredicateContext);
	}
	constructor(ctx: QueryContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: PexListener): void {
		if (listener.enterFormQuery) {
			listener.enterFormQuery(this);
		}
	}
	// @Override
	public exitRule(listener: PexListener): void {
		if (listener.exitFormQuery) {
			listener.exitFormQuery(this);
		}
	}
}
export class FormInstanceQueryContext extends QueryContext {
	public userType(): UserTypeContext {
		return this.getRuleContext(0, UserTypeContext);
	}
	public study(): StudyContext {
		return this.getRuleContext(0, StudyContext);
	}
	public form(): FormContext {
		return this.getRuleContext(0, FormContext);
	}
	public instance(): InstanceContext {
		return this.getRuleContext(0, InstanceContext);
	}
	public formInstancePredicate(): FormInstancePredicateContext {
		return this.getRuleContext(0, FormInstancePredicateContext);
	}
	constructor(ctx: QueryContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: PexListener): void {
		if (listener.enterFormInstanceQuery) {
			listener.enterFormInstanceQuery(this);
		}
	}
	// @Override
	public exitRule(listener: PexListener): void {
		if (listener.exitFormInstanceQuery) {
			listener.exitFormInstanceQuery(this);
		}
	}
}
export class QuestionQueryContext extends QueryContext {
	public userType(): UserTypeContext {
		return this.getRuleContext(0, UserTypeContext);
	}
	public study(): StudyContext {
		return this.getRuleContext(0, StudyContext);
	}
	public form(): FormContext {
		return this.getRuleContext(0, FormContext);
	}
	public question(): QuestionContext {
		return this.getRuleContext(0, QuestionContext);
	}
	public questionPredicate(): QuestionPredicateContext {
		return this.getRuleContext(0, QuestionPredicateContext);
	}
	constructor(ctx: QueryContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: PexListener): void {
		if (listener.enterQuestionQuery) {
			listener.enterQuestionQuery(this);
		}
	}
	// @Override
	public exitRule(listener: PexListener): void {
		if (listener.exitQuestionQuery) {
			listener.exitQuestionQuery(this);
		}
	}
}
export class DefaultLatestAnswerQueryContext extends QueryContext {
	public userType(): UserTypeContext {
		return this.getRuleContext(0, UserTypeContext);
	}
	public study(): StudyContext {
		return this.getRuleContext(0, StudyContext);
	}
	public form(): FormContext {
		return this.getRuleContext(0, FormContext);
	}
	public question(): QuestionContext {
		return this.getRuleContext(0, QuestionContext);
	}
	public predicate(): PredicateContext {
		return this.getRuleContext(0, PredicateContext);
	}
	constructor(ctx: QueryContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: PexListener): void {
		if (listener.enterDefaultLatestAnswerQuery) {
			listener.enterDefaultLatestAnswerQuery(this);
		}
	}
	// @Override
	public exitRule(listener: PexListener): void {
		if (listener.exitDefaultLatestAnswerQuery) {
			listener.exitDefaultLatestAnswerQuery(this);
		}
	}
}
export class DefaultLatestChildAnswerQueryContext extends QueryContext {
	public userType(): UserTypeContext {
		return this.getRuleContext(0, UserTypeContext);
	}
	public study(): StudyContext {
		return this.getRuleContext(0, StudyContext);
	}
	public form(): FormContext {
		return this.getRuleContext(0, FormContext);
	}
	public question(): QuestionContext {
		return this.getRuleContext(0, QuestionContext);
	}
	public child(): ChildContext {
		return this.getRuleContext(0, ChildContext);
	}
	public predicate(): PredicateContext {
		return this.getRuleContext(0, PredicateContext);
	}
	constructor(ctx: QueryContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: PexListener): void {
		if (listener.enterDefaultLatestChildAnswerQuery) {
			listener.enterDefaultLatestChildAnswerQuery(this);
		}
	}
	// @Override
	public exitRule(listener: PexListener): void {
		if (listener.exitDefaultLatestChildAnswerQuery) {
			listener.exitDefaultLatestChildAnswerQuery(this);
		}
	}
}
export class AnswerQueryContext extends QueryContext {
	public userType(): UserTypeContext {
		return this.getRuleContext(0, UserTypeContext);
	}
	public study(): StudyContext {
		return this.getRuleContext(0, StudyContext);
	}
	public form(): FormContext {
		return this.getRuleContext(0, FormContext);
	}
	public instance(): InstanceContext {
		return this.getRuleContext(0, InstanceContext);
	}
	public question(): QuestionContext {
		return this.getRuleContext(0, QuestionContext);
	}
	public predicate(): PredicateContext {
		return this.getRuleContext(0, PredicateContext);
	}
	constructor(ctx: QueryContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: PexListener): void {
		if (listener.enterAnswerQuery) {
			listener.enterAnswerQuery(this);
		}
	}
	// @Override
	public exitRule(listener: PexListener): void {
		if (listener.exitAnswerQuery) {
			listener.exitAnswerQuery(this);
		}
	}
}
export class ChildAnswerQueryContext extends QueryContext {
	public userType(): UserTypeContext {
		return this.getRuleContext(0, UserTypeContext);
	}
	public study(): StudyContext {
		return this.getRuleContext(0, StudyContext);
	}
	public form(): FormContext {
		return this.getRuleContext(0, FormContext);
	}
	public instance(): InstanceContext {
		return this.getRuleContext(0, InstanceContext);
	}
	public question(): QuestionContext {
		return this.getRuleContext(0, QuestionContext);
	}
	public child(): ChildContext {
		return this.getRuleContext(0, ChildContext);
	}
	public predicate(): PredicateContext {
		return this.getRuleContext(0, PredicateContext);
	}
	constructor(ctx: QueryContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: PexListener): void {
		if (listener.enterChildAnswerQuery) {
			listener.enterChildAnswerQuery(this);
		}
	}
	// @Override
	public exitRule(listener: PexListener): void {
		if (listener.exitChildAnswerQuery) {
			listener.exitChildAnswerQuery(this);
		}
	}
}
export class ProfileQueryContext extends QueryContext {
	public userType(): UserTypeContext {
		return this.getRuleContext(0, UserTypeContext);
	}
	public profileDataQuery(): ProfileDataQueryContext {
		return this.getRuleContext(0, ProfileDataQueryContext);
	}
	constructor(ctx: QueryContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: PexListener): void {
		if (listener.enterProfileQuery) {
			listener.enterProfileQuery(this);
		}
	}
	// @Override
	public exitRule(listener: PexListener): void {
		if (listener.exitProfileQuery) {
			listener.exitProfileQuery(this);
		}
	}
}
export class EventKitQueryContext extends QueryContext {
	public userType(): UserTypeContext {
		return this.getRuleContext(0, UserTypeContext);
	}
	public kitEventQuery(): KitEventQueryContext {
		return this.getRuleContext(0, KitEventQueryContext);
	}
	constructor(ctx: QueryContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: PexListener): void {
		if (listener.enterEventKitQuery) {
			listener.enterEventKitQuery(this);
		}
	}
	// @Override
	public exitRule(listener: PexListener): void {
		if (listener.exitEventKitQuery) {
			listener.exitEventKitQuery(this);
		}
	}
}
export class EventTestResultQueryContext extends QueryContext {
	public userType(): UserTypeContext {
		return this.getRuleContext(0, UserTypeContext);
	}
	public testResultQuery(): TestResultQueryContext {
		return this.getRuleContext(0, TestResultQueryContext);
	}
	constructor(ctx: QueryContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: PexListener): void {
		if (listener.enterEventTestResultQuery) {
			listener.enterEventTestResultQuery(this);
		}
	}
	// @Override
	public exitRule(listener: PexListener): void {
		if (listener.exitEventTestResultQuery) {
			listener.exitEventTestResultQuery(this);
		}
	}
}


export class StudyContext extends ParserRuleContext {
	public STR(): TerminalNode { return this.getToken(PexParser.STR, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return PexParser.RULE_study; }
	// @Override
	public enterRule(listener: PexListener): void {
		if (listener.enterStudy) {
			listener.enterStudy(this);
		}
	}
	// @Override
	public exitRule(listener: PexListener): void {
		if (listener.exitStudy) {
			listener.exitStudy(this);
		}
	}
}


export class FormContext extends ParserRuleContext {
	public STR(): TerminalNode { return this.getToken(PexParser.STR, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return PexParser.RULE_form; }
	// @Override
	public enterRule(listener: PexListener): void {
		if (listener.enterForm) {
			listener.enterForm(this);
		}
	}
	// @Override
	public exitRule(listener: PexListener): void {
		if (listener.exitForm) {
			listener.exitForm(this);
		}
	}
}


export class InstanceContext extends ParserRuleContext {
	public INSTANCE_TYPE(): TerminalNode { return this.getToken(PexParser.INSTANCE_TYPE, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return PexParser.RULE_instance; }
	// @Override
	public enterRule(listener: PexListener): void {
		if (listener.enterInstance) {
			listener.enterInstance(this);
		}
	}
	// @Override
	public exitRule(listener: PexListener): void {
		if (listener.exitInstance) {
			listener.exitInstance(this);
		}
	}
}


export class QuestionContext extends ParserRuleContext {
	public STR(): TerminalNode { return this.getToken(PexParser.STR, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return PexParser.RULE_question; }
	// @Override
	public enterRule(listener: PexListener): void {
		if (listener.enterQuestion) {
			listener.enterQuestion(this);
		}
	}
	// @Override
	public exitRule(listener: PexListener): void {
		if (listener.exitQuestion) {
			listener.exitQuestion(this);
		}
	}
}


export class ChildContext extends ParserRuleContext {
	public STR(): TerminalNode { return this.getToken(PexParser.STR, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return PexParser.RULE_child; }
	// @Override
	public enterRule(listener: PexListener): void {
		if (listener.enterChild) {
			listener.enterChild(this);
		}
	}
	// @Override
	public exitRule(listener: PexListener): void {
		if (listener.exitChild) {
			listener.exitChild(this);
		}
	}
}


export class UserTypeContext extends ParserRuleContext {
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return PexParser.RULE_userType; }
	public copyFrom(ctx: UserTypeContext): void {
		super.copyFrom(ctx);
	}
}
export class UserContext extends UserTypeContext {
	public USER(): TerminalNode { return this.getToken(PexParser.USER, 0); }
	constructor(ctx: UserTypeContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: PexListener): void {
		if (listener.enterUser) {
			listener.enterUser(this);
		}
	}
	// @Override
	public exitRule(listener: PexListener): void {
		if (listener.exitUser) {
			listener.exitUser(this);
		}
	}
}
export class OperatorContext extends UserTypeContext {
	public OPERATOR(): TerminalNode { return this.getToken(PexParser.OPERATOR, 0); }
	constructor(ctx: UserTypeContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: PexListener): void {
		if (listener.enterOperator) {
			listener.enterOperator(this);
		}
	}
	// @Override
	public exitRule(listener: PexListener): void {
		if (listener.exitOperator) {
			listener.exitOperator(this);
		}
	}
}


export class StudyPredicateContext extends ParserRuleContext {
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return PexParser.RULE_studyPredicate; }
	public copyFrom(ctx: StudyPredicateContext): void {
		super.copyFrom(ctx);
	}
}
export class HasAgedUpPredicateContext extends StudyPredicateContext {
	constructor(ctx: StudyPredicateContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: PexListener): void {
		if (listener.enterHasAgedUpPredicate) {
			listener.enterHasAgedUpPredicate(this);
		}
	}
	// @Override
	public exitRule(listener: PexListener): void {
		if (listener.exitHasAgedUpPredicate) {
			listener.exitHasAgedUpPredicate(this);
		}
	}
}
export class HasInvitationPredicateContext extends StudyPredicateContext {
	public STR(): TerminalNode { return this.getToken(PexParser.STR, 0); }
	constructor(ctx: StudyPredicateContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: PexListener): void {
		if (listener.enterHasInvitationPredicate) {
			listener.enterHasInvitationPredicate(this);
		}
	}
	// @Override
	public exitRule(listener: PexListener): void {
		if (listener.exitHasInvitationPredicate) {
			listener.exitHasInvitationPredicate(this);
		}
	}
}
export class IsGovernedParticipantQueryContext extends StudyPredicateContext {
	constructor(ctx: StudyPredicateContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: PexListener): void {
		if (listener.enterIsGovernedParticipantQuery) {
			listener.enterIsGovernedParticipantQuery(this);
		}
	}
	// @Override
	public exitRule(listener: PexListener): void {
		if (listener.exitIsGovernedParticipantQuery) {
			listener.exitIsGovernedParticipantQuery(this);
		}
	}
}
export class IsEnrollmentStatusPredicateContext extends StudyPredicateContext {
	public STR(): TerminalNode { return this.getToken(PexParser.STR, 0); }
	constructor(ctx: StudyPredicateContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: PexListener): void {
		if (listener.enterIsEnrollmentStatusPredicate) {
			listener.enterIsEnrollmentStatusPredicate(this);
		}
	}
	// @Override
	public exitRule(listener: PexListener): void {
		if (listener.exitIsEnrollmentStatusPredicate) {
			listener.exitIsEnrollmentStatusPredicate(this);
		}
	}
}


export class FormPredicateContext extends ParserRuleContext {
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return PexParser.RULE_formPredicate; }
	public copyFrom(ctx: FormPredicateContext): void {
		super.copyFrom(ctx);
	}
}
export class IsStatusPredicateContext extends FormPredicateContext {
	public STR(): TerminalNode[];
	public STR(i: number): TerminalNode;
	public STR(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(PexParser.STR);
		} else {
			return this.getToken(PexParser.STR, i);
		}
	}
	constructor(ctx: FormPredicateContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: PexListener): void {
		if (listener.enterIsStatusPredicate) {
			listener.enterIsStatusPredicate(this);
		}
	}
	// @Override
	public exitRule(listener: PexListener): void {
		if (listener.exitIsStatusPredicate) {
			listener.exitIsStatusPredicate(this);
		}
	}
}
export class HasInstancePredicateContext extends FormPredicateContext {
	constructor(ctx: FormPredicateContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: PexListener): void {
		if (listener.enterHasInstancePredicate) {
			listener.enterHasInstancePredicate(this);
		}
	}
	// @Override
	public exitRule(listener: PexListener): void {
		if (listener.exitHasInstancePredicate) {
			listener.exitHasInstancePredicate(this);
		}
	}
}


export class FormInstancePredicateContext extends ParserRuleContext {
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return PexParser.RULE_formInstancePredicate; }
	public copyFrom(ctx: FormInstancePredicateContext): void {
		super.copyFrom(ctx);
	}
}
export class IsInstanceStatusPredicateContext extends FormInstancePredicateContext {
	public STR(): TerminalNode[];
	public STR(i: number): TerminalNode;
	public STR(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(PexParser.STR);
		} else {
			return this.getToken(PexParser.STR, i);
		}
	}
	constructor(ctx: FormInstancePredicateContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: PexListener): void {
		if (listener.enterIsInstanceStatusPredicate) {
			listener.enterIsInstanceStatusPredicate(this);
		}
	}
	// @Override
	public exitRule(listener: PexListener): void {
		if (listener.exitIsInstanceStatusPredicate) {
			listener.exitIsInstanceStatusPredicate(this);
		}
	}
}
export class InstanceSnapshotSubstitutionQueryContext extends FormInstancePredicateContext {
	public STR(): TerminalNode { return this.getToken(PexParser.STR, 0); }
	constructor(ctx: FormInstancePredicateContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: PexListener): void {
		if (listener.enterInstanceSnapshotSubstitutionQuery) {
			listener.enterInstanceSnapshotSubstitutionQuery(this);
		}
	}
	// @Override
	public exitRule(listener: PexListener): void {
		if (listener.exitInstanceSnapshotSubstitutionQuery) {
			listener.exitInstanceSnapshotSubstitutionQuery(this);
		}
	}
}
export class HasPreviousInstancePredicateContext extends FormInstancePredicateContext {
	constructor(ctx: FormInstancePredicateContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: PexListener): void {
		if (listener.enterHasPreviousInstancePredicate) {
			listener.enterHasPreviousInstancePredicate(this);
		}
	}
	// @Override
	public exitRule(listener: PexListener): void {
		if (listener.exitHasPreviousInstancePredicate) {
			listener.exitHasPreviousInstancePredicate(this);
		}
	}
}


export class QuestionPredicateContext extends ParserRuleContext {
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return PexParser.RULE_questionPredicate; }
	public copyFrom(ctx: QuestionPredicateContext): void {
		super.copyFrom(ctx);
	}
}
export class IsAnsweredPredicateContext extends QuestionPredicateContext {
	constructor(ctx: QuestionPredicateContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: PexListener): void {
		if (listener.enterIsAnsweredPredicate) {
			listener.enterIsAnsweredPredicate(this);
		}
	}
	// @Override
	public exitRule(listener: PexListener): void {
		if (listener.exitIsAnsweredPredicate) {
			listener.exitIsAnsweredPredicate(this);
		}
	}
}
export class NumChildAnswersQueryContext extends QuestionPredicateContext {
	public STR(): TerminalNode { return this.getToken(PexParser.STR, 0); }
	constructor(ctx: QuestionPredicateContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: PexListener): void {
		if (listener.enterNumChildAnswersQuery) {
			listener.enterNumChildAnswersQuery(this);
		}
	}
	// @Override
	public exitRule(listener: PexListener): void {
		if (listener.exitNumChildAnswersQuery) {
			listener.exitNumChildAnswersQuery(this);
		}
	}
}


export class PredicateContext extends ParserRuleContext {
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return PexParser.RULE_predicate; }
	public copyFrom(ctx: PredicateContext): void {
		super.copyFrom(ctx);
	}
}
export class HasTruePredicateContext extends PredicateContext {
	constructor(ctx: PredicateContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: PexListener): void {
		if (listener.enterHasTruePredicate) {
			listener.enterHasTruePredicate(this);
		}
	}
	// @Override
	public exitRule(listener: PexListener): void {
		if (listener.exitHasTruePredicate) {
			listener.exitHasTruePredicate(this);
		}
	}
}
export class HasFalsePredicateContext extends PredicateContext {
	constructor(ctx: PredicateContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: PexListener): void {
		if (listener.enterHasFalsePredicate) {
			listener.enterHasFalsePredicate(this);
		}
	}
	// @Override
	public exitRule(listener: PexListener): void {
		if (listener.exitHasFalsePredicate) {
			listener.exitHasFalsePredicate(this);
		}
	}
}
export class HasTextPredicateContext extends PredicateContext {
	constructor(ctx: PredicateContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: PexListener): void {
		if (listener.enterHasTextPredicate) {
			listener.enterHasTextPredicate(this);
		}
	}
	// @Override
	public exitRule(listener: PexListener): void {
		if (listener.exitHasTextPredicate) {
			listener.exitHasTextPredicate(this);
		}
	}
}
export class HasOptionPredicateContext extends PredicateContext {
	public STR(): TerminalNode { return this.getToken(PexParser.STR, 0); }
	constructor(ctx: PredicateContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: PexListener): void {
		if (listener.enterHasOptionPredicate) {
			listener.enterHasOptionPredicate(this);
		}
	}
	// @Override
	public exitRule(listener: PexListener): void {
		if (listener.exitHasOptionPredicate) {
			listener.exitHasOptionPredicate(this);
		}
	}
}
export class HasAnyOptionPredicateContext extends PredicateContext {
	public STR(): TerminalNode[];
	public STR(i: number): TerminalNode;
	public STR(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(PexParser.STR);
		} else {
			return this.getToken(PexParser.STR, i);
		}
	}
	constructor(ctx: PredicateContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: PexListener): void {
		if (listener.enterHasAnyOptionPredicate) {
			listener.enterHasAnyOptionPredicate(this);
		}
	}
	// @Override
	public exitRule(listener: PexListener): void {
		if (listener.exitHasAnyOptionPredicate) {
			listener.exitHasAnyOptionPredicate(this);
		}
	}
}
export class HasOptionStartsWithPredicateContext extends PredicateContext {
	public STR(): TerminalNode[];
	public STR(i: number): TerminalNode;
	public STR(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(PexParser.STR);
		} else {
			return this.getToken(PexParser.STR, i);
		}
	}
	constructor(ctx: PredicateContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: PexListener): void {
		if (listener.enterHasOptionStartsWithPredicate) {
			listener.enterHasOptionStartsWithPredicate(this);
		}
	}
	// @Override
	public exitRule(listener: PexListener): void {
		if (listener.exitHasOptionStartsWithPredicate) {
			listener.exitHasOptionStartsWithPredicate(this);
		}
	}
}
export class HasDatePredicateContext extends PredicateContext {
	constructor(ctx: PredicateContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: PexListener): void {
		if (listener.enterHasDatePredicate) {
			listener.enterHasDatePredicate(this);
		}
	}
	// @Override
	public exitRule(listener: PexListener): void {
		if (listener.exitHasDatePredicate) {
			listener.exitHasDatePredicate(this);
		}
	}
}
export class AgeAtLeastPredicateContext extends PredicateContext {
	public INT(): TerminalNode { return this.getToken(PexParser.INT, 0); }
	public TIMEUNIT(): TerminalNode { return this.getToken(PexParser.TIMEUNIT, 0); }
	constructor(ctx: PredicateContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: PexListener): void {
		if (listener.enterAgeAtLeastPredicate) {
			listener.enterAgeAtLeastPredicate(this);
		}
	}
	// @Override
	public exitRule(listener: PexListener): void {
		if (listener.exitAgeAtLeastPredicate) {
			listener.exitAgeAtLeastPredicate(this);
		}
	}
}
export class ValueQueryContext extends PredicateContext {
	constructor(ctx: PredicateContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: PexListener): void {
		if (listener.enterValueQuery) {
			listener.enterValueQuery(this);
		}
	}
	// @Override
	public exitRule(listener: PexListener): void {
		if (listener.exitValueQuery) {
			listener.exitValueQuery(this);
		}
	}
}


export class ProfileDataQueryContext extends ParserRuleContext {
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return PexParser.RULE_profileDataQuery; }
	public copyFrom(ctx: ProfileDataQueryContext): void {
		super.copyFrom(ctx);
	}
}
export class ProfileBirthDateQueryContext extends ProfileDataQueryContext {
	constructor(ctx: ProfileDataQueryContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: PexListener): void {
		if (listener.enterProfileBirthDateQuery) {
			listener.enterProfileBirthDateQuery(this);
		}
	}
	// @Override
	public exitRule(listener: PexListener): void {
		if (listener.exitProfileBirthDateQuery) {
			listener.exitProfileBirthDateQuery(this);
		}
	}
}
export class ProfileAgeQueryContext extends ProfileDataQueryContext {
	constructor(ctx: ProfileDataQueryContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: PexListener): void {
		if (listener.enterProfileAgeQuery) {
			listener.enterProfileAgeQuery(this);
		}
	}
	// @Override
	public exitRule(listener: PexListener): void {
		if (listener.exitProfileAgeQuery) {
			listener.exitProfileAgeQuery(this);
		}
	}
}
export class ProfileLanguageQueryContext extends ProfileDataQueryContext {
	constructor(ctx: ProfileDataQueryContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: PexListener): void {
		if (listener.enterProfileLanguageQuery) {
			listener.enterProfileLanguageQuery(this);
		}
	}
	// @Override
	public exitRule(listener: PexListener): void {
		if (listener.exitProfileLanguageQuery) {
			listener.exitProfileLanguageQuery(this);
		}
	}
}


export class KitEventQueryContext extends ParserRuleContext {
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return PexParser.RULE_kitEventQuery; }
	public copyFrom(ctx: KitEventQueryContext): void {
		super.copyFrom(ctx);
	}
}
export class IsKitReasonQueryContext extends KitEventQueryContext {
	public STR(): TerminalNode[];
	public STR(i: number): TerminalNode;
	public STR(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(PexParser.STR);
		} else {
			return this.getToken(PexParser.STR, i);
		}
	}
	constructor(ctx: KitEventQueryContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: PexListener): void {
		if (listener.enterIsKitReasonQuery) {
			listener.enterIsKitReasonQuery(this);
		}
	}
	// @Override
	public exitRule(listener: PexListener): void {
		if (listener.exitIsKitReasonQuery) {
			listener.exitIsKitReasonQuery(this);
		}
	}
}


export class TestResultQueryContext extends ParserRuleContext {
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return PexParser.RULE_testResultQuery; }
	public copyFrom(ctx: TestResultQueryContext): void {
		super.copyFrom(ctx);
	}
}
export class IsCorrectedTestResultQueryContext extends TestResultQueryContext {
	constructor(ctx: TestResultQueryContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: PexListener): void {
		if (listener.enterIsCorrectedTestResultQuery) {
			listener.enterIsCorrectedTestResultQuery(this);
		}
	}
	// @Override
	public exitRule(listener: PexListener): void {
		if (listener.exitIsCorrectedTestResultQuery) {
			listener.exitIsCorrectedTestResultQuery(this);
		}
	}
}
export class IsPositiveTestResultQueryContext extends TestResultQueryContext {
	constructor(ctx: TestResultQueryContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: PexListener): void {
		if (listener.enterIsPositiveTestResultQuery) {
			listener.enterIsPositiveTestResultQuery(this);
		}
	}
	// @Override
	public exitRule(listener: PexListener): void {
		if (listener.exitIsPositiveTestResultQuery) {
			listener.exitIsPositiveTestResultQuery(this);
		}
	}
}


