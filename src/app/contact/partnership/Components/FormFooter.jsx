const CONTACT_EMAIL = 'ieee_sb@green.edu.bd';

function FormFooter() {
    return (
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
            We typically respond to partnership applications within 3-5 business days. For urgent
            inquiries, please contact us directly at{' '}
            <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="text-emerald-600 dark:text-emerald-400 hover:underline"
            >
                {CONTACT_EMAIL}
            </a>
        </p>
    )
}

export default FormFooter
