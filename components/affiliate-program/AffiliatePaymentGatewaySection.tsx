// /* eslint-disable @typescript-eslint/no-unused-vars */
// "use client";

// import React, { useCallback, useState } from "react";
// import { UseGetAffiliateGateway } from "@/hooks/UseGetAffiliateGateway";

// import { Pencil, Trash2 } from "lucide-react";
// import {
//     Dialog,
//     DialogContent,
//     DialogDescription,
//     DialogHeader,
//     DialogTitle,
//     DialogTrigger,
// } from "@/components/ui/dialog";
// import { useSelector } from "react-redux";
// import { RootState } from "@/redux/store";
// import { AFFILIATE_GATEWAY_STORE_API, AFFILIATE_GATEWAY_UPDATE_API, AFFILIATE_GATEWAYS_DELETE_API } from "@/api/api";
// import toast from "react-hot-toast";





// type GatewayData = {
//     bank_name: string;
//     account_holder_name: string;
//     account_number: string;
//     ifsc_code: string;
// };



// interface GateWayFormProps {
//     instance?: GatewayData;
//     id?: number;
//     type?: string;
//     types?: Record<string, string>;  // optional
//     refetch: () => void;
//     open: boolean;
//     setOpen: (open: boolean) => void;

// }

// function GateWayForm({ instance, id, types, refetch, type, open, setOpen }: GateWayFormProps) {
//     const token = useSelector((state: RootState) => state.auth.token);


//     const [form, setForm] = useState({
//         bank_name: instance?.bank_name || "",
//         account_holder_name: instance?.account_holder_name || "",
//         account_number: instance?.account_number || "",
//         ifsc_code: instance?.ifsc_code || "",
//         type: type || "",
//         id: id,

//     });

//     const [errors, setErrors] = useState<Partial<Record<string, string>>>({});
//     const [generalError, setGeneralError] = useState<string | null>(null);
//     const [loading, setLoading] = useState(false);

//     const validateForm = () => {
//         const newErrors: Partial<Record<keyof GatewayData, string>> = {};

//         if (!form.bank_name.trim()) newErrors.bank_name = "Bank name is required.";
//         if (!form.account_holder_name.trim())
//             newErrors.account_holder_name = "Account holder name is required.";
//         if (!form.account_number.trim())
//             newErrors.account_number = "Account number is required.";
//         else if (!/^\d+$/.test(form.account_number))
//             newErrors.account_number = "Account number must be numeric.";
//         if (!form.ifsc_code.trim()) newErrors.ifsc_code = "IFSC code is required.";

//         setErrors(newErrors);
//         return Object.keys(newErrors).length === 0;
//     };

//     const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
//         const { name, value } = e.target;
//         setForm((prev) => ({ ...prev, [name]: value }));
//         setErrors((prev) => ({ ...prev, [name]: "" }));
//     };


//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         setGeneralError(null);

//         if (!validateForm()) return;

//         setLoading(true);
//         try {
//             if (instance) {
//                 // return console.log(form)
//                 const res = await fetch(AFFILIATE_GATEWAY_UPDATE_API, {
//                     method: 'POST',
//                     headers: {
//                         "Content-Type": "application/json",
//                         Authorization: `Bearer ${token}`
//                     },
//                     body: JSON.stringify(form),
//                 });

//                 const data = await res.json();

//                 if (res.ok) {
//                     refetch()
//                     setOpen(!open)
//                     toast.success("Gateway updated successfully!")
//                 } else {
//                     setGeneralError(data?.message || "Failed to connect to server. Please try again.");
//                 }

//             } else {
//                 const res = await fetch(AFFILIATE_GATEWAY_STORE_API, {
//                     method: 'POST',
//                     headers: {
//                         "Content-Type": "application/json",
//                         Authorization: `Bearer ${token}`
//                     },
//                     body: JSON.stringify(form),
//                 });

//                 const data = await res.json();

//                 if (res.ok) {
//                     setOpen(!open)
//                     refetch()
//                     toast.success("Gateway Created successfully!")
//                 } else {
//                     setGeneralError(data?.message || "Failed to connect to server. Please try again.");
//                 }
//             }
//             // eslint-disable-next-line @typescript-eslint/no-explicit-any
//         } catch (err: any) {
//             setGeneralError("Failed to connect to server. Please try again.");
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white rounded-lg shadow max-w-lg">
//             {generalError && (
//                 <div className="p-2 text-sm text-red-600 bg-red-50 rounded">{generalError}</div>
//             )}
//             <div>
//                 <label className="block text-sm font-medium">Gateway Type</label>
//                 <select
//                     name="type"
//                     value={form.type}
//                     onChange={handleChange}
//                     className={`w-full mt-1 border rounded px-3 py-2 ${errors.type ? "border-red-500" : "border-gray-300"
//                         }`}
//                 >
//                     <option value="">Select type</option>
//                     {types &&
//                         Object.entries(types).map(([key, label]) => (
//                             <option key={key} value={key}>
//                                 {label}
//                             </option>
//                         ))}
//                 </select>
//                 {errors.type && <p className="text-red-500 text-sm">{errors.type}</p>}
//             </div>
//             <div>
//                 <label className="block text-sm font-medium">Bank Name</label>
//                 <input
//                     type="text"
//                     name="bank_name"
//                     value={form.bank_name}
//                     onChange={handleChange}
//                     className={`w-full mt-1 border rounded px-3 py-2 ${errors.bank_name ? "border-red-500" : "border-gray-300"
//                         }`}
//                 />
//                 {errors.bank_name && <p className="text-red-500 text-sm">{errors.bank_name}</p>}
//             </div>

