// Generated from Pex.g4 by ANTLR 4.9.0-SNAPSHOT


import { ParseTreeListener } from "antlr4ts/tree/ParseTreeListener";

import { IsStatusPredicateContext } from "./PexParser";
import { HasInstancePredicateContext } from "./PexParser";
import { StudyQueryContext } from "./PexParser";
import { FormQueryContext } from "./PexParser";
import { FormInstanceQueryContext } from "./PexParser";
import { QuestionQueryContext } from "./PexParser";
import { DefaultLatestAnswerQueryContext } from "./PexParser";
import { DefaultLatestChildAnswerQueryContext } from "./PexParser";
import { AnswerQueryContext } from "./PexParser";
import { ChildAnswerQueryContext } from "./PexParser";
import { ProfileQueryContext } from "./PexParser";
import { EventKitQueryContext } from "./PexParser";
import { EventTestResultQueryContext } from "./PexParser";
import { ProfileBirthDateQueryContext } from "./PexParser";
import { ProfileAgeQueryContext } from "./PexParser";
import { ProfileLanguageQueryContext } from "./PexParser";
import { IsCorrectedTestResultQueryContext } from "./PexParser";
import { IsPositiveTestResultQueryContext } from "./PexParser";
import { HasTruePredicateContext } from "./PexParser";
import { HasFalsePredicateContext } from "./PexParser";
import { HasTextPredicateContext } from "./PexParser";
import { HasOptionPredicateContext } from "./PexParser";
import { HasAnyOptionPredicateContext } from "./PexParser";
import { HasOptionStartsWithPredicateContext } from "./PexParser";
import { HasDatePredicateContext } from "./PexParser";
import { AgeAtLeastPredicateContext } from "./PexParser";
import { ValueQueryContext } from "./PexParser";
import { IsAnsweredPredicateContext } from "./PexParser";
import { NumChildAnswersQueryContext } from "./PexParser";
import { HasAgedUpPredicateContext } from "./PexParser";
import { HasInvitationPredicateContext } from "./PexParser";
import { IsGovernedParticipantQueryContext } from "./PexParser";
import { IsEnrollmentStatusPredicateContext } from "./PexParser";
import { IsInstanceStatusPredicateContext } from "./PexParser";
import { InstanceSnapshotSubstitutionQueryContext } from "./PexParser";
import { HasPreviousInstancePredicateContext } from "./PexParser";
import { BoolLiteralExprContext } from "./PexParser";
import { IntLiteralExprContext } from "./PexParser";
import { StrLiteralExprContext } from "./PexParser";
import { QueryExprContext } from "./PexParser";
import { UnaryExprContext } from "./PexParser";
import { CompareExprContext } from "./PexParser";
import { EqualityExprContext } from "./PexParser";
import { AndExprContext } from "./PexParser";
import { OrExprContext } from "./PexParser";
import { GroupExprContext } from "./PexParser";
import { UserContext } from "./PexParser";
import { OperatorContext } from "./PexParser";
import { IsKitReasonQueryContext } from "./PexParser";
import { PexContext } from "./PexParser";
import { ExprContext } from "./PexParser";
import { QueryContext } from "./PexParser";
import { StudyContext } from "./PexParser";
import { FormContext } from "./PexParser";
import { InstanceContext } from "./PexParser";
import { QuestionContext } from "./PexParser";
import { ChildContext } from "./PexParser";
import { UserTypeContext } from "./PexParser";
import { StudyPredicateContext } from "./PexParser";
import { FormPredicateContext } from "./PexParser";
import { FormInstancePredicateContext } from "./PexParser";
import { QuestionPredicateContext } from "./PexParser";
import { PredicateContext } from "./PexParser";
import { ProfileDataQueryContext } from "./PexParser";
import { KitEventQueryContext } from "./PexParser";
import { TestResultQueryContext } from "./PexParser";


/**
 * This interface defines a complete listener for a parse tree produced by
 * `PexParser`.
 */
export interface PexListener extends ParseTreeListener {
	/**
	 * Enter a parse tree produced by the `IsStatusPredicate`
	 * labeled alternative in `PexParser.formPredicate`.
	 * @param ctx the parse tree
	 */
	enterIsStatusPredicate?: (ctx: IsStatusPredicateContext) => void;
	/**
	 * Exit a parse tree produced by the `IsStatusPredicate`
	 * labeled alternative in `PexParser.formPredicate`.
	 * @param ctx the parse tree
	 */
	exitIsStatusPredicate?: (ctx: IsStatusPredicateContext) => void;

