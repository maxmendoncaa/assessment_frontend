'use client';

import AssessmentChoicePage from '@/app/components/AssessmentChoice';
import { useParams } from 'next/navigation';
//import AssessmentChoicePage from '@/app/components/AssessmentChoicePage';

export default function AssessmentChoicePageWrapper(props) {

    return <AssessmentChoicePage moduleId={props.params.id} />;
}