export interface ContactFormData {
  name: string
  email: string
  message?: string
  company?: string
  phone?: string
  area?: string
  requirements?: string
}

export const sendContactEmail = async (data: ContactFormData): Promise<boolean> => {
  try {
    const response = await fetch('http://localhost:5000/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      console.error('Email sending failed with status:', response.status)
      return false
    }

    const result = await response.json()
    return result.success === true
  } catch (error) {
    console.error('Error sending contact email:', error)
    return false
  }
}
