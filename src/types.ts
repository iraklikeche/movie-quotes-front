export type User = {
  id: number
  username: string
  profile_image_url: string
}

export type Movie = {
  id: number
  name: {
    en: string
    ka?: string
  }
  year: number
}

export type Comment = {
  id: number
  content: string
  user_id: number
  quote_id: number
  user: User
}

export type Like = {
  id: number
  user_id: number
  quote_id: number
}

export type Quote = {
  id: number
  content: {
    en: string
    ka?: string
  }
  user: User
  movie: Movie
  comments: Comment[]
  likes: Like[]
  image_url: string
  liked_by_user: boolean
  like_count: number
}

export type UserRegistration = {
  email: string
  password: string
  password_confirmation: string
}

export type UserCredentials = {
  email: string
  password: string
  remember?: boolean
}

export type ResetPasswordData = {
  token: string
  email: string
  password: string
  password_confirmation: string
}

export type CheckTokenData = {
  token: string
  email?: string
}

export type UserProfileUpdate = {
  name?: string
  email?: string
}
