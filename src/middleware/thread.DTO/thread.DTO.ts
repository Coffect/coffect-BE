export class BodyToAddThread {
  type: ThreadType;
  threadTitle: string;
  threadBody: string;
  threadSubject: number[];
  userId: number;

  constructor(
    body: {
      type: ThreadType;
      threadTitle: string;
      threadBody: string;
      threadSubject: number[];
    },
    userId: number
  ) {
    this.userId = userId;
    this.type = body.type;
    this.threadTitle = body.threadTitle;
    this.threadBody = body.threadBody;
    this.threadSubject = body.threadSubject;
  }
}

export class BodyToLookUpMainThread {
  type: ThreadType;
  threadSubject?: number[];
  ascend: boolean;
  orderBy: 'createdAt' | 'likeCount';
  cursor: number;

  constructor(
    body: {
      type: ThreadType;
      threadSubject?: number[];
      ascend?: boolean;
      orderBy?: 'createdAt' | 'likeCount';
      cursor?: number;
    }
  ) {
    this.type = body.type;
    this.threadSubject = body.threadSubject;
    this.ascend = body.ascend ?? true; // 기본값은 오름차순
    this.orderBy = body.orderBy ?? 'createdAt'; // 기본값은 createdAt
    this.cursor = body.cursor ?? 0; // 기본값은 0
  }
}

export interface BodyToEditThread{
  threadId: string;
  threadTitle: string;
  threadBody: string;
  type: ThreadType;
  threadSubject: number[];
}

export interface BodyToPostComment {
  threadId: string;
  commentBody: string;
  quote?: number;
}

export class ResponseFromThread {
  type: ThreadType;
  threadTitle: string;
  threadBody: string;
  threadSubject: string;
  userId: number;
  threadId: string;

  constructor(body: {
    type: ThreadType;
    threadTitle: string;
    threadBody: string;
    threadSubject: string;
    userId: number;
    threadId: string;
  }) {
    this.type = body.type;
    this.threadTitle = body.threadTitle;
    this.threadBody = body.threadBody;
    this.threadSubject = body.threadSubject;
    this.userId = body.userId;
    this.threadId = body.threadId;
  }
}

export interface ResponseFromSingleThread {
  threadId: string;
  threadTitle: string;
  thradBody: string | null;
  threadShare: number;
  createdAt: Date;
  type: string;
  user: {
    userId: number;
    name: string;
    profileImage: string;
  };
  subjectMatch: {
    threadSubject: {
      subjectId: number;
      subjectName: string;
    };
  }[];
}

export interface ResponseFromSingleThreadWithLikes {
  result: ResponseFromSingleThread | null;
  likes: number;
}

export interface ResponseFromThreadMain {
  threadId: string;
  userId: number;
  threadTitle: string;
  thradBody: string;
  createdAt: Date;
  threadShare: number;
  name: string;
  profileImage: string;
  likeCount: bigint;
}

export interface ResponseFromThreadMainToClient {
  threadId: string;
  userId: number;
  threadTitle: string;
  thradBody: string;
  createdAt: Date;
  threadShare: number;
  name: string;
  profileImage: string;
  likeCount: number;
}

export interface ResponseFromThreadMainCursor{
  thread: ResponseFromThreadMain[];
  nextCursor: number;
}

export interface ResponseFromThreadMainCursorToClient{
  thread: ResponseFromThreadMainToClient[];
  nextCursor: number;
}

export interface ResponseFromPostComment {
  threadId: string;
  userId: number;
  commentBody: string;
  quote?: number | null;
  createdAtD: Date;
  commentId: number;
}

export interface ResponseFromGetComment {
  commentId: number;
  userId: number;
  threadId: string;
  commentBody: string;
  quote?: number | null;
  createdAtD: Date;
  user: {
    name: string;
    profileImage: string;
    studentId: number | null;
  }
}

export enum ThreadType {
  article = '아티클',
  teamMate = '팀원모집',
  question = '질문'
}

