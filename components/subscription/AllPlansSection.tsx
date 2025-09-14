'use client';
import { Calendar, Package, Crown, Building, Users, Eye, FileText, MessageSquare, DollarSign, ArrowUp, ArrowDown, X } from 'lucide-react';

interface UnlimitedSection {
  property_unlimited: string;
  member_unlimited: string;
  visitor_unlimited: string;
  kb_unlimited: string;
  message_store_unlimited: string;
}

interface PurchaseInfo {
  id: number;
  user_id: number;
  referral_id: string | null;
  plan_id: number;
  currency: string;
  api_subscription_id: string;
  payment_method_id: string | null;
  plan_name: string;
  price: number;
  discount_amount: number;
  discounted_price: number;
  payment_status: number;
  payment_frequency: string;
  number_of_property: number;
  per_property_member: number;
  number_of_visitor: number;
  number_of_kb: number;
  message_store_days: number;
  type: string;
  unlimited_section: UnlimitedSection;
  subs_expired_at: string;
  status: number;
  cancel_at: string;
  created_at: string;
  updated_at: string;
}

interface PlanActivity {
  status: number;
  value: string;
  cancellation: boolean;
  modify_status: boolean;
}

interface Plan {
  id: number;
  plan_name: string;
  plan_icon: string | null;
  payment_frequency: string;
  payment_frequency_count: number;
  subscription_period_count: number;
  price: number;
  number_of_property: number;
  per_property_member: number;
  number_of_visitor: number;
  number_of_kb: number;
  message_store_days: number;
  status: number;
  type: string;
  dodo_product_id: string;
  trail_days: number | null;
  unlimited_section: UnlimitedSection;
  description: string;
  gateway_plan_id: string[];
  created_at: string;
  updated_at: string;
  purchase_status: boolean;
  purchase_info: PurchaseInfo | null;
  plan_activity: PlanActivity;
}

interface AllPlansSectionProps {
  plans: Plan[];
  period: string;
  onPeriodChange: (period: string) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  activePlanFromStored: any;
  onUpgrade: () => void;
  onDowngrade: () => void;
  onCancel: () => void;
}

