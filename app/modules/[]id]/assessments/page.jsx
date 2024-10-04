'use client';

import AssessmentChoicePage from '@/app/components/AssessmentChoice';
import { useParams } from 'next/navigation';
//import AssessmentChoicePage from '@/app/components/AssessmentChoicePage';

export default function AssessmentChoicePageWrapper() {
  const params = useParams();
  const id = params.id;

  return <AssessmentChoicePage moduleId={id} />;
}