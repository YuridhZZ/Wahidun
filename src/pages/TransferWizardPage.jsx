import React, { useEffect } from 'react';
import { useTransferStore } from '../store/transferStore';
import Step1Recipient from '../components/wizard/Recipient';
import Step2Amount from '../components/wizard/Amount';
import Step3Confirm from '../components/wizard/Confirm';
import Step4Result from '../components/wizard/Result';

const steps = [
  { id: '01', name: 'Recipient', status: 'current' },
  { id: '02', name: 'Amount', status: 'upcoming' },
  { id: '03', name: 'Confirm', status: 'upcoming' },
  { id: '04', name: 'Result', status: 'upcoming' },
];

const ProgressIndicator = ({ currentStep }) => {
  return (
    <nav aria-label="Progress">
      <ol role="list" className="space-y-4 md:flex md:space-x-8 md:space-y-0">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          let status = 'upcoming';
          if (stepNumber < currentStep) {
            status = 'complete';
          } else if (stepNumber === currentStep) {
            status = 'current';
          }

          return (
            <li key={step.name} className="md:flex-1">
              {status === 'complete' ? (
                <div className="group flex w-full flex-col border-l-4 border-indigo-600 py-2 pl-4 transition-colors md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4">
                  <span className="text-sm font-medium text-indigo-600 transition-colors">{step.id}</span>
                  <span className="text-sm font-medium">{step.name}</span>
                </div>
              ) : status === 'current' ? (
                <div className="flex w-full flex-col border-l-4 border-indigo-600 py-2 pl-4 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4" aria-current="step">
                  <span className="text-sm font-medium text-indigo-600">{step.id}</span>
                  <span className="text-sm font-medium">{step.name}</span>
                </div>
              ) : (
                <div className="group flex w-full flex-col border-l-4 border-gray-200 py-2 pl-4 transition-colors md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4">
                  <span className="text-sm font-medium text-gray-500 transition-colors">{step.id}</span>
                  <span className="text-sm font-medium">{step.name}</span>
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

function TransferWizardPage() {
  const { currentStep, reset } = useTransferStore();

  // Reset the store when the component unmounts
  useEffect(() => {
    return () => {
      reset();
    };
  }, [reset]);

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1Recipient />;
      case 2:
        return <Step2Amount />;
      case 3:
        return <Step3Confirm />;
      case 4:
        return <Step4Result />;
      default:
        return <Step1Recipient />;
    }
  };

  return (
    <main>
      <div className="mx-auto max-w-4xl py-6 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold px-4 mb-6">New Transfer</h2>
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <ProgressIndicator currentStep={currentStep} />
        </div>
        <div className="bg-white rounded-lg shadow p-8">
          {renderStep()}
        </div>
      </div>
    </main>
  );
}

export default TransferWizardPage;