export class BodyToAddThread {
  type: ThreadType;
  threadTitle: string;
  threadBody: string;
  threadSubject: number;
  userId: number;

  constructor(
    body: {
      type: ThreadType;
      threadTitle: string;
      threadBody: string;
      threadSubject: number;
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

export enum ThreadType {
  article = '아티클',
  teamMate = '팀원모집',
  question = '질문'
}