	/**
	 * Enter a parse tree produced by the `HasInstancePredicate`
	 * labeled alternative in `PexParser.formPredicate`.
	 * @param ctx the parse tree
	 */
	enterHasInstancePredicate?: (ctx: HasInstancePredicateContext) => void;
	/**
	 * Exit a parse tree produced by the `HasInstancePredicate`
	 * labeled alternative in `PexParser.formPredicate`.
	 * @param ctx the parse tree
	 */
	exitHasInstancePredicate?: (ctx: HasInstancePredicateContext) => void;

	/**
	 * Enter a parse tree produced by the `StudyQuery`
	 * labeled alternative in `PexParser.query`.
	 * @param ctx the parse tree
	 */
	enterStudyQuery?: (ctx: StudyQueryContext) => void;
	/**
	 * Exit a parse tree produced by the `StudyQuery`
	 * labeled alternative in `PexParser.query`.
	 * @param ctx the parse tree
	 */
	exitStudyQuery?: (ctx: StudyQueryContext) => void;

	/**
	 * Enter a parse tree produced by the `FormQuery`
	 * labeled alternative in `PexParser.query`.
	 * @param ctx the parse tree
	 */
	enterFormQuery?: (ctx: FormQueryContext) => void;
	/**
	 * Exit a parse tree produced by the `FormQuery`
	 * labeled alternative in `PexParser.query`.
	 * @param ctx the parse tree
	 */
	exitFormQuery?: (ctx: FormQueryContext) => void;

	/**
	 * Enter a parse tree produced by the `FormInstanceQuery`
	 * labeled alternative in `PexParser.query`.
	 * @param ctx the parse tree
	 */
	enterFormInstanceQuery?: (ctx: FormInstanceQueryContext) => void;
	/**
	 * Exit a parse tree produced by the `FormInstanceQuery`
	 * labeled alternative in `PexParser.query`.
	 * @param ctx the parse tree
	 */
	exitFormInstanceQuery?: (ctx: FormInstanceQueryContext) => void;

	/**
	 * Enter a parse tree produced by the `QuestionQuery`
	 * labeled alternative in `PexParser.query`.
	 * @param ctx the parse tree
	 */
	enterQuestionQuery?: (ctx: QuestionQueryContext) => void;
	/**
	 * Exit a parse tree produced by the `QuestionQuery`
	 * labeled alternative in `PexParser.query`.
	 * @param ctx the parse tree
	 */
	exitQuestionQuery?: (ctx: QuestionQueryContext) => void;

	/**
	 * Enter a parse tree produced by the `DefaultLatestAnswerQuery`
	 * labeled alternative in `PexParser.query`.
	 * @param ctx the parse tree
	 */
	enterDefaultLatestAnswerQuery?: (ctx: DefaultLatestAnswerQueryContext) => void;
	/**
	 * Exit a parse tree produced by the `DefaultLatestAnswerQuery`
	 * labeled alternative in `PexParser.query`.
	 * @param ctx the parse tree
	 */
	exitDefaultLatestAnswerQuery?: (ctx: DefaultLatestAnswerQueryContext) => void;

	/**
	 * Enter a parse tree produced by the `DefaultLatestChildAnswerQuery`
	 * labeled alternative in `PexParser.query`.
	 * @param ctx the parse tree
	 */
	enterDefaultLatestChildAnswerQuery?: (ctx: DefaultLatestChildAnswerQueryContext) => void;
	/**
	 * Exit a parse tree produced by the `DefaultLatestChildAnswerQuery`
	 * labeled alternative in `PexParser.query`.
	 * @param ctx the parse tree
	 */
	exitDefaultLatestChildAnswerQuery?: (ctx: DefaultLatestChildAnswerQueryContext) => void;

	/**
	 * Enter a parse tree produced by the `AnswerQuery`
	 * labeled alternative in `PexParser.query`.
	 * @param ctx the parse tree
	 */
	enterAnswerQuery?: (ctx: AnswerQueryContext) => void;
	/**
	 * Exit a parse tree produced by the `AnswerQuery`
	 * labeled alternative in `PexParser.query`.
	 * @param ctx the parse tree
	 */
	exitAnswerQuery?: (ctx: AnswerQueryContext) => void;

	/**
	 * Enter a parse tree produced by the `ChildAnswerQuery`
	 * labeled alternative in `PexParser.query`.
	 * @param ctx the parse tree
	 */
	enterChildAnswerQuery?: (ctx: ChildAnswerQueryContext) => void;
	/**
	 * Exit a parse tree produced by the `ChildAnswerQuery`
	 * labeled alternative in `PexParser.query`.
	 * @param ctx the parse tree
	 */
	exitChildAnswerQuery?: (ctx: ChildAnswerQueryContext) => void;

