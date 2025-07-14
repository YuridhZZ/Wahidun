import React from 'react';
import { useActivityLog } from '../hooks/useActivityLog';
import { ClockIcon } from '@heroicons/react/24/outline';

function ActivityLogPage() {
  // The hook now directly provides the correct activities for the logged-in user
  const { activities } = useActivityLog();

  return (
    <main>
      <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold px-4 mb-6">Account Activity Log</h2>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flow-root">
            <ul role="list" className="-mb-8">
              {activities.length > 0 ? (
                activities.map((activity, index) => (
                  // Using a combination of timestamp and index for a more stable key
                  <li key={`${activity.timestamp}-${index}`}>
                    <div className="relative pb-8">
                      {index !== activities.length - 1 ? (
                        <span className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                      ) : null}
                      <div className="relative flex space-x-3">
                        <div>
                          <span className="h-8 w-8 rounded-full bg-gray-400 flex items-center justify-center ring-8 ring-white">
                            <ClockIcon className="h-5 w-5 text-white" aria-hidden="true" />
                          </span>
                        </div>
                        <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                          <div>
                            <p className="text-sm text-gray-700">{activity.action}</p>
                          </div>
                          <div className="whitespace-nowrap text-right text-sm text-gray-500">
                            <time dateTime={activity.timestamp}>
                              {new Date(activity.timestamp).toLocaleString()}
                            </time>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))
              ) : (
                <p className="text-center text-gray-500">No activity recorded for this account.</p>
              )}
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}

export default ActivityLogPage;