export default function AllPlansSection({ 
  plans, 
  period, 
  onPeriodChange, 
  activePlanFromStored, 
  onUpgrade, 
  onDowngrade, 
  onCancel 
}: AllPlansSectionProps) {
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const getStatusBadge = (status: number) => {
    switch (status) {
      case 1:
        return { text: 'Active', color: 'bg-green-100 text-green-800', icon: '✓' };
      case 0:
        return { text: 'Inactive', color: 'bg-red-100 text-red-800', icon: '✗' };
      default:
        return { text: 'Unknown', color: 'bg-gray-100 text-gray-800', icon: '?' };
    }
  };

  const getActivityStatus = (plan: Plan) => {
    if (plan.purchase_info) {
      return plan.plan_activity.value;
    }
    return 'Not Purchased';
  };

  return (
    <div className="space-y-6">
      {/* Period Selector */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Calendar className="h-5 w-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">Billing Period</h2>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onPeriodChange('monthly')}
            className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${period === 'monthly'
              ? 'bg-indigo-600 text-white shadow-lg'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
          >
            Monthly
          </button>
          <button
            onClick={() => onPeriodChange('yearly')}
            className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${period === 'yearly'
              ? 'bg-indigo-600 text-white shadow-lg'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
          >
            Yearly
          </button>
        </div>
      </div>

      {/* Plans Table */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">Available Plans</h2>
          <p className="text-gray-600 mt-1">
            Showing {period} plans ({plans?.length || 0} total)
            {activePlanFromStored && (
              <span className="ml-2 text-orange-600 font-medium">
                • You have an active plan - other plans are disabled
              </span>
            )}
          </p>
        </div>

        {plans && plans.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Plan Details
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price & Period
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Limits
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {plans.map((plan: Plan) => {
                  const statusBadge = getStatusBadge(plan.status);
                  const isCurrentActivePlan = activePlanFromStored && plan.id === activePlanFromStored.plan_id;
                  // Disable all plans if user has an active plan but this plan doesn't match
                  const isDisabled = activePlanFromStored && !isCurrentActivePlan;

                  return (
                    <tr key={plan.id} className={`transition-colors ${isCurrentActivePlan
                      ? 'bg-purple-50 border-l-4 border-purple-500'
                      : isDisabled
                        ? 'bg-gray-50 opacity-60'
                        : 'hover:bg-gray-50'
                      }`}>
                      <td className="px-6 py-6">
                        <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-xl ${isCurrentActivePlan
                            ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white'
                            : plan.purchase_status
                              ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white'
                              : 'bg-gray-100 text-gray-600'
                            }`}>
                            {isCurrentActivePlan ? (
                              <Crown className="h-6 w-6" />
                            ) : (
                              <Package className="h-6 w-6" />
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-lg font-semibold text-gray-900">{plan.plan_name}</h3>
                              {isCurrentActivePlan && (
                                <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">
                                  Current Plan
                                </span>
                              )}
                              {plan.purchase_status && !isCurrentActivePlan && (
                                <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">
                                  Purchased
                                </span>
                              )}
                              {plan.type === 'free' && (
                                <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                                  Free
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{plan.description}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              {plan.payment_frequency_count} {plan.payment_frequency} billing
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-gray-400" />
                            <span className="text-lg font-semibold text-gray-900">
                              ${plan.price}
                            </span>
                            <span className="text-sm text-gray-500">/ {plan.payment_frequency}</span>
                          </div>
                          {plan.trail_days && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {plan.trail_days} days trial
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <Building className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-700">
                              {plan.unlimited_section.property_unlimited === 'yes' ? 'Unlimited' : plan.number_of_property} Properties
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Users className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-700">
                              {plan.unlimited_section.member_unlimited === 'yes' ? 'Unlimited' : plan.per_property_member} Members/Property
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Eye className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-700">
                              {plan.unlimited_section.visitor_unlimited === 'yes' ? 'Unlimited' : formatNumber(plan.number_of_visitor)} Visitors
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <FileText className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-700">
                              {plan.unlimited_section.kb_unlimited === 'yes' ? 'Unlimited' : plan.number_of_kb} KB Articles
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <MessageSquare className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-700">
                              {plan.unlimited_section.message_store_unlimited === 'yes' ? 'Unlimited' : plan.message_store_days} Days Storage
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <div className="space-y-2">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusBadge.color}`}>
                            <span className="mr-1">{statusBadge.icon}</span>
                            {statusBadge.text}
                          </span>
                          <div className="text-xs text-gray-500">
                            {getActivityStatus(plan)}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <div className="flex items-center gap-2">
                          {isCurrentActivePlan ? (
                            <div className="flex items-center gap-2">
                              <button
                                onClick={onDowngrade}
                                className="px-3 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors text-sm font-medium flex items-center gap-1"
                              >
                                <ArrowDown className="h-3 w-3" />
                                Downgrade
                              </button>
                              <button
                                onClick={onUpgrade}
                                className="px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm font-medium flex items-center gap-1"
                              >
                                <ArrowUp className="h-3 w-3" />
                                Upgrade
                              </button>
                              <button
                                onClick={onCancel}
                                className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium flex items-center gap-1"
                              >
                                <X className="h-3 w-3" />
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <>
                              {!activePlanFromStored ? (
                                // Show subscription button if no active plan
                                <button
                                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
                                >
                                  Subscribe
                                </button>
                              ) : (
                                // Show disabled button if user has active plan but this plan doesn't match
                                <button
                                  className="px-4 py-2 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed text-sm font-medium"
                                  disabled
                                >
                                  Plan Disabled
                                </button>
                              )}
                              <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium">
                                Details
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center">
            <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Package className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Plans Available</h3>
            <p className="text-gray-600">No subscription plans found for the selected period.</p>
          </div>
        )}
      </div>
    </div>
  );
}
