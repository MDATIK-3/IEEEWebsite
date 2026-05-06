'use server';

export async function submitApplicationAction(data) {
  try {
    // Basic server-side validation to ensure required fields are present
    if (!data.name || !data.studentId || !data.cgpa || !data.consent) {
      return { success: false, error: "Please fill out all required fields." };
    }

    // Securely fetch using the hidden URL from your .env.local file
    const response = await fetch(process.env.GAS_WEB_APP_URL, {
      method: "POST",
      body: JSON.stringify(data),
      // no-store ensures Vercel/Next.js doesn't cache the POST request
      cache: 'no-store' 
    });

    const result = await response.json();

    if (result.status === "error") {
      throw new Error(result.message);
    }

    return { success: true };
  } catch (error) {
    console.error('Server submission error:', error);
    return { success: false, error: "Failed to submit application. Please try again later." };
  }
}