//             <div>
//                 <label className="block text-sm font-medium">Account Holder Name</label>
//                 <input
//                     type="text"
//                     name="account_holder_name"
//                     value={form.account_holder_name}
//                     onChange={handleChange}
//                     className={`w-full mt-1 border rounded px-3 py-2 ${errors.account_holder_name ? "border-red-500" : "border-gray-300"
//                         }`}
//                 />
//                 {errors.account_holder_name && (
//                     <p className="text-red-500 text-sm">{errors.account_holder_name}</p>
//                 )}
//             </div>

//             <div>
//                 <label className="block text-sm font-medium">Account Number</label>
//                 <input
//                     type="text"
//                     name="account_number"
//                     value={form.account_number}
//                     onChange={handleChange}
//                     className={`w-full mt-1 border rounded px-3 py-2 ${errors.account_number ? "border-red-500" : "border-gray-300"
//                         }`}
//                 />
//                 {errors.account_number && (
//                     <p className="text-red-500 text-sm">{errors.account_number}</p>
//                 )}
//             </div>

//             <div>
//                 <label className="block text-sm font-medium">IFSC Code</label>
//                 <input
//                     type="text"
//                     name="ifsc_code"
//                     value={form.ifsc_code}
//                     onChange={handleChange}
//                     className={`w-full mt-1 border rounded px-3 py-2 ${errors.ifsc_code ? "border-red-500" : "border-gray-300"
//                         }`}
//                 />
//                 {errors.ifsc_code && <p className="text-red-500 text-sm">{errors.ifsc_code}</p>}
//             </div>

//             <button
//                 type="submit"
//                 disabled={loading}
//                 className={`px-4 py-2 text-white rounded ${loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
//                     }`}
//             >
//                 {loading ? "Saving..." : instance ? "Update Gateway" : "Create Gateway"}
//             </button>
//         </form>
//     );
// }










// // GateWay Action 
// interface GatewayActionsProps {
//     gateway: {
//         id: number;
//         type: string
//         data: {
//             bank_name: string;
//             account_holder_name: string;
//             ifsc_code: string;
//             account_number: string;
//         };
//     };
//     refetch: () => void;
//     types?: Record<string, string>


// }

// const GatewayActions = ({ gateway, refetch, types }: GatewayActionsProps) => {

//     const [deleteOpen, setDeleteOpen] = useState(false);
//     const [open, setOpen] = useState(false);
//     const token = useSelector((state: RootState) => state.auth.token);


//     const handleDelete = useCallback(async () => {
//         setDeleteOpen(false);
//         try {
//             const res = await fetch(
//                 `${AFFILIATE_GATEWAYS_DELETE_API}${gateway.id}`,
//                 {
//                     method: "DELETE",
//                     headers: {
//                         Authorization: `Bearer ${token}`,
//                     },
//                 }
//             );
//             if (res.ok) {
//                 setDeleteOpen(false);
//                 refetch()
//             }

//         } catch (err) {
//             console.error("Failed to fetch commission data:", err);
//         }


//     }, [gateway.id, token, refetch]);

//     return (
//         <div className="flex gap-2">
//             {/* Edit Button */}
//             <Dialog open={open} onOpenChange={setOpen}>

//                 <DialogTrigger asChild>
//                     <button className="p-2 rounded bg-blue-100 hover:bg-blue-200 text-blue-600">
//                         <Pencil size={16} />
//                     </button>
//                 </DialogTrigger>
//                 <DialogContent>
//                     <DialogHeader>
//                         <DialogTitle>Edit Gateway</DialogTitle>
//                         <DialogDescription>
//                             Editing details for <b>{gateway.data.bank_name}</b>
//                         </DialogDescription>
//                     </DialogHeader>
//                     {/* Form fields go here */}
//                     <GateWayForm open={deleteOpen} setOpen={setDeleteOpen} types={types} type={gateway.type} refetch={refetch} id={gateway.id} instance={gateway.data} />




