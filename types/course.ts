export interface Course {
  id: string
  slug: string
  title: string
  description: string

  price?: number
  duration?: string
  hours?: number
  students?: number
  rating?: number

  mode?: string
  startDate?: string

  techStack?: string[]
  highlights?: string[]

  syllabus?: {
    module: string
    title: string
    topics: string[]
  }[]

  projects?: {
    type: "major" | "minor"
    title: string
    tech: string
  }[]

  faqs?: {
    question: string
    answer: string
  }[]

  certificate?: string

  color?: string
  gradientFrom?: string
  gradientTo?: string
}