	/**
	 * Enter a parse tree produced by the `ProfileQuery`
	 * labeled alternative in `PexParser.query`.
	 * @param ctx the parse tree
	 */
	enterProfileQuery?: (ctx: ProfileQueryContext) => void;
	/**
	 * Exit a parse tree produced by the `ProfileQuery`
	 * labeled alternative in `PexParser.query`.
	 * @param ctx the parse tree
	 */
	exitProfileQuery?: (ctx: ProfileQueryContext) => void;

	/**
	 * Enter a parse tree produced by the `EventKitQuery`
	 * labeled alternative in `PexParser.query`.
	 * @param ctx the parse tree
	 */
	enterEventKitQuery?: (ctx: EventKitQueryContext) => void;
	/**
	 * Exit a parse tree produced by the `EventKitQuery`
	 * labeled alternative in `PexParser.query`.
	 * @param ctx the parse tree
	 */
	exitEventKitQuery?: (ctx: EventKitQueryContext) => void;

	/**
	 * Enter a parse tree produced by the `EventTestResultQuery`
	 * labeled alternative in `PexParser.query`.
	 * @param ctx the parse tree
	 */
	enterEventTestResultQuery?: (ctx: EventTestResultQueryContext) => void;
	/**
	 * Exit a parse tree produced by the `EventTestResultQuery`
	 * labeled alternative in `PexParser.query`.
	 * @param ctx the parse tree
	 */
	exitEventTestResultQuery?: (ctx: EventTestResultQueryContext) => void;

	/**
	 * Enter a parse tree produced by the `ProfileBirthDateQuery`
	 * labeled alternative in `PexParser.profileDataQuery`.
	 * @param ctx the parse tree
	 */
	enterProfileBirthDateQuery?: (ctx: ProfileBirthDateQueryContext) => void;
	/**
	 * Exit a parse tree produced by the `ProfileBirthDateQuery`
	 * labeled alternative in `PexParser.profileDataQuery`.
	 * @param ctx the parse tree
	 */
	exitProfileBirthDateQuery?: (ctx: ProfileBirthDateQueryContext) => void;

	/**
	 * Enter a parse tree produced by the `ProfileAgeQuery`
	 * labeled alternative in `PexParser.profileDataQuery`.
	 * @param ctx the parse tree
	 */
	enterProfileAgeQuery?: (ctx: ProfileAgeQueryContext) => void;
	/**
	 * Exit a parse tree produced by the `ProfileAgeQuery`
	 * labeled alternative in `PexParser.profileDataQuery`.
	 * @param ctx the parse tree
	 */
	exitProfileAgeQuery?: (ctx: ProfileAgeQueryContext) => void;

	/**
	 * Enter a parse tree produced by the `ProfileLanguageQuery`
	 * labeled alternative in `PexParser.profileDataQuery`.
	 * @param ctx the parse tree
	 */
	enterProfileLanguageQuery?: (ctx: ProfileLanguageQueryContext) => void;
	/**
	 * Exit a parse tree produced by the `ProfileLanguageQuery`
	 * labeled alternative in `PexParser.profileDataQuery`.
	 * @param ctx the parse tree
	 */
	exitProfileLanguageQuery?: (ctx: ProfileLanguageQueryContext) => void;

	/**
	 * Enter a parse tree produced by the `IsCorrectedTestResultQuery`
	 * labeled alternative in `PexParser.testResultQuery`.
	 * @param ctx the parse tree
	 */
	enterIsCorrectedTestResultQuery?: (ctx: IsCorrectedTestResultQueryContext) => void;
	/**
	 * Exit a parse tree produced by the `IsCorrectedTestResultQuery`
	 * labeled alternative in `PexParser.testResultQuery`.
	 * @param ctx the parse tree
	 */
	exitIsCorrectedTestResultQuery?: (ctx: IsCorrectedTestResultQueryContext) => void;

	/**
	 * Enter a parse tree produced by the `IsPositiveTestResultQuery`
	 * labeled alternative in `PexParser.testResultQuery`.
	 * @param ctx the parse tree
	 */
	enterIsPositiveTestResultQuery?: (ctx: IsPositiveTestResultQueryContext) => void;
	/**
	 * Exit a parse tree produced by the `IsPositiveTestResultQuery`
	 * labeled alternative in `PexParser.testResultQuery`.
	 * @param ctx the parse tree
	 */
	exitIsPositiveTestResultQuery?: (ctx: IsPositiveTestResultQueryContext) => void;

