import React from 'react';
import { useTransferStore } from '../../store/transferStore';
import { Link } from 'react-router-dom';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';

function Step4Result() {
  const { status, errorMessage, reset } = useTransferStore();

  return (
    <div className="text-center">
      {status === 'success' ? (
        <div>
          <CheckCircleIcon className="mx-auto h-12 w-12 text-green-500" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">Transfer Successful!</h3>
          <p className="mt-1 text-sm text-gray-500">The money has been sent successfully.</p>
        </div>
      ) : (
        <div>
          <XCircleIcon className="mx-auto h-12 w-12 text-red-500" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">Transfer Failed</h3>
          <p className="mt-1 text-sm text-gray-500">{errorMessage || 'An unknown error occurred.'}</p>
        </div>
      )}

      <div className="mt-6">
        <Link
          to="/dashboard"
          onClick={reset}
          className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}

export default Step4Result;