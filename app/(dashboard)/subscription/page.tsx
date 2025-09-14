/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { useState } from 'react'
import { Package, RefreshCw, AlertCircle } from 'lucide-react'
import { useGetPlans } from '@/hooks/useGetPlans'
import { RootState } from '@/redux/store';
import { useSelector } from 'react-redux';
import CurrentActivePlanSection from '@/components/subscription/CurrentActivePlanSection';
import AllPlansSection from '@/components/subscription/AllPlansSection';

export default function SubscriptionPage() {
  const [period, setPeriod] = useState('monthly');
  const { data: plans, loading, error, refetch } = useGetPlans({ by: period });
  const storedUser = useSelector((state: RootState) => state.auth.user);
  // console.log("storedUser", storedUser)

  const handlePeriodChange = (newPeriod: string) => {
    setPeriod(newPeriod);
  };

  // Get current active plan based on storedUser.active_plan
  const getCurrentActivePlan = () => {
    // First check if storedUser has an active plan with status === 1
    if (!storedUser || !storedUser.active_plan || storedUser.active_plan.status !== 1) {
      return null;
    }

    // If active plan exists, find the matching plan from plans API
    if (!plans) return null;
    
    return plans.find((plan: any) => 
      plan.id === storedUser.active_plan.plan_id
    );
  };

  const currentActivePlan = getCurrentActivePlan();
  // const hasActivePlan = !!currentActivePlan;

  // Get active plan details from stored data (always show if exists)
  const getActivePlanFromStoredData = () => {
    if (!storedUser || !storedUser.active_plan || storedUser.active_plan.status !== 1) {
      return null;
    }
    return storedUser.active_plan;
  };

  const activePlanFromStored = getActivePlanFromStoredData();

  const handleCancelPlan = () => {
    // TODO: Implement cancel plan logic
    console.log('Cancel plan:', currentActivePlan?.id);
  };

  const handleUpgradePlan = () => {
    // TODO: Implement upgrade plan logic
    console.log('Upgrade plan:', currentActivePlan?.id);
  };

  const handleDowngradePlan = () => {
    // TODO: Implement downgrade plan logic
    console.log('Downgrade plan:', currentActivePlan?.id);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="flex flex-col items-center text-gray-600">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-lg font-medium">Loading subscription plans...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4 max-w-md mx-auto text-center">
          <div className="p-4 bg-red-100 rounded-full">
            <AlertCircle className="h-12 w-12 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Error Loading Plans</h2>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => refetch()}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-teal-100 rounded-xl">
                <Package className="h-7 w-7 text-teal-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Subscription Plans</h1>
                <p className="text-gray-600 mt-1">Choose the perfect plan for your business needs</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => refetch()}
                className="p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-xl transition-colors"
                title="Refresh plans"
              >
                <RefreshCw className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Current Active Plan Section */}
        {activePlanFromStored && (
          <CurrentActivePlanSection
            activePlan={activePlanFromStored as any}
            onUpgrade={handleUpgradePlan}
            onDowngrade={handleDowngradePlan}
            onCancel={handleCancelPlan}
          />
        )}

        {/* All Plans Section */}
        <AllPlansSection
          plans={plans || []}
          period={period}
          onPeriodChange={handlePeriodChange}
          activePlanFromStored={activePlanFromStored}
          onUpgrade={handleUpgradePlan}
          onDowngrade={handleDowngradePlan}
          onCancel={handleCancelPlan}
        />
      </div>
    </div>
  );
}