	/**
	 * Enter a parse tree produced by the `HasTruePredicate`
	 * labeled alternative in `PexParser.predicate`.
	 * @param ctx the parse tree
	 */
	enterHasTruePredicate?: (ctx: HasTruePredicateContext) => void;
	/**
	 * Exit a parse tree produced by the `HasTruePredicate`
	 * labeled alternative in `PexParser.predicate`.
	 * @param ctx the parse tree
	 */
	exitHasTruePredicate?: (ctx: HasTruePredicateContext) => void;

	/**
	 * Enter a parse tree produced by the `HasFalsePredicate`
	 * labeled alternative in `PexParser.predicate`.
	 * @param ctx the parse tree
	 */
	enterHasFalsePredicate?: (ctx: HasFalsePredicateContext) => void;
	/**
	 * Exit a parse tree produced by the `HasFalsePredicate`
	 * labeled alternative in `PexParser.predicate`.
	 * @param ctx the parse tree
	 */
	exitHasFalsePredicate?: (ctx: HasFalsePredicateContext) => void;

	/**
	 * Enter a parse tree produced by the `HasTextPredicate`
	 * labeled alternative in `PexParser.predicate`.
	 * @param ctx the parse tree
	 */
	enterHasTextPredicate?: (ctx: HasTextPredicateContext) => void;
	/**
	 * Exit a parse tree produced by the `HasTextPredicate`
	 * labeled alternative in `PexParser.predicate`.
	 * @param ctx the parse tree
	 */
	exitHasTextPredicate?: (ctx: HasTextPredicateContext) => void;

	/**
	 * Enter a parse tree produced by the `HasOptionPredicate`
	 * labeled alternative in `PexParser.predicate`.
	 * @param ctx the parse tree
	 */
	enterHasOptionPredicate?: (ctx: HasOptionPredicateContext) => void;
	/**
	 * Exit a parse tree produced by the `HasOptionPredicate`
	 * labeled alternative in `PexParser.predicate`.
	 * @param ctx the parse tree
	 */
	exitHasOptionPredicate?: (ctx: HasOptionPredicateContext) => void;

	/**
	 * Enter a parse tree produced by the `HasAnyOptionPredicate`
	 * labeled alternative in `PexParser.predicate`.
	 * @param ctx the parse tree
	 */
	enterHasAnyOptionPredicate?: (ctx: HasAnyOptionPredicateContext) => void;
	/**
	 * Exit a parse tree produced by the `HasAnyOptionPredicate`
	 * labeled alternative in `PexParser.predicate`.
	 * @param ctx the parse tree
	 */
	exitHasAnyOptionPredicate?: (ctx: HasAnyOptionPredicateContext) => void;

	/**
	 * Enter a parse tree produced by the `HasOptionStartsWithPredicate`
	 * labeled alternative in `PexParser.predicate`.
	 * @param ctx the parse tree
	 */
	enterHasOptionStartsWithPredicate?: (ctx: HasOptionStartsWithPredicateContext) => void;
	/**
	 * Exit a parse tree produced by the `HasOptionStartsWithPredicate`
	 * labeled alternative in `PexParser.predicate`.
	 * @param ctx the parse tree
	 */
	exitHasOptionStartsWithPredicate?: (ctx: HasOptionStartsWithPredicateContext) => void;

	/**
	 * Enter a parse tree produced by the `HasDatePredicate`
	 * labeled alternative in `PexParser.predicate`.
	 * @param ctx the parse tree
	 */
	enterHasDatePredicate?: (ctx: HasDatePredicateContext) => void;
	/**
	 * Exit a parse tree produced by the `HasDatePredicate`
	 * labeled alternative in `PexParser.predicate`.
	 * @param ctx the parse tree
	 */
	exitHasDatePredicate?: (ctx: HasDatePredicateContext) => void;

	/**
	 * Enter a parse tree produced by the `AgeAtLeastPredicate`
	 * labeled alternative in `PexParser.predicate`.
	 * @param ctx the parse tree
	 */
	enterAgeAtLeastPredicate?: (ctx: AgeAtLeastPredicateContext) => void;
	/**
	 * Exit a parse tree produced by the `AgeAtLeastPredicate`
	 * labeled alternative in `PexParser.predicate`.
	 * @param ctx the parse tree
	 */
	exitAgeAtLeastPredicate?: (ctx: AgeAtLeastPredicateContext) => void;

	/**
	 * Enter a parse tree produced by the `ValueQuery`
	 * labeled alternative in `PexParser.predicate`.
	 * @param ctx the parse tree
	 */
	enterValueQuery?: (ctx: ValueQueryContext) => void;
	/**
	 * Exit a parse tree produced by the `ValueQuery`
	 * labeled alternative in `PexParser.predicate`.
	 * @param ctx the parse tree
	 */
	exitValueQuery?: (ctx: ValueQueryContext) => void;

