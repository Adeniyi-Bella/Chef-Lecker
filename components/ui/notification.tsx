"use client"

import { useEffect, useRef } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { CheckCircle, X, AlertCircle } from "lucide-react"
import { useToastStore } from "@/lib/store"

export function Toast() {
  const { message, variant, visible, closeToast } = useToastStore()
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (visible) {
      timeoutRef.current = setTimeout(() => {
        closeToast()
      }, 10000)
    }
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [visible, closeToast])

  const handleManualClose = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    closeToast()
  }

  const icon =
    variant === "success" ? (
      <CheckCircle className="w-5 h-5 text-white" />
    ) : (
      <AlertCircle className="w-5 h-5 text-white" />
    )

  const bgColor = variant === "success" ? "bg-green-600" : "bg-red-600"

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-md shadow-lg flex items-center gap-4 ${bgColor}`}
        >
          {icon}
          <span className="text-white">{message}</span>
          <button onClick={handleManualClose} className="ml-auto">
            <X className="w-4 h-4 text-white hover:text-gray-300" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
