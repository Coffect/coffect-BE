import { Thread_type } from '@prisma/client';

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
  type: Thread_type;
  threadSubject: number[];
  orderBy: 'createdAt' | 'likeCount';
  dateCursor?: Date;

  constructor(
    body: {
      type: Thread_type;
      threadSubject: number[];
      dateCursor?: Date;
      orderBy?: 'createdAt' | 'likeCount';
    }
  ) {
    this.type = body.type;
    this.orderBy = body.orderBy ?? 'createdAt'; // 기본값은 createdAt
    this.threadSubject = body.threadSubject ?? []; // 기본값은 빈 배열
    this.dateCursor = body.dateCursor;
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
  type: string;
  threadTitle: string;
  thradBody: string | null;
  createdAt: Date;
  threadShare: number;
  user: {
    name: string;
    profileImage: string;
    studentId: number | null;
    dept: string | null;
  };
  subjectMatch: {
    threadSubject: {
      subjectName: string;
    }
  }[];
  images: {
    imageId: string;
  }[];
  _count: {
    comments: number;
    likes: number;
  }
}

export class ResponseFromThreadMainToClient {
  threadId: string;
  userId: number;
  type: string;
  threadTitle: string;
  threadBody: string | null;
  createdAt: Date;
  threadShare: number;
  user: {
    name: string;
    profileImage: string;
    studentId: number | null;
    dept: string | null;
  };
  subjects: string[];
  images: string[];
  commentCount: number;
  likeCount: number;

  constructor(body: ResponseFromThreadMain) {
    const { threadId, userId, type, threadTitle, thradBody, createdAt, threadShare, user, subjectMatch, images, _count } = body;

    this.threadId = threadId;
    this.userId = userId;
    this.type = type;
    this.threadTitle = threadTitle;
    this.threadBody = thradBody;
    this.createdAt = createdAt;
    this.threadShare = threadShare;
    this.user = user;
    this.subjects = subjectMatch.map((subjectMatch => {return subjectMatch.threadSubject.subjectName;}));
    this.images = images.map((image => {return image.imageId;}));
    this.commentCount = Number(_count.comments);
    this.likeCount = Number(_count.likes);
  }
}

export interface ResponseFromThreadMainCursor{
  thread: ResponseFromThreadMain[];
  nextCursor: number | Date | null;
}

export interface ResponseFromThreadMainCursorToClient{
  thread: ResponseFromThreadMainToClient[];
  nextCursor: number | Date | null;
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

export const defaultThreadSelect = {
  threadId: true,
  userId: true,
  type: true,
  threadTitle: true,
  thradBody: true,
  createdAt: true,
  threadShare: true,
  user: {
    select: {
      name: true,
      profileImage: true,
      studentId: true,
      dept: true
    }
  },
  subjectMatch: {
    select: {
      threadSubject: {
        select: {
          subjectName: true
        }
      }
    }
  },
  images: {
    select: {
      imageId: true
    }
  },
  _count: {
    select: {
      comments: true,
      likes: true
    }
  }
};

export enum ThreadType {
  article = '아티클',
  teamMate = '팀원모집',
  question = '질문',
  review = '후기글',
  tip = '팁 공유',
  help = '도움 필요'
}