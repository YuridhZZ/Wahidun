import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import useFetch from '../hooks/useFetch';

function TransactionPage() {
  const {data,loading,error}=useFetch('https://6870d44c7ca4d06b34b83a49.mockapi.io/api/core/transaction')
  
  return(
    <div className="min-h-full">
      <nav className="bg-gray-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-white font-bold">Transaction</h1>
              </div>
            </div>
            <div className="ml-4 flex items-center md:ml-6">
              <Link to='/dashboard'
                    className="rounded-md bg-gray-700 px-3 py-2 text-sm font-medium text-white hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                    back to home
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main>
        <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="h-96 rounded-lg border-4 border-dashed border-gray-200 p-8">
              <h2 className="text-2xl font-bold mb-4">Welcome, user!</h2>
              <div className="mt-6">
                <p>{data}</p>
                <Link to='/newTransaction'
                    className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mx-2">
                    New Transaction
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
export default TransactionPage;