	/**
	 * Enter a parse tree produced by the `IsAnsweredPredicate`
	 * labeled alternative in `PexParser.questionPredicate`.
	 * @param ctx the parse tree
	 */
	enterIsAnsweredPredicate?: (ctx: IsAnsweredPredicateContext) => void;
	/**
	 * Exit a parse tree produced by the `IsAnsweredPredicate`
	 * labeled alternative in `PexParser.questionPredicate`.
	 * @param ctx the parse tree
	 */
	exitIsAnsweredPredicate?: (ctx: IsAnsweredPredicateContext) => void;

	/**
	 * Enter a parse tree produced by the `NumChildAnswersQuery`
	 * labeled alternative in `PexParser.questionPredicate`.
	 * @param ctx the parse tree
	 */
	enterNumChildAnswersQuery?: (ctx: NumChildAnswersQueryContext) => void;
	/**
	 * Exit a parse tree produced by the `NumChildAnswersQuery`
	 * labeled alternative in `PexParser.questionPredicate`.
	 * @param ctx the parse tree
	 */
	exitNumChildAnswersQuery?: (ctx: NumChildAnswersQueryContext) => void;

	/**
	 * Enter a parse tree produced by the `HasAgedUpPredicate`
	 * labeled alternative in `PexParser.studyPredicate`.
	 * @param ctx the parse tree
	 */
	enterHasAgedUpPredicate?: (ctx: HasAgedUpPredicateContext) => void;
	/**
	 * Exit a parse tree produced by the `HasAgedUpPredicate`
	 * labeled alternative in `PexParser.studyPredicate`.
	 * @param ctx the parse tree
	 */
	exitHasAgedUpPredicate?: (ctx: HasAgedUpPredicateContext) => void;

	/**
	 * Enter a parse tree produced by the `HasInvitationPredicate`
	 * labeled alternative in `PexParser.studyPredicate`.
	 * @param ctx the parse tree
	 */
	enterHasInvitationPredicate?: (ctx: HasInvitationPredicateContext) => void;
	/**
	 * Exit a parse tree produced by the `HasInvitationPredicate`
	 * labeled alternative in `PexParser.studyPredicate`.
	 * @param ctx the parse tree
	 */
	exitHasInvitationPredicate?: (ctx: HasInvitationPredicateContext) => void;

	/**
	 * Enter a parse tree produced by the `IsGovernedParticipantQuery`
	 * labeled alternative in `PexParser.studyPredicate`.
	 * @param ctx the parse tree
	 */
	enterIsGovernedParticipantQuery?: (ctx: IsGovernedParticipantQueryContext) => void;
	/**
	 * Exit a parse tree produced by the `IsGovernedParticipantQuery`
	 * labeled alternative in `PexParser.studyPredicate`.
	 * @param ctx the parse tree
	 */
	exitIsGovernedParticipantQuery?: (ctx: IsGovernedParticipantQueryContext) => void;

	/**
	 * Enter a parse tree produced by the `IsEnrollmentStatusPredicate`
	 * labeled alternative in `PexParser.studyPredicate`.
	 * @param ctx the parse tree
	 */
	enterIsEnrollmentStatusPredicate?: (ctx: IsEnrollmentStatusPredicateContext) => void;
	/**
	 * Exit a parse tree produced by the `IsEnrollmentStatusPredicate`
	 * labeled alternative in `PexParser.studyPredicate`.
	 * @param ctx the parse tree
	 */
	exitIsEnrollmentStatusPredicate?: (ctx: IsEnrollmentStatusPredicateContext) => void;

	/**
	 * Enter a parse tree produced by the `IsInstanceStatusPredicate`
	 * labeled alternative in `PexParser.formInstancePredicate`.
	 * @param ctx the parse tree
	 */
	enterIsInstanceStatusPredicate?: (ctx: IsInstanceStatusPredicateContext) => void;
	/**
	 * Exit a parse tree produced by the `IsInstanceStatusPredicate`
	 * labeled alternative in `PexParser.formInstancePredicate`.
	 * @param ctx the parse tree
	 */
	exitIsInstanceStatusPredicate?: (ctx: IsInstanceStatusPredicateContext) => void;