//                 </DialogContent>
//             </Dialog>

//             {/* Delete Button */}
//             <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
//                 <DialogTrigger asChild>
//                     <button className="p-2 rounded bg-red-100 hover:bg-red-200 text-red-600">
//                         <Trash2 size={16} />
//                     </button>
//                 </DialogTrigger>
//                 <DialogContent>
//                     <DialogHeader>
//                         <DialogTitle>Confirm Delete</DialogTitle>
//                         <DialogDescription>
//                             Are you sure you want to delete{" "}
//                             <b>{gateway.data.bank_name}</b>? This action cannot be undone.
//                         </DialogDescription>
//                     </DialogHeader>
//                     <div className="flex justify-end gap-2 mt-4">
//                         <button
//                             onClick={() => setDeleteOpen(false)}
//                             className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
//                         >
//                             Cancel
//                         </button>
//                         <button
//                             onClick={handleDelete}
//                             className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
//                         >
//                             Delete
//                         </button>
//                     </div>
//                 </DialogContent>
//             </Dialog>
//         </div>
//     );
// };





// //default Container
// const AffiliatePaymentGatewaySection = () => {
//     const { data, loading, refetch } = UseGetAffiliateGateway();
//     const [open, setOpen] = useState(false);

//     return (
//         <div className="space-y-5">
//             <div className="flex justify-between items-center">
//                 <p className="text-3xl border-b w-fit border-b-gray-300">Payment Gateways</p>
//                 <div>
//                     <Dialog open={open} onOpenChange={() => setOpen(!open)}>
//                         <DialogTrigger asChild>
//                             <button className="p-2 rounded bg-blue-500 hover:bg-blue-600 text-blue-50">
//                                 Create Gateway
//                             </button>
//                         </DialogTrigger>
//                         <DialogContent>
//                             <DialogHeader>
//                                 <DialogTitle>Edit Gateway</DialogTitle>
//                                 <DialogDescription>

//                                 </DialogDescription>
//                             </DialogHeader>
//                             {/* Form fields go here */}
//                             <GateWayForm open={open} setOpen={setOpen} types={data?.types} refetch={refetch} />

//                         </DialogContent>
//                     </Dialog>
//                 </div>
//             </div>

//             <div className="overflow-x-auto">
//                 <table className="min-w-full bg-white border border-gray-200 rounded-lg">
//                     <thead className="bg-gray-100">
//                         <tr>
//                             <th className="px-2 py-3 text-left text-sm font-semibold text-gray-700 ">
//                                 SL
//                             </th>
//                             <th className="px-2 py-3 text-left text-sm font-semibold text-gray-700 ">
//                                 Bank Name
//                             </th>
//                             <th className="px-2 py-3 text-left text-sm font-semibold text-gray-700 ">
//                                 Account Holder Name
//                             </th>
//                             <th className="px-2 py-3 text-right text-sm font-semibold text-gray-700">Action</th>

//                         </tr>
//                     </thead>
//                     <tbody>
//                         {loading
//                             ? Array.from({ length: 6 }).map((_, i) => (
//                                 <tr key={i} className="animate-pulse">
//                                     <td className="px-2 py-4 ">
//                                         <div className="h-4 bg-gray-200 rounded w-6"></div>
//                                     </td>
//                                     <td className="px-2 py-4 ">
//                                         <div className="h-4 bg-gray-200 rounded w-32"></div>
//                                     </td>
//                                     <td className="px-2 py-4 ">
//                                         <div className="h-4 bg-gray-200 rounded w-40"></div>
//                                     </td>
//                                     <td className="px-2 py-4  flex justify-end">
//                                         <div className="h-4 bg-gray-200 rounded w-40"></div>
//                                     </td>
//                                 </tr>
//                             ))
//                             : data?.gateways?.data?.map((gateway, index) => (
//                                 <tr key={gateway.id}>
//                                     <td className="px-2 py-2 border-b border-b-gray-100 ">{index + 1}</td>
//                                     <td className="px-2 py-2 border-b border-b-gray-100 ">{gateway.data.bank_name}</td>
//                                     <td className="px-2 py-2 border-b border-b-gray-100 ">{gateway.data.account_holder_name}</td>
//                                     <td className="px-2 py-2 border-b border-b-gray-100 flex justify-end">
//                                         <GatewayActions types={data?.types} refetch={refetch} gateway={gateway} />
//                                     </td>
//                                 </tr>
//                             ))}
//                     </tbody>
//                 </table>
//             </div>
//         </div>
//     );
// };

// export default AffiliatePaymentGatewaySection;
const AffiliatePaymentGatewaySection = () => {
  return (
    <div>AffiliatePaymentGatewaySection</div>
  )
}
export default AffiliatePaymentGatewaySection