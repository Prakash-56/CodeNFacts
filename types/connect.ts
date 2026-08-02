// types/connect.ts
import { Timestamp } from "firebase/firestore";

export type UserRole = "student" | "mentor" | "admin";

export interface UserProfile {
  uid: string;
  username: string;
  usernameLower: string;
  displayName: string;
  email: string;
  photoURL: string | null;
  bio: string | null;
  headline: string | null;
  skills: string[];
  role: UserRole;
  track: string | null;
  isMentor: boolean;
  followersCount: number;
  followingCount: number;
  postsCount: number;
  createdAt: Timestamp | null;
  updatedAt: Timestamp | null;
  searchTokens: string[];
}

export type PostType = "text" | "achievement" | "problem" | "pdf" | "voice";

export interface PostAttachment {
  kind: "pdf" | "image" | "audio" | null;
  url: string;
  name: string;
  sizeBytes: number;
  pageCount: number | null;
  durationSeconds: number | null;
}

export interface PostAchievement {
  title: string;
  issuer: string;
  dateIssued: Timestamp | null;
}

export interface Post {
  id: string;
  authorId: string;
  authorName: string;
  authorUsername: string;
  authorPhotoURL: string | null;
  type: PostType;
  content: string;
  mentions: string[];
  tags: string[];
  attachment: PostAttachment | null;
  achievement: PostAchievement | null;
  likeCount: number;
  commentCount: number;
  shareCount: number;
  createdAt: Timestamp | null;
  updatedAt: Timestamp | null;
  visibility: "public" | "followers";
}

export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  authorUsername: string;
  authorPhotoURL: string | null;
  content: string;
  mentions: string[];
  parentCommentId: string | null;
  likeCount: number;
  createdAt: Timestamp | null;
}

export interface Connection {
  followerId: string;
  followingId: string;
  createdAt: Timestamp | null;
}

export interface ConversationParticipant {
  displayName: string;
  username: string;
  photoURL: string | null;
}

export interface Conversation {
  id: string;
  participantIds: string[];
  participants: Record<string, ConversationParticipant>;
  lastMessage: string;
  lastMessageAt: Timestamp | null;
  lastMessageSenderId: string;
  unreadCount: Record<string, number>;
  createdAt: Timestamp | null;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  createdAt: Timestamp | null;
  readBy: string[];
}

export const MAX_PDF_PAGES = 8;