	/**
	 * Enter a parse tree produced by the `InstanceSnapshotSubstitutionQuery`
	 * labeled alternative in `PexParser.formInstancePredicate`.
	 * @param ctx the parse tree
	 */
	enterInstanceSnapshotSubstitutionQuery?: (ctx: InstanceSnapshotSubstitutionQueryContext) => void;
	/**
	 * Exit a parse tree produced by the `InstanceSnapshotSubstitutionQuery`
	 * labeled alternative in `PexParser.formInstancePredicate`.
	 * @param ctx the parse tree
	 */
	exitInstanceSnapshotSubstitutionQuery?: (ctx: InstanceSnapshotSubstitutionQueryContext) => void;

	/**
	 * Enter a parse tree produced by the `HasPreviousInstancePredicate`
	 * labeled alternative in `PexParser.formInstancePredicate`.
	 * @param ctx the parse tree
	 */
	enterHasPreviousInstancePredicate?: (ctx: HasPreviousInstancePredicateContext) => void;
	/**
	 * Exit a parse tree produced by the `HasPreviousInstancePredicate`
	 * labeled alternative in `PexParser.formInstancePredicate`.
	 * @param ctx the parse tree
	 */
	exitHasPreviousInstancePredicate?: (ctx: HasPreviousInstancePredicateContext) => void;

	/**
	 * Enter a parse tree produced by the `BoolLiteralExpr`
	 * labeled alternative in `PexParser.expr`.
	 * @param ctx the parse tree
	 */
	enterBoolLiteralExpr?: (ctx: BoolLiteralExprContext) => void;
	/**
	 * Exit a parse tree produced by the `BoolLiteralExpr`
	 * labeled alternative in `PexParser.expr`.
	 * @param ctx the parse tree
	 */
	exitBoolLiteralExpr?: (ctx: BoolLiteralExprContext) => void;

	/**
	 * Enter a parse tree produced by the `IntLiteralExpr`
	 * labeled alternative in `PexParser.expr`.
	 * @param ctx the parse tree
	 */
	enterIntLiteralExpr?: (ctx: IntLiteralExprContext) => void;
	/**
	 * Exit a parse tree produced by the `IntLiteralExpr`
	 * labeled alternative in `PexParser.expr`.
	 * @param ctx the parse tree
	 */
	exitIntLiteralExpr?: (ctx: IntLiteralExprContext) => void;

	/**
	 * Enter a parse tree produced by the `StrLiteralExpr`
	 * labeled alternative in `PexParser.expr`.
	 * @param ctx the parse tree
	 */
	enterStrLiteralExpr?: (ctx: StrLiteralExprContext) => void;
	/**
	 * Exit a parse tree produced by the `StrLiteralExpr`
	 * labeled alternative in `PexParser.expr`.
	 * @param ctx the parse tree
	 */
	exitStrLiteralExpr?: (ctx: StrLiteralExprContext) => void;

	/**
	 * Enter a parse tree produced by the `QueryExpr`
	 * labeled alternative in `PexParser.expr`.
	 * @param ctx the parse tree
	 */
	enterQueryExpr?: (ctx: QueryExprContext) => void;
	/**
	 * Exit a parse tree produced by the `QueryExpr`
	 * labeled alternative in `PexParser.expr`.
	 * @param ctx the parse tree
	 */
	exitQueryExpr?: (ctx: QueryExprContext) => void;

	/**
	 * Enter a parse tree produced by the `UnaryExpr`
	 * labeled alternative in `PexParser.expr`.
	 * @param ctx the parse tree
	 */
	enterUnaryExpr?: (ctx: UnaryExprContext) => void;
	/**
	 * Exit a parse tree produced by the `UnaryExpr`
	 * labeled alternative in `PexParser.expr`.
	 * @param ctx the parse tree
	 */
	exitUnaryExpr?: (ctx: UnaryExprContext) => void;

	/**
	 * Enter a parse tree produced by the `CompareExpr`
	 * labeled alternative in `PexParser.expr`.
	 * @param ctx the parse tree
	 */
	enterCompareExpr?: (ctx: CompareExprContext) => void;
	/**
	 * Exit a parse tree produced by the `CompareExpr`
	 * labeled alternative in `PexParser.expr`.
	 * @param ctx the parse tree
	 */
	exitCompareExpr?: (ctx: CompareExprContext) => void;

	/**
	 * Enter a parse tree produced by the `EqualityExpr`
	 * labeled alternative in `PexParser.expr`.
	 * @param ctx the parse tree
	 */
	enterEqualityExpr?: (ctx: EqualityExprContext) => void;
	/**
	 * Exit a parse tree produced by the `EqualityExpr`
	 * labeled alternative in `PexParser.expr`.
	 * @param ctx the parse tree
	 */
	exitEqualityExpr?: (ctx: EqualityExprContext) => void;

