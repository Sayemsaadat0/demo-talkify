'use client';
import { Crown, Building, Users, Eye, FileText, ArrowUp, ArrowDown, X } from 'lucide-react';

interface UnlimitedSection {
  property_unlimited: string;
  member_unlimited: string;
  visitor_unlimited: string;
  kb_unlimited: string;
  message_store_unlimited: string;
}

interface ActivePlan {
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

interface CurrentActivePlanSectionProps {
  activePlan: ActivePlan;
  onUpgrade: () => void;
  onDowngrade: () => void;
  onCancel: () => void;
}

export default function CurrentActivePlanSection({ 
  activePlan, 
  onUpgrade, 
  onDowngrade, 
  onCancel 
}: CurrentActivePlanSectionProps) {
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  return (
    <div className="bg-gradient-to-bl from-black via-blue-950 to-black rounded-2xl shadow-xl border border-purple-500 p-6 text-white">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
            <Crown className="h-7 w-7 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Current Active Plan</h2>
            <p className="text-purple-100 mt-1">You are currently subscribed to {activePlan.plan_name}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium backdrop-blur-sm">
            Active
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Side - Stats (2 columns) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-2">
                <Building className="h-4 w-4 text-purple-200" />
                <span className="text-sm text-purple-200">Properties</span>
              </div>
              <p className="text-xl font-bold">
                {activePlan.number_of_property || 'Unlimited'}
              </p>
            </div>
            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-4 w-4 text-purple-200" />
                <span className="text-sm text-purple-200">Members</span>
              </div>
              <p className="text-xl font-bold">
                {activePlan.per_property_member || 'Unlimited'}
              </p>
            </div>
            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-2">
                <Eye className="h-4 w-4 text-purple-200" />
                <span className="text-sm text-purple-200">Visitors</span>
              </div>
              <p className="text-xl font-bold">
                {activePlan.number_of_visitor ? formatNumber(activePlan.number_of_visitor) : 'Unlimited'}
              </p>
            </div>
            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="h-4 w-4 text-purple-200" />
                <span className="text-sm text-purple-200">KB Articles</span>
              </div>
              <p className="text-xl font-bold">
                {activePlan.number_of_kb || 'Unlimited'}
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Plan Details (2 columns) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
            <h3 className="text-lg font-semibold mb-3">Plan Details</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-purple-200">Plan Name:</span>
                <span className="font-semibold">{activePlan.plan_name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-purple-200">Billing Cycle:</span>
                <span className="font-semibold">{activePlan.payment_frequency}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-purple-200">Price:</span>
                <span className="font-semibold">${activePlan.price}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-purple-200">Expires:</span>
                <span className="font-semibold">
                  {new Date(activePlan.subs_expired_at).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-purple-200">Message Storage:</span>
                <span className="font-semibold">
                  {activePlan.message_store_days ? `${activePlan.message_store_days} Days` : 'Unlimited'}
                </span>
              </div>
            </div>
          </div>

          <div className='flex justify-end'>
            <div className="flex max-w-md justify-end items-end gap-3">
              <button
                onClick={onUpgrade}
                className="flex-1 px-4 py-2 bg-green-400 text-black rounded-lg hover:bg-white/30 transition-colors font-medium flex items-center justify-center gap-2 backdrop-blur-sm"
              >
                <ArrowUp className="h-4 w-4" />
                Upgrade
              </button>
              <button
                onClick={onDowngrade}
                className="flex-1 px-4 py-2 bg-amber-400 text-black rounded-lg hover:bg-white/30 transition-colors font-medium flex items-center gap-2 backdrop-blur-sm"
              >
                <ArrowDown className="h-4 w-4" />
                Downgrade
              </button>
              <button
                onClick={onCancel}
                className="flex-1 whitespace-nowrap px-4 py-2 bg-red-400/30 rounded-lg hover:bg-red-500/30 transition-colors font-medium flex items-center justify-center gap-2 backdrop-blur-sm"
              >
                <X className="h-4 w-4" />
                Cancel Plan
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
