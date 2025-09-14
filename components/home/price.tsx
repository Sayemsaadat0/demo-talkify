"use client";
import { CANCEL_PLAN_API } from "@/api/api";
import { motion } from "framer-motion";

import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  // DialogTrigger,
} from "@/components/ui/dialog";

import { useEffect, useState } from "react";
import { TICK_ICON } from "@/lib/constant";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { ArrowLeft, ArrowUp, X } from "lucide-react";
import { useGetPlans } from "@/hooks/useGetPlans";

const Price = () => {
  const token = useSelector((state: RootState) => state.auth.token);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [selectedPurchaseId, setSelectedPurchaseId] = useState<number | null>(null);

  const [activeIndex, setActiveIndex] = useState<number>(1);
  const [activeFrequency, setActiveFrequency] = useState<"monthly" | "yearly">("monthly");


  const { data: plans, loading, refetch } = useGetPlans({ by: activeFrequency });
  // console.log(loading)
  // ✅ Fetch on mount & when token changes
  useEffect(() => {
    if (token) {
      refetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, activeFrequency]);

  const handleOpenCancelModal = (purchaseId: number) => {
    setSelectedPurchaseId(purchaseId);
    setCancelModalOpen(true);
  };

  const handleConfirmCancel = async () => {
    if (!selectedPurchaseId) return;

    try {
      const headers: HeadersInit = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      const response = await fetch(CANCEL_PLAN_API, {
        method: "POST",
        headers,
        body: JSON.stringify({ id: selectedPurchaseId }),
      });

      const data = await response.json();

      if (response.ok && data.status) {

        setCancelModalOpen(false);

        // ✅ Refresh plans after cancel
        refetch();
      } else {
        console.error("Failed to cancel plan:", data.message || data);
      }
    } catch (error) {
      console.error("Error cancelling plan:", error);
    }
  };





  return (
    <section className="bg-gray-50 py-16 px-4">
      {/* Header Section */}
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col items-center gap-6 justify-center max-w-xs md:max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-3xl md:text-6xl font-bold text-gray-900">
            Choose Your Perfect Plan
          </h1>
          <p className="text-[#545C66] text-sm md:text-lg leading-relaxed md:my-6 my-2 tracking-wider md:leading-relaxed md:max-w-3xl mx-auto ">
            Our platform brings together all the tools you need to deliver
            exceptional customer experience across every touchpoint.
          </p>
        </div>
        {/* Monthly/Yearly Switch */}
        <div className="flex gap-2 bg-white rounded-full p-1 shadow mb-8 justify-center w-fit mx-auto">
          <button
            className={`px-6 py-2 rounded-full font-semibold text-base transition-all ${activeFrequency === "monthly"
              ? "bg-blue-600 text-white"
              : "text-gray-700"
              }`}
            onClick={() => setActiveFrequency("monthly")}
          >
            Monthly
          </button>
          <button
            className={`px-6 py-2 rounded-full font-semibold text-base transition-all ${activeFrequency === "yearly"
              ? "bg-blue-600 text-white"
              : "text-gray-700"
              }`}
            onClick={() => setActiveFrequency("yearly")}
          >
            Yearly
          </button>
        </div>
      </div>

      {/* Pricing Grid - Full Width Container */}
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading ? (
            Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="rounded-2xl p-8 border shadow-sm bg-white animate-pulse h-[500px]"
              />
            ))
          ) : plans?.length === 0 ? (
            <div className="col-span-4 text-center text-gray-500">
              No plans found.
            </div>
          ) : (
            plans?.map((plan, index) => {
              const isActive = index === activeIndex;
              // Build features from API fields
              const features = [
                `${plan.number_of_property} Indivisual Property`,
                `${plan.per_property_member} Members/Property`,
                `${plan.number_of_visitor.toLocaleString()} Incoming Visitors/Property`,
                `${plan.number_of_kb} Knowledge Base/Property`,
                `${plan.message_store_days} Days Chat Storage`,
              ];
              return (
                <div
                  key={plan.id}
                  className={`relative rounded-2xl p-8 border shadow-sm transition-all duration-300 cursor-pointer ${isActive
                    ? "text-white border-transparent"
                    : "bg-[#FACC151A] border-gray-200"
                    }`}
                  style={
                    isActive
                      ? {
                        background:
                          "linear-gradient(180deg, #113066 30.43%, #143A7B 54.45%, #184592 74.31%, #2260CC 100%)",
                      }
                      : {}
                  }
                  onMouseEnter={() => setActiveIndex(index)}
                  onMouseLeave={() => setActiveIndex(1)}
                >
                  {index === 1 && (
                    <div className="absolute top-0 right-0">
                      <div className="bg-[#FBBF24] text-gray-900 text-sm font-semibold px-4 py-1.5 rounded-tr-2xl rounded-bl-2xl">
                        Recommended
                      </div>
                    </div>
                  )}
                  <div className="mb-4">
                    <h3
                      className={`text-lg font-semibold ${isActive ? "text-white" : "text-gray-900"
                        }`}
                    >
                      {plan.plan_name}
                    </h3>
                  </div>

                  <div className="mb-6">
                    <h2
                      className={`text-4xl font-bold mb-2 ${isActive ? "text-white" : "text-gray-900"
                        }`}
                    >
                      {plan.price === 0 ? "Free" : `$${plan.price}`}
                    </h2>

                    <div className="border-t-2 border-dotted border-gray-400 mb-4"></div>

                    <p
                      className={`text-sm font-medium ${isActive ? "text-gray-200" : "text-gray-700"
                        }`}
                    >
                      {plan.description ||
                        "Perfect for individuals getting started."}
                    </p>
                  </div>

                  <div className="mb-8">
                    <ul className="space-y-3">
                      {features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <div className="flex-shrink-0 mt-1">
                            <Image
                              src={TICK_ICON}
                              alt="checkmark"
                              width={16}
                              height={16}
                              className={`w-4 h-4 ${isActive ? "filter invert brightness-0" : ""
                                }`}
                            />
                          </div>
                          <span
                            className={`text-sm leading-relaxed ${isActive ? "text-gray-200" : "text-gray-700"
                              }`}
                          >
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                                     {/* Pricing Card Buttons */}
                   <div className="mt-4">
                     {plan?.plan_activity?.status === 1 ? (
                       <motion.div
                         className="flex items-center gap-2 "
                         initial={{ opacity: 0, y: 10 }}
                         animate={{ opacity: 1, y: 0 }}
                         transition={{ duration: 0.25 }}
                       >
                         {/* Upgrade */}
                         <motion.button
                           whileHover={{ scale: 1.05 }}
                           whileTap={{ scale: 0.95 }}
                           className={`flex-1 font-semibold py-2 px-2 cursor-pointer rounded-xl border transition-all duration-200 ${isActive
                             ? "bg-gradient-to-r from-blue-50 to-blue-100 text-blue-600 shadow-sm"
                             : "bg-green-600 hover:bg-green-700 text-white"
                             }`}
                         >
                           <ArrowUp className="w-4 h-4 inline-block mr-1" />
                           Upgrade
                         </motion.button>

                         {/* Downgrade */}
                         <motion.button
                           whileHover={{ scale: 1.1 }}
                           whileTap={{ scale: 0.95 }}
                           className="p-2 rounded-xl border border-yellow-500 cursor-pointer bg-yellow-500 hover:bg-yellow-600 text-white"
                         >
                           <ArrowLeft className="-rotate-[90deg]" />
                         </motion.button>

                         {/* Cancel */}
                         <motion.button
                           whileHover={{ scale: 1.1, backgroundColor: "#fee2e2" }}
                           whileTap={{ scale: 0.95 }}
                           className="p-2 rounded-xl border border-red-300 text-red-400 cursor-pointer hover:text-red-600"
                           onClick={() => handleOpenCancelModal(plan.purchase_info.id)}
                         >
                           <X />
                         </motion.button>
                       </motion.div>
                     ) : (
                       <motion.button
                         onClick={() => (window.location.href = `/payment?planId=${plan.id}`)}
                         whileHover={{ scale: 1.03 }}
                         whileTap={{ scale: 0.97 }}
                         disabled={plans?.some(p => p?.plan_activity?.status === 1)}
                         className={`w-full font-semibold py-4 px-6 rounded-xl transition-colors duration-200 shadow-sm ${
                           plans?.some(p => p?.plan_activity?.status === 1)
                             ? "bg-gray-400 text-black cursor-not-allowed opacity-60"
                             : isActive
                             ? "bg-white text-blue-600 border hover:bg-gray-50 cursor-pointer"
                             : "bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                         }`}
                       >
                         Get Subscription
                       </motion.button>
                     )}
                   </div>

                  {/* <p className="w-full text-xs text-black text-left mt-4">
                    VAT is not included, it will be calculated on the checkout
                    screen based on your location
                  </p> */}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Cancel Modal */}
      <Dialog open={cancelModalOpen} onOpenChange={setCancelModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">Cancel Subscription</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this plan? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={() => setCancelModalOpen(false)}
              className="px-4 py-2 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-100 transition"
            >
              Keep Plan
            </button>
            <button
              onClick={handleConfirmCancel}
              className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition"
            >
              Confirm Cancel
            </button>
          </div>
        </DialogContent>
      </Dialog>

    </section>
  );
};

export default Price;