	/**
	 * Enter a parse tree produced by the `AndExpr`
	 * labeled alternative in `PexParser.expr`.
	 * @param ctx the parse tree
	 */
	enterAndExpr?: (ctx: AndExprContext) => void;
	/**
	 * Exit a parse tree produced by the `AndExpr`
	 * labeled alternative in `PexParser.expr`.
	 * @param ctx the parse tree
	 */
	exitAndExpr?: (ctx: AndExprContext) => void;

	/**
	 * Enter a parse tree produced by the `OrExpr`
	 * labeled alternative in `PexParser.expr`.
	 * @param ctx the parse tree
	 */
	enterOrExpr?: (ctx: OrExprContext) => void;
	/**
	 * Exit a parse tree produced by the `OrExpr`
	 * labeled alternative in `PexParser.expr`.
	 * @param ctx the parse tree
	 */
	exitOrExpr?: (ctx: OrExprContext) => void;

	/**
	 * Enter a parse tree produced by the `GroupExpr`
	 * labeled alternative in `PexParser.expr`.
	 * @param ctx the parse tree
	 */
	enterGroupExpr?: (ctx: GroupExprContext) => void;
	/**
	 * Exit a parse tree produced by the `GroupExpr`
	 * labeled alternative in `PexParser.expr`.
	 * @param ctx the parse tree
	 */
	exitGroupExpr?: (ctx: GroupExprContext) => void;

	/**
	 * Enter a parse tree produced by the `user`
	 * labeled alternative in `PexParser.userType`.
	 * @param ctx the parse tree
	 */
	enterUser?: (ctx: UserContext) => void;
	/**
	 * Exit a parse tree produced by the `user`
	 * labeled alternative in `PexParser.userType`.
	 * @param ctx the parse tree
	 */
	exitUser?: (ctx: UserContext) => void;

	/**
	 * Enter a parse tree produced by the `operator`
	 * labeled alternative in `PexParser.userType`.
	 * @param ctx the parse tree
	 */
	enterOperator?: (ctx: OperatorContext) => void;
	/**
	 * Exit a parse tree produced by the `operator`
	 * labeled alternative in `PexParser.userType`.
	 * @param ctx the parse tree
	 */
	exitOperator?: (ctx: OperatorContext) => void;

	/**
	 * Enter a parse tree produced by the `IsKitReasonQuery`
	 * labeled alternative in `PexParser.kitEventQuery`.
	 * @param ctx the parse tree
	 */
	enterIsKitReasonQuery?: (ctx: IsKitReasonQueryContext) => void;
	/**
	 * Exit a parse tree produced by the `IsKitReasonQuery`
	 * labeled alternative in `PexParser.kitEventQuery`.
	 * @param ctx the parse tree
	 */
	exitIsKitReasonQuery?: (ctx: IsKitReasonQueryContext) => void;

	/**
	 * Enter a parse tree produced by `PexParser.pex`.
	 * @param ctx the parse tree
	 */
	enterPex?: (ctx: PexContext) => void;
	/**
	 * Exit a parse tree produced by `PexParser.pex`.
	 * @param ctx the parse tree
	 */
	exitPex?: (ctx: PexContext) => void;

	/**
	 * Enter a parse tree produced by `PexParser.expr`.
	 * @param ctx the parse tree
	 */
	enterExpr?: (ctx: ExprContext) => void;
	/**
	 * Exit a parse tree produced by `PexParser.expr`.
	 * @param ctx the parse tree
	 */
	exitExpr?: (ctx: ExprContext) => void;

	/**
	 * Enter a parse tree produced by `PexParser.query`.
	 * @param ctx the parse tree
	 */
	enterQuery?: (ctx: QueryContext) => void;
	/**
	 * Exit a parse tree produced by `PexParser.query`.
	 * @param ctx the parse tree
	 */
	exitQuery?: (ctx: QueryContext) => void;

	/**
	 * Enter a parse tree produced by `PexParser.study`.
	 * @param ctx the parse tree
	 */
	enterStudy?: (ctx: StudyContext) => void;
	/**
	 * Exit a parse tree produced by `PexParser.study`.
	 * @param ctx the parse tree
	 */
	exitStudy?: (ctx: StudyContext) => void;

	/**
	 * Enter a parse tree produced by `PexParser.form`.
	 * @param ctx the parse tree
	 */
	enterForm?: (ctx: FormContext) => void;
	/**
	 * Exit a parse tree produced by `PexParser.form`.
	 * @param ctx the parse tree
	 */
	exitForm?: (ctx: FormContext) => void;

