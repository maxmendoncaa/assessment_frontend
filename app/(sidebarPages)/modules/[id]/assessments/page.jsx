'use client';
import AssessmentChoicePage from '@/components/AssessmentChoice';

export default function AssessmentChoicePageWrapper(props) {
    return <AssessmentChoicePage moduleId={props.params.id} />;
}