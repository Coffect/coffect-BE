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

export enum ThreadType {
  article = '아티클',
  teamMate = '팀원모집',
  question = '질문'
}