	/**
	 * Enter a parse tree produced by `PexParser.instance`.
	 * @param ctx the parse tree
	 */
	enterInstance?: (ctx: InstanceContext) => void;
	/**
	 * Exit a parse tree produced by `PexParser.instance`.
	 * @param ctx the parse tree
	 */
	exitInstance?: (ctx: InstanceContext) => void;

	/**
	 * Enter a parse tree produced by `PexParser.question`.
	 * @param ctx the parse tree
	 */
	enterQuestion?: (ctx: QuestionContext) => void;
	/**
	 * Exit a parse tree produced by `PexParser.question`.
	 * @param ctx the parse tree
	 */
	exitQuestion?: (ctx: QuestionContext) => void;

	/**
	 * Enter a parse tree produced by `PexParser.child`.
	 * @param ctx the parse tree
	 */
	enterChild?: (ctx: ChildContext) => void;
	/**
	 * Exit a parse tree produced by `PexParser.child`.
	 * @param ctx the parse tree
	 */
	exitChild?: (ctx: ChildContext) => void;

	/**
	 * Enter a parse tree produced by `PexParser.userType`.
	 * @param ctx the parse tree
	 */
	enterUserType?: (ctx: UserTypeContext) => void;
	/**
	 * Exit a parse tree produced by `PexParser.userType`.
	 * @param ctx the parse tree
	 */
	exitUserType?: (ctx: UserTypeContext) => void;

	/**
	 * Enter a parse tree produced by `PexParser.studyPredicate`.
	 * @param ctx the parse tree
	 */
	enterStudyPredicate?: (ctx: StudyPredicateContext) => void;
	/**
	 * Exit a parse tree produced by `PexParser.studyPredicate`.
	 * @param ctx the parse tree
	 */
	exitStudyPredicate?: (ctx: StudyPredicateContext) => void;

	/**
	 * Enter a parse tree produced by `PexParser.formPredicate`.
	 * @param ctx the parse tree
	 */
	enterFormPredicate?: (ctx: FormPredicateContext) => void;
	/**
	 * Exit a parse tree produced by `PexParser.formPredicate`.
	 * @param ctx the parse tree
	 */
	exitFormPredicate?: (ctx: FormPredicateContext) => void;

	/**
	 * Enter a parse tree produced by `PexParser.formInstancePredicate`.
	 * @param ctx the parse tree
	 */
	enterFormInstancePredicate?: (ctx: FormInstancePredicateContext) => void;
	/**
	 * Exit a parse tree produced by `PexParser.formInstancePredicate`.
	 * @param ctx the parse tree
	 */
	exitFormInstancePredicate?: (ctx: FormInstancePredicateContext) => void;

	/**
	 * Enter a parse tree produced by `PexParser.questionPredicate`.
	 * @param ctx the parse tree
	 */
	enterQuestionPredicate?: (ctx: QuestionPredicateContext) => void;
	/**
	 * Exit a parse tree produced by `PexParser.questionPredicate`.
	 * @param ctx the parse tree
	 */
	exitQuestionPredicate?: (ctx: QuestionPredicateContext) => void;

	/**
	 * Enter a parse tree produced by `PexParser.predicate`.
	 * @param ctx the parse tree
	 */
	enterPredicate?: (ctx: PredicateContext) => void;
	/**
	 * Exit a parse tree produced by `PexParser.predicate`.
	 * @param ctx the parse tree
	 */
	exitPredicate?: (ctx: PredicateContext) => void;

	/**
	 * Enter a parse tree produced by `PexParser.profileDataQuery`.
	 * @param ctx the parse tree
	 */
	enterProfileDataQuery?: (ctx: ProfileDataQueryContext) => void;
	/**
	 * Exit a parse tree produced by `PexParser.profileDataQuery`.
	 * @param ctx the parse tree
	 */
	exitProfileDataQuery?: (ctx: ProfileDataQueryContext) => void;

	/**
	 * Enter a parse tree produced by `PexParser.kitEventQuery`.
	 * @param ctx the parse tree
	 */
	enterKitEventQuery?: (ctx: KitEventQueryContext) => void;
	/**
	 * Exit a parse tree produced by `PexParser.kitEventQuery`.
	 * @param ctx the parse tree
	 */
	exitKitEventQuery?: (ctx: KitEventQueryContext) => void;

	/**
	 * Enter a parse tree produced by `PexParser.testResultQuery`.
	 * @param ctx the parse tree
	 */
	enterTestResultQuery?: (ctx: TestResultQueryContext) => void;
	/**
	 * Exit a parse tree produced by `PexParser.testResultQuery`.
	 * @param ctx the parse tree
	 */
	exitTestResultQuery?: (ctx: TestResultQueryContext) => void;
}

