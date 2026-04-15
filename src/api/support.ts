export interface SupportFormData {
  name: string
  email: string
  udi: string
  swVersion: string
  issueType: string
  subject: string
  description: string
  attachment?: {
    filename: string
    content: string // base64
    type: string
  }
}

export const sendSupportEmail = async (data: SupportFormData): Promise<boolean> => {
  try {
    const response = await fetch('/api/support', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      console.error('Support email sending failed with status:', response.status)
      return false
    }

    const result = await response.json()
    return result.success === true
  } catch (error) {
    console.error('Error sending support email:', error)
    return false
  }
}
