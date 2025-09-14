"use client";

import { MAIN_NAV } from "@/lib/constant";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { IoClose } from "react-icons/io5";

interface MobileToggleMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileToggleMenu = ({ isOpen, onClose }: MobileToggleMenuProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={onClose}
          />

          {/* Menu */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed top-0 left-0 h-full w-4/5 max-w-sm bg-white z-50 p-6"
          >
            <div className="flex justify-end mb-8">
              <button onClick={onClose} className="text-3xl text-gray-700">
                <IoClose />
              </button>
            </div>
            <nav className="flex flex-col gap-6">
              {[...MAIN_NAV, {id: 7, label: "Sign Up", href: "/signup"}].map((item) => (
                <Link
                  href={item.href}
                  key={item.id}
                  className="text-xl text-gray-800 hover:text-blue-600 transition-colors"
                  onClick={onClose}
                >
                  {item.label}
                </Link>
              ))}
             
           
            </nav>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileToggleMenu;
