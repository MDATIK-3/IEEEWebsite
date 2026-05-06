'use client'
import { createContext, useContext, useState } from 'react'
import { MessageCircle, Rocket } from 'lucide-react'

const ToastContext = createContext()

export const useToast = () => {
    const context = useContext(ToastContext)
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider')
    }
    return context
}

export const ToastProvider = ({ children }) => {
    const [toast, setToast] = useState({ show: false, message: '', type: '' })

    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type })
        setTimeout(() => {
            setToast({ show: false, message: '', type: '' })
        }, 4000)
    }

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            {toast.show && (
                <div
                    className={`fixed top-6 right-6 px-6 py-4 rounded-xl shadow-lg text-white font-medium flex items-center space-x-3 z-50
            ${toast.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'}`}
                    style={{
                        animation: 'slideIn 0.5s ease-out forwards',
                    }}
                >
                    {toast.type === 'success' ? (
                        <Rocket className="w-5 h-5" />
                    ) : (
                        <MessageCircle className="w-5 h-5" />
                    )}
                    <span>{toast.message}</span>
                </div>
            )}
        </ToastContext.Provider>
    )
}