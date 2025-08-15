import { FileText } from "lucide-react"

function FormHeader() {
    return (
        <div className="text-center mb-10">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-100 mb-4">
                Partnership Application
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg">
                Tell us about your organization and how we can collaborate
            </p>
        </div>
    )
}

export default FormHeader
