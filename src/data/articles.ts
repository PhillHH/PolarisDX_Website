export type ArticleSection = {
  heading?: string
  paragraphs: string[]
  listItems?: string[]
}

export type Article = {
  id: string
  slug: string
  title: string
  category: string
  excerpt: string
  author: string
  date: string
  readTime: string
  sections: ArticleSection[]
}

export const articles: Article[] = [
  {
    id: 'first-checkup',
    slug: 'how-to-prepare-for-your-first-medical-checkup',
    title: 'How to prepare for your first medical check-up',
    category: 'Health Article',
    excerpt:
      'A short guide to help you feel confident and prepared for your very first comprehensive medical examination.',
    author: 'MedHealth Team',
    date: '24 Feb 2025',
    readTime: '7 min read',
    sections: [
      {
        heading: 'Better care starts with being prepared',
        paragraphs: [
          'Sit tincidunt commodo tincidunt. Mattis metus purus quam fames in vitae fringilla tempor. Non in in sodales suspendisse egestas integer iaculis semper ultrices. Lectus dui in pulvinar orci ut fermentum tortor mi, at.',
          "Before your first medical check-up, it's important to collect your medical history, list any current medications, and note symptoms you've experienced recently. This helps your doctor build a complete picture and focus on what matters most to your health.",
        ],
      },
      {
        heading: 'What to bring to your appointment',
        paragraphs: [
          'Arriving prepared saves time and ensures a smoother conversation with your doctor.',
        ],
        listItems: [
          'Identification and insurance information (if applicable).',
          'A list of all medications, including supplements and vitamins.',
          'Previous lab results or reports if you have them.',
          'Questions you want to ask your doctor.',
        ],
      },
      {
        heading: 'During the check-up',
        paragraphs: [
          'Your doctor will usually check your vital signs, discuss your lifestyle, and perform a physical examination. Be honest about your habits and concerns — this is the best way to receive care that truly fits your situation.',
          'Regular check-ups are the foundation of preventative medicine. By catching potential issues early, you give yourself more options, more time, and better outcomes.',
        ],
      },
    ],
  },
  {
    id: 'managing-diabetes',
    slug: 'managing-diabetes-with-daily-routines',
    title: 'Managing diabetes with simple daily routines',
    category: 'Chronic Care',
    excerpt:
      'Discover how small, consistent habits can dramatically improve blood sugar control and overall wellbeing.',
    author: 'Dr. Amelia Carter',
    date: '12 Jan 2025',
    readTime: '8 min read',
    sections: [
      {
        heading: 'Start with your morning routine',
        paragraphs: [
          'A stable morning routine sets the tone for the rest of the day. For people living with diabetes, this is especially important.',
        ],
      },
    ],
  },
  {
    id: 'home-care',
    slug: 'benefits-of-professional-home-care',
    title: 'The benefits of professional home care services',
    category: 'Home Care',
    excerpt:
      'Home care teams can bridge the gap between hospital and everyday life — here is how they support patients and families.',
    author: 'MedHealth Homecare',
    date: '3 Dec 2024',
    readTime: '6 min read',
    sections: [
      {
        heading: 'Care that comes to you',
        paragraphs: [
          'Professional home care services make it easier to recover after surgery or manage chronic conditions without constant hospital visits.',
        ],
      },
    ],
  },
]

export const getArticleBySlug = (slug: string) =>
  articles.find((article) => article.slug === slug)


