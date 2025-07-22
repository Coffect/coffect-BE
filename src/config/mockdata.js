// Complete Mock Data for All Tables

// 1. User 테이블 (10개)
const mockUsers = [
  {
    userId: 1,
    id: "user001",
    password: "$2b$10$abcdefghijklmnopqrstuvwxyz123456789",
    mail: "john.kim@university.ac.kr",
    name: "김준호",
    introduce: "프론트엔드 개발자를 꿈꾸는 컴퓨터공학과 3학년입니다.",
    salt: "randomsalt123",
    createdAt: new Date("2024-01-15T09:00:00Z"),
    profileImage: "https://example.com/profiles/user001.jpg",
    questionIndex: JSON.stringify([1, 3, 5, 7]),
    coffeeChatCount: 4,
    todayInterest: 2,
    todayInterestArray: JSON.stringify([1, 3])
  },
  {
    userId: 2,
    id: "user002",
    password: "$2b$10$abcdefghijklmnopqrstuvwxyz123456790",
    mail: "sarah.lee@university.ac.kr",
    name: "이서연",
    introduce: "UX/UI 디자인에 관심이 많은 시각디자인학과 학생입니다.",
    salt: "randomsalt124",
    createdAt: new Date("2024-02-20T14:30:00Z"),
    profileImage: "https://example.com/profiles/user002.jpg",
    questionIndex: JSON.stringify([2, 4, 6]),
    coffeeChatCount: 3,
    todayInterest: 1,
    todayInterestArray: JSON.stringify([2])
  },
  {
    userId: 3,
    id: "user003",
    password: "$2b$10$abcdefghijklmnopqrstuvwxyz123456791",
    mail: "michael.park@university.ac.kr",
    name: "박민수",
    introduce: "스타트업 창업을 준비하는 경영학과 학생입니다.",
    salt: "randomsalt125",
    createdAt: new Date("2024-03-10T11:15:00Z"),
    profileImage: "https://example.com/profiles/user003.jpg",
    questionIndex: JSON.stringify([1, 2, 8]),
    coffeeChatCount: 2,
    todayInterest: 3,
    todayInterestArray: JSON.stringify([1, 4, 7])
  },
  {
    userId: 4,
    id: "user004",
    password: "$2b$10$abcdefghijklmnopqrstuvwxyz123456792",
    mail: "emma.choi@university.ac.kr",
    name: "최예은",
    introduce: "AI와 머신러닝을 공부하는 데이터사이언스학과 학생입니다.",
    salt: "randomsalt126",
    createdAt: new Date("2024-01-25T16:45:00Z"),
    profileImage: "https://example.com/profiles/user004.jpg",
    questionIndex: JSON.stringify([3, 5, 7, 8]),
    coffeeChatCount: 4,
    todayInterest: 2,
    todayInterestArray: JSON.stringify([5, 10])
  },
  {
    userId: 5,
    id: "user005",
    password: "$2b$10$abcdefghijklmnopqrstuvwxyz123456793",
    mail: "david.jung@university.ac.kr",
    name: "정다윗",
    introduce: "풀스택 개발자가 되고 싶은 소프트웨어학과 학생입니다.",
    salt: "randomsalt127",
    createdAt: new Date("2024-04-05T08:20:00Z"),
    profileImage: "https://example.com/profiles/user005.jpg",
    questionIndex: JSON.stringify([1, 4, 6, 8]),
    coffeeChatCount: 3,
    todayInterest: 1,
    todayInterestArray: JSON.stringify([2])
  },
  {
    userId: 6,
    id: "user006",
    password: "$2b$10$abcdefghijklmnopqrstuvwxyz123456794",
    mail: "lisa.han@university.ac.kr",
    name: "한지수",
    introduce: "프로덕트 매니저를 꿈꾸는 산업공학과 학생입니다.",
    salt: "randomsalt128",
    createdAt: new Date("2024-02-14T13:10:00Z"),
    profileImage: "https://example.com/profiles/user006.jpg",
    questionIndex: JSON.stringify([2, 3, 5]),
    coffeeChatCount: 4,
    todayInterest: 2,
    todayInterestArray: JSON.stringify([3, 8])
  },
  {
    userId: 7,
    id: "user007",
    password: "$2b$10$abcdefghijklmnopqrstuvwxyz123456795",
    mail: "alex.yoon@university.ac.kr",
    name: "윤상혁",
    introduce: "백엔드 개발과 인프라에 관심이 많은 컴퓨터공학과 학생입니다.",
    salt: "randomsalt129",
    createdAt: new Date("2024-03-22T10:35:00Z"),
    profileImage: "https://example.com/profiles/user007.jpg",
    questionIndex: JSON.stringify([1, 6, 7]),
    coffeeChatCount: 2,
    todayInterest: 3,
    todayInterestArray: JSON.stringify([2, 5, 12])
  },
  {
    userId: 8,
    id: "user008",
    password: "$2b$10$abcdefghijklmnopqrstuvwxyz123456796",
    mail: "grace.ko@university.ac.kr",
    name: "고은영",
    introduce: "마케팅과 브랜딩에 관심이 많은 광고홍보학과 학생입니다.",
    salt: "randomsalt130",
    createdAt: new Date("2024-01-30T15:50:00Z"),
    profileImage: "https://example.com/profiles/user008.jpg",
    questionIndex: JSON.stringify([4, 5, 8]),
    coffeeChatCount: 3,
    todayInterest: 1,
    todayInterestArray: JSON.stringify([8])
  },
  {
    userId: 9,
    id: "user009",
    password: "$2b$10$abcdefghijklmnopqrstuvwxyz123456797",
    mail: "ryan.lim@university.ac.kr",
    name: "임라이언",
    introduce: "게임 개발자를 목표로 하는 게임학과 학생입니다.",
    salt: "randomsalt131",
    createdAt: new Date("2024-04-12T12:25:00Z"),
    profileImage: "https://example.com/profiles/user009.jpg",
    questionIndex: JSON.stringify([1, 2, 3, 7]),
    coffeeChatCount: 4,
    todayInterest: 2,
    todayInterestArray: JSON.stringify([2, 12])
  },
  {
    userId: 10,
    id: "user010",
    password: "$2b$10$abcdefghijklmnopqrstuvwxyz123456798",
    mail: "sophia.seo@university.ac.kr",
    name: "서소피아",
    introduce: "데이터 분석가가 되고 싶은 통계학과 학생입니다.",
    salt: "randomsalt132",
    createdAt: new Date("2024-03-18T17:40:00Z"),
    profileImage: "https://example.com/profiles/user010.jpg",
    questionIndex: JSON.stringify([3, 4, 6, 8]),
    coffeeChatCount: 3,
    todayInterest: 1,
    todayInterestArray: JSON.stringify([10])
  }
];

// 2. UserTimetable 테이블 (10개)
const mockUserTimetables = [
  { userId: 1, timetable: JSON.stringify({ "월": ["9-10 데이터베이스", "10-12 알고리즘"], "화": ["13-15 웹프로그래밍"] }) },
  { userId: 2, timetable: JSON.stringify({ "월": ["9-12 디자인씽킹"], "수": ["14-16 UX리서치"] }) },
  { userId: 3, timetable: JSON.stringify({ "화": ["10-12 경영전략", "14-16 마케팅"], "목": ["9-11 창업론"] }) },
  { userId: 4, timetable: JSON.stringify({ "월": ["9-12 머신러닝"], "수": ["13-15 데이터마이닝"] }) },
  { userId: 5, timetable: JSON.stringify({ "화": ["9-11 소프트웨어공학"], "목": ["10-12 데이터구조"] }) },
  { userId: 6, timetable: JSON.stringify({ "월": ["13-15 산업공학개론"], "금": ["9-11 품질관리"] }) },
  { userId: 7, timetable: JSON.stringify({ "수": ["9-12 네트워크프로그래밍"], "금": ["14-16 시스템프로그래밍"] }) },
  { userId: 8, timetable: JSON.stringify({ "화": ["10-12 광고기획"], "목": ["13-15 브랜드관리"] }) },
  { userId: 9, timetable: JSON.stringify({ "월": ["14-16 게임프로그래밍"], "수": ["9-11 게임기획"] }) },
  { userId: 10, timetable: JSON.stringify({ "화": ["9-11 통계학"], "목": ["10-12 빅데이터분석"] }) }
];

// 3. Category 테이블 (16개 - CategoryEnum 전체)
const mockCategories = [
  { categotyId: 1, categoryName: "창업", categoryColor: "#FF6B6B" },
  { categotyId: 2, categoryName: "개발", categoryColor: "#4ECDC4" },
  { categotyId: 3, categoryName: "디자인", categoryColor: "#45B7D1" },
  { categotyId: 4, categoryName: "기획", categoryColor: "#96CEB4" },
  { categotyId: 5, categoryName: "AI", categoryColor: "#FECA57" },
  { categotyId: 6, categoryName: "글쓰기", categoryColor: "#FF9FF3" },
  { categotyId: 7, categoryName: "독서", categoryColor: "#54A0FF" },
  { categotyId: 8, categoryName: "마케팅", categoryColor: "#5F27CD" },
  { categotyId: 9, categoryName: "여행", categoryColor: "#00D2D3" },
  { categotyId: 10, categoryName: "데이터", categoryColor: "#FF6348" },
  { categotyId: 11, categoryName: "분석", categoryColor: "#2ED573" },
  { categotyId: 12, categoryName: "하드웨어", categoryColor: "#747D8C" },
  { categotyId: 13, categoryName: "영화", categoryColor: "#FFA502" },
  { categotyId: 14, categoryName: "외국어", categoryColor: "#3742FA" },
  { categotyId: 15, categoryName: "악기", categoryColor: "#E056FD" },
  { categotyId: 16, categoryName: "네트워킹", categoryColor: "#26DE81" }
];

// 4. ThreadSubject 테이블 (8개 - SubjectEnum 전체)
const mockThreadSubjects = [
  { subjectId: 1, subjectName: "프로덕트" },
  { subjectId: 2, subjectName: "개발" },
  { subjectId: 3, subjectName: "디자인" },
  { subjectId: 4, subjectName: "기획" },
  { subjectId: 5, subjectName: "인사이트" },
  { subjectId: 6, subjectName: "취업" },
  { subjectId: 7, subjectName: "창업" },
  { subjectId: 8, subjectName: "학교" }
];

// 5. CategoryMatch 테이블 (10개)
const mockCategoryMatches = [
  { userId: 1, categotyId: 2, createdAt: new Date("2024-01-15T09:00:00Z") },
  { userId: 2, categotyId: 3, createdAt: new Date("2024-02-20T14:30:00Z") },
  { userId: 3, categotyId: 1, createdAt: new Date("2024-03-10T11:15:00Z") },
  { userId: 4, categotyId: 5, createdAt: new Date("2024-01-25T16:45:00Z") },
  { userId: 5, categotyId: 2, createdAt: new Date("2024-04-05T08:20:00Z") },
  { userId: 6, categotyId: 4, createdAt: new Date("2024-02-14T13:10:00Z") },
  { userId: 7, categotyId: 2, createdAt: new Date("2024-03-22T10:35:00Z") },
  { userId: 8, categotyId: 8, createdAt: new Date("2024-01-30T15:50:00Z") },
  { userId: 9, categotyId: 2, createdAt: new Date("2024-04-12T12:25:00Z") },
  { userId: 10, categotyId: 10, createdAt: new Date("2024-03-18T17:40:00Z") }
];

// 6. Thread 테이블 (10개)
const mockThreads = [
  {
    threadId: "thread-001-uuid-abcd",
    userId: 1,
    type: "아티클",
    threadTitle: "React Hook의 효과적인 사용 방법",
    thradBody: "React Hook을 처음 배울 때 알았으면 좋았을 것들에 대해 정리해보았습니다.",
    createdAt: new Date("2024-07-15T09:30:00Z"),
    threadShare: 25
  },
  {
    threadId: "thread-002-uuid-efgh",
    userId: 2,
    type: "아티클",
    threadTitle: "2024년 UX 디자인 트렌드",
    thradBody: "올해 주목받고 있는 UX 디자인 트렌드들을 분석해보았습니다.",
    createdAt: new Date("2024-07-14T14:20:00Z"),
    threadShare: 18
  },
  {
    threadId: "thread-003-uuid-ijkl",
    userId: 3,
    type: "팀원모집",
    threadTitle: "스타트업 팀원 모집 - AI 기반 학습 플랫폼",
    thradBody: "AI를 활용한 개인 맞춤형 학습 플랫폼을 개발할 팀원을 모집합니다.",
    createdAt: new Date("2024-07-13T11:45:00Z"),
    threadShare: 42
  },
  {
    threadId: "thread-004-uuid-mnop",
    userId: 4,
    type: "아티클",
    threadTitle: "머신러닝 입문자를 위한 Python 라이브러리 가이드",
    thradBody: "머신러닝을 시작하는 분들을 위해 꼭 알아야 할 Python 라이브러리들을 정리했습니다.",
    createdAt: new Date("2024-07-12T16:10:00Z"),
    threadShare: 33
  },
  {
    threadId: "thread-005-uuid-qrst",
    userId: 5,
    type: "질문",
    threadTitle: "Node.js vs Spring Boot 백엔드 선택 기준",
    thradBody: "토이 프로젝트를 진행하면서 백엔드 프레임워크 선택에 고민이 많습니다.",
    createdAt: new Date("2024-07-11T10:25:00Z"),
    threadShare: 15
  },
  {
    threadId: "thread-006-uuid-uvwx",
    userId: 6,
    type: "아티클",
    threadTitle: "성공적인 프로덕트 런칭을 위한 체크리스트",
    thradBody: "프로덕트 매니저로서 여러 런칭 경험을 바탕으로 성공적인 제품 출시를 위한 단계별 체크리스트를 정리해보았습니다.",
    createdAt: new Date("2024-07-10T13:50:00Z"),
    threadShare: 28
  },
  {
    threadId: "thread-007-uuid-yzab",
    userId: 7,
    type: "아티클",
    threadTitle: "Docker와 Kubernetes로 배우는 컨테이너 오케스트레이션",
    thradBody: "컨테이너 기술의 기초부터 실제 운영 환경에서의 활용까지 설명합니다.",
    createdAt: new Date("2024-07-09T08:15:00Z"),
    threadShare: 37
  },
  {
    threadId: "thread-008-uuid-cdef",
    userId: 8,
    type: "팀원모집",
    threadTitle: "대학생 창업 경진대회 팀원 모집",
    thradBody: "다가오는 대학생 창업 경진대회에 참가할 팀원을 모집합니다.",
    createdAt: new Date("2024-07-08T15:30:00Z"),
    threadShare: 52
  },
  {
    threadId: "thread-009-uuid-ghij",
    userId: 9,
    type: "질문",
    threadTitle: "Unity vs Unreal Engine 게임 개발 도구 비교",
    thradBody: "인디 게임 개발을 시작하려고 하는데, Unity와 Unreal Engine 중 어떤 것을 선택해야 할지 고민입니다.",
    createdAt: new Date("2024-07-07T12:05:00Z"),
    threadShare: 21
  },
  {
    threadId: "thread-010-uuid-klmn",
    userId: 10,
    type: "아티클",
    threadTitle: "데이터 분석을 위한 SQL 쿼리 최적화 팁",
    thradBody: "대용량 데이터 분석 시 자주 사용하는 SQL 쿼리 최적화 기법들을 정리했습니다.",
    createdAt: new Date("2024-07-06T14:40:00Z"),
    threadShare: 29
  }
];

// 7. SubjectMatch 테이블 (10개)
const mockSubjectMatches = [
  { threadId: "thread-001-uuid-abcd", subjectId: 2 },
  { threadId: "thread-002-uuid-efgh", subjectId: 3 },
  { threadId: "thread-003-uuid-ijkl", subjectId: 7 },
  { threadId: "thread-004-uuid-mnop", subjectId: 2 },
  { threadId: "thread-005-uuid-qrst", subjectId: 2 },
  { threadId: "thread-006-uuid-uvwx", subjectId: 1 },
  { threadId: "thread-007-uuid-yzab", subjectId: 2 },
  { threadId: "thread-008-uuid-cdef", subjectId: 7 },
  { threadId: "thread-009-uuid-ghij", subjectId: 2 },
  { threadId: "thread-010-uuid-klmn", subjectId: 2 }
];

// 8. ThreadImage 테이블 (10개)
const mockThreadImages = [
  { imageId: "img-001-uuid", threadId: "thread-001-uuid-abcd" },
  { imageId: "img-002-uuid", threadId: "thread-002-uuid-efgh" },
  { imageId: "img-003-uuid", threadId: "thread-003-uuid-ijkl" },
  { imageId: "img-004-uuid", threadId: "thread-004-uuid-mnop" },
  { imageId: "img-005-uuid", threadId: "thread-005-uuid-qrst" },
  { imageId: "img-006-uuid", threadId: "thread-006-uuid-uvwx" },
  { imageId: "img-007-uuid", threadId: "thread-007-uuid-yzab" },
  { imageId: "img-008-uuid", threadId: "thread-008-uuid-cdef" },
  { imageId: "img-009-uuid", threadId: "thread-009-uuid-ghij" },
  { imageId: "img-010-uuid", threadId: "thread-010-uuid-klmn" }
];

// 9. ThreadLike 테이블 (10개)
const mockThreadLikes = [
  { threadId: "thread-001-uuid-abcd", userId: 2 },
  { threadId: "thread-001-uuid-abcd", userId: 3 },
  { threadId: "thread-002-uuid-efgh", userId: 1 },
  { threadId: "thread-003-uuid-ijkl", userId: 4 },
  { threadId: "thread-004-uuid-mnop", userId: 5 },
  { threadId: "thread-005-uuid-qrst", userId: 6 },
  { threadId: "thread-006-uuid-uvwx", userId: 7 },
  { threadId: "thread-007-uuid-yzab", userId: 8 },
  { threadId: "thread-008-uuid-cdef", userId: 9 },
  { threadId: "thread-009-uuid-ghij", userId: 10 }
];

// 10. ThreadScrap 테이블 (10개)
const mockThreadScraps = [
  { scrapId: "scrap-001-uuid", userId: 1, createdAt: new Date("2024-07-15T10:00:00Z") },
  { scrapId: "scrap-002-uuid", userId: 2, createdAt: new Date("2024-07-14T15:00:00Z") },
  { scrapId: "scrap-003-uuid", userId: 3, createdAt: new Date("2024-07-13T12:00:00Z") },
  { scrapId: "scrap-004-uuid", userId: 4, createdAt: new Date("2024-07-12T17:00:00Z") },
  { scrapId: "scrap-005-uuid", userId: 5, createdAt: new Date("2024-07-11T11:00:00Z") },
  { scrapId: "scrap-006-uuid", userId: 6, createdAt: new Date("2024-07-10T14:00:00Z") },
  { scrapId: "scrap-007-uuid", userId: 7, createdAt: new Date("2024-07-09T09:00:00Z") },
  { scrapId: "scrap-008-uuid", userId: 8, createdAt: new Date("2024-07-08T16:00:00Z") },
  { scrapId: "scrap-009-uuid", userId: 9, createdAt: new Date("2024-07-07T13:00:00Z") },
  { scrapId: "scrap-010-uuid", userId: 10, createdAt: new Date("2024-07-06T15:00:00Z") }
];

// 11. ScrapMatch 테이블 (10개)
const mockScrapMatches = [
  { threadId: "thread-002-uuid-efgh", scrapId: "scrap-001-uuid" },
  { threadId: "thread-003-uuid-ijkl", scrapId: "scrap-002-uuid" },
  { threadId: "thread-004-uuid-mnop", scrapId: "scrap-003-uuid" },
  { threadId: "thread-005-uuid-qrst", scrapId: "scrap-004-uuid" },
  { threadId: "thread-006-uuid-uvwx", scrapId: "scrap-005-uuid" },
  { threadId: "thread-007-uuid-yzab", scrapId: "scrap-006-uuid" },
  { threadId: "thread-008-uuid-cdef", scrapId: "scrap-007-uuid" },
  { threadId: "thread-009-uuid-ghij", scrapId: "scrap-008-uuid" },
  { threadId: "thread-010-uuid-klmn", scrapId: "scrap-009-uuid" },
  { threadId: "thread-001-uuid-abcd", scrapId: "scrap-010-uuid" }
];

// 12. Comment 테이블 (10개)
const mockComments = [
  {
    commentId: 1,
    userId: 2,
    threadId: "thread-001-uuid-abcd",
    commentBody: "정말 유용한 정보네요! 특히 useEffect 부분이 도움이 많이 되었습니다.",
    quote: null,
    createdAtD: new Date("2024-07-15T10:30:00Z")
  },
  {
    commentId: 2,
    userId: 3,
    threadId: "thread-001-uuid-abcd",
    commentBody: "커스텀 훅 예제도 추가해주시면 좋을 것 같아요!",
    quote: 1,
    createdAtD: new Date("2024-07-15T11:00:00Z")
  },
  {
    commentId: 3,
    userId: 1,
    threadId: "thread-002-uuid-efgh",
    commentBody: "다크모드 트렌드에 대한 분석이 인상적이었습니다.",
    quote: null,
    createdAtD: new Date("2024-07-14T15:30:00Z")
  },
  {
    commentId: 4,
    userId: 4,
    threadId: "thread-003-uuid-ijkl",
    commentBody: "AI 분야에 관심이 있습니다. 참여하고 싶어요!",
    quote: null,
    createdAtD: new Date("2024-07-13T12:30:00Z")
  },
  {
    commentId: 5,
    userId: 5,
    threadId: "thread-004-uuid-mnop",
    commentBody: "scikit-learn 설명이 정말 자세하네요. 감사합니다!",
    quote: null,
    createdAtD: new Date("2024-07-12T17:30:00Z")
  },
  {
    commentId: 6,
    userId: 6,
    threadId: "thread-005-uuid-qrst",
    commentBody: "저는 Node.js를 추천합니다. 학습 곡선이 더 완만해요.",
    quote: null,
    createdAtD: new Date("2024-07-11T11:30:00Z")
  },
  {
    commentId: 7,
    userId: 7,
    threadId: "thread-006-uuid-uvwx",
    commentBody: "체크리스트 정말 실용적이네요. 바로 적용해볼게요!",
    quote: null,
    createdAtD: new Date("2024-07-10T14:30:00Z")
  },
  {
    commentId: 8,
    userId: 8,
    threadId: "thread-007-uuid-yzab",
    commentBody: "도커 개념이 헷갈렸는데 이해가 쏙쏙 되네요.",
    quote: null,
    createdAtD: new Date("2024-07-09T09:30:00Z")
  },
  {
    commentId: 9,
    userId: 9,
    threadId: "thread-008-uuid-cdef",
    commentBody: "마케팅 쪽으로 도움을 드릴 수 있을 것 같습니다!",
    quote: null,
    createdAtD: new Date("2024-07-08T16:30:00Z")
  },
  {
    commentId: 10,
    userId: 10,
    threadId: "thread-009-uuid-ghij",
    commentBody: "Unity가 초보자에게는 더 친화적인 것 같아요.",
    quote: null,
    createdAtD: new Date("2024-07-07T13:30:00Z")
  }
];

// 13. Follow 테이블 (10개)
const mockFollows = [
  { userId: 1, followingId: 2, followerId: 1 },
  { userId: 2, followingId: 3, followerId: 2 },
  { userId: 3, followingId: 4, followerId: 3 },
  { userId: 4, followingId: 5, followerId: 4 },
  { userId: 5, followingId: 6, followerId: 5 },
  { userId: 6, followingId: 7, followerId: 6 },
  { userId: 7, followingId: 8, followerId: 7 },
  { userId: 8, followingId: 9, followerId: 8 },
  { userId: 9, followingId: 10, followerId: 9 },
  { userId: 10, followingId: 1, followerId: 10 }
];

// 14. ChatRoom 테이블 (10개)
const mockChatRooms = [
  { chatRoomId: 1, createdAt: new Date("2024-07-15T09:00:00Z"), createdTime: new Date("2024-07-15T09:00:00Z") },
  { chatRoomId: 2, createdAt: new Date("2024-07-14T10:00:00Z"), createdTime: new Date("2024-07-14T10:00:00Z") },
  { chatRoomId: 3, createdAt: new Date("2024-07-13T11:00:00Z"), createdTime: new Date("2024-07-13T11:00:00Z") },
  { chatRoomId: 4, createdAt: new Date("2024-07-12T12:00:00Z"), createdTime: new Date("2024-07-12T12:00:00Z") },
  { chatRoomId: 5, createdAt: new Date("2024-07-11T13:00:00Z"), createdTime: new Date("2024-07-11T13:00:00Z") },
  { chatRoomId: 6, createdAt: new Date("2024-07-10T14:00:00Z"), createdTime: new Date("2024-07-10T14:00:00Z") },
  { chatRoomId: 7, createdAt: new Date("2024-07-09T15:00:00Z"), createdTime: new Date("2024-07-09T15:00:00Z") },
  { chatRoomId: 8, createdAt: new Date("2024-07-08T16:00:00Z"), createdTime: new Date("2024-07-08T16:00:00Z") },
  { chatRoomId: 9, createdAt: new Date("2024-07-07T17:00:00Z"), createdTime: new Date("2024-07-07T17:00:00Z") },
  { chatRoomId: 10, createdAt: new Date("2024-07-06T18:00:00Z"), createdTime: new Date("2024-07-06T18:00:00Z") }
];

// 15. ChatJoin 테이블 (10개)
const mockChatJoins = [
  { userId: 1, chatRoomId: 1 },
  { userId: 2, chatRoomId: 1 },
  { userId: 3, chatRoomId: 2 },
  { userId: 4, chatRoomId: 2 },
  { userId: 5, chatRoomId: 3 },
  { userId: 6, chatRoomId: 3 },
  { userId: 7, chatRoomId: 4 },
  { userId: 8, chatRoomId: 4 },
  { userId: 9, chatRoomId: 5 },
  { userId: 10, chatRoomId: 5 }
];

// 16. Message 테이블 (10개)
const mockMessages = [
  {
    messageId: 1,
    chatRoomId: 1,
    userId: 1,
    messageBody: "안녕하세요! React 관련해서 질문이 있어서 연락드렸어요.",
    createdAt: new Date("2024-07-15T09:30:00Z"),
    check: false
  },
  {
    messageId: 2,
    chatRoomId: 1,
    userId: 2,
    messageBody: "네, 안녕하세요! 어떤 부분이 궁금하신가요?",
    createdAt: new Date("2024-07-15T09:35:00Z"),
    check: true
  },
  {
    messageId: 3,
    chatRoomId: 2,
    userId: 3,
    messageBody: "스타트업 팀원 모집 관련해서 문의드립니다.",
    createdAt: new Date("2024-07-13T12:00:00Z"),
    check: false
  },
  {
    messageId: 4,
    chatRoomId: 2,
    userId: 4,
    messageBody: "네, 어떤 역할에 관심이 있으신가요?",
    createdAt: new Date("2024-07-13T12:05:00Z"),
    check: true
  },
  {
    messageId: 5,
    chatRoomId: 3,
    userId: 5,
    messageBody: "백엔드 기술 스택 관련해서 조언 부탁드려요.",
    createdAt: new Date("2024-07-11T11:00:00Z"),
    check: false
  },
  {
    messageId: 6,
    chatRoomId: 3,
    userId: 6,
    messageBody: "어떤 프로젝트를 진행하시나요?",
    createdAt: new Date("2024-07-11T11:10:00Z"),
    check: true
  },
  {
    messageId: 7,
    chatRoomId: 4,
    userId: 7,
    messageBody: "인프라 구축에 대해 궁금한 점이 있어요.",
    createdAt: new Date("2024-07-09T09:00:00Z"),
    check: false
  },
  {
    messageId: 8,
    chatRoomId: 4,
    userId: 8,
    messageBody: "구체적으로 어떤 부분인가요?",
    createdAt: new Date("2024-07-09T09:15:00Z"),
    check: true
  },
  {
    messageId: 9,
    chatRoomId: 5,
    userId: 9,
    messageBody: "게임 개발 관련해서 멘토링 받을 수 있을까요?",
    createdAt: new Date("2024-07-07T13:00:00Z"),
    check: false
  },
  {
    messageId: 10,
    chatRoomId: 5,
    userId: 10,
    messageBody: "물론입니다! 언제 시간 되시나요?",
    createdAt: new Date("2024-07-07T13:20:00Z"),
    check: true
  }
];

// 17. RefeshToken 테이블 (10개)
// const mockRefreshTokens = [
//   {
//     refreshTokenIndex: 1,
//     userId: 1,
//     userName: "김준호",
//     tokenHashed: "$2a$10$abcdefghijklmnopqrstuvwxyz1234567890abcdef",
//     createdAt: new Date("2024-07-15T09:00:00Z"),
//     expiredAt: new Date("2024-08-15T09:00:00Z"),
//     userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
//   },
//   {
//     refreshTokenIndex: 2,
//     userId: 2,
//     userName: "이서연",
//     tokenHashed: "$2a$10$bcdefghijklmnopqrstuvwxyz1234567890abcdef1",
//     createdAt: new Date("2024-07-14T10:00:00Z"),
//     expiredAt: new Date("2024-08-14T10:00:00Z"),
//     userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"
//   },
//   {
//     refreshTokenIndex: 3,
//     userId: 3,
//     userName: "박민수",
//     tokenHashed: "$2a$10$cdefghijklmnopqrstuvwxyz1234567890abcdef12",
//     createdAt: new Date("2024-07-13T11:00:00Z"),
//     expiredAt: new Date("2024-08-13T11:00:00Z"),
//     userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15"
//   },
//   {
//     refreshTokenIndex: 4,
//     userId: 4,
//     userName: "최예은",
//     tokenHashed: "$2a$10$defghijklmnopqrstuvwxyz1234567890abcdef123",
//     createdAt: new Date("2024-07-12T12:00:00Z"),
//     expiredAt: new Date("2024-08-12T12:00:00Z"),
//     userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
//   },
//   {
//     refreshTokenIndex: 5,
//     userId: 5,
//     userName: "정다윗",
//     tokenHashed: "$2a$10$efghijklmnopqrstuvwxyz1234567890abcdef1234",
//     createdAt: new Date("2024-07-11T13:00:00Z"),
//     expiredAt: new Date("2024-08-11T13:00:00Z"),
//     userAgent: "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36"
//   },
//   {
//     refreshTokenIndex: 6,
//     userId: 6,
//     userName: "한지수",
//     tokenHashed: "$2a$10$fghijklmnopqrstuvwxyz1234567890abcdef12345",
//     createdAt: new Date("2024-07-10T14:00:00Z"),
//     expiredAt: new Date("2024-08-10T14:00:00Z"),
//     userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"
//   },
//   {
//     refreshTokenIndex: 7,
//     userId: 7,
//     userName: "윤상혁",
//     tokenHashed: "$2a$10$ghijklmnopqrstuvwxyz1234567890abcdef123456",
//     createdAt: new Date("2024-07-09T15:00:00Z"),
//     expiredAt: new Date("2024-08-09T15:00:00Z"),
//     userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
//   },
//   {
//     refreshTokenIndex: 8,
//     userId: 8,
//     userName: "고은영",
//     tokenHashed: "$2a$10$hijklmnopqrstuvwxyz1234567890abcdef1234567",
//     createdAt: new Date("2024-07-08T16:00:00Z"),
//     expiredAt: new Date("2024-08-08T16:00:00Z"),
//     userAgent: "Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605.1.15"
//   },
//   {
//     refreshTokenIndex: 9,
//     userId: 9,
//     userName: "임라이언",
//     tokenHashed: "$2a$10$ijklmnopqrstuvwxyz1234567890abcdef12345678",
//     createdAt: new Date("2024-07-07T17:00:00Z"),
//     expiredAt: new Date("2024-08-07T17:00:00Z"),
//     userAgent: "Mozilla/5.0 (Android 13; Mobile; rv:109.0) Gecko/111.0 Firefox/111.0"
//   },
//   {
//     refreshTokenIndex: 10,
//     userId: 10,
//     userName: "서소피아",
//     tokenHashed: "$2a$10$jklmnopqrstuvwxyz1234567890abcdef123456789",
//     createdAt: new Date("2024-07-06T18:00:00Z"),
//     expiredAt: new Date("2024-08-06T18:00:00Z"),
//     userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
//   }
// ];

// 18. CoffeeChat 테이블 (10개)
const mockCoffeeChats = [
  {
    coffectId: 1,
    firstUserId: 1,
    secondUserId: 2,
    coffectDate: new Date("2024-07-20T14:00:00Z"),
    location: "스타벅스 강남점",
    message: "React에 대해서 이야기해요!",
    createdAt: new Date("2024-07-15T10:00:00Z"),
    valid: true
  },
  {
    coffectId: 2,
    firstUserId: 3,
    secondUserId: 4,
    coffectDate: new Date("2024-07-21T15:00:00Z"),
    location: "카페 베네 홍대점",
    message: "AI 스타트업 관련해서 논의해요.",
    createdAt: new Date("2024-07-13T13:00:00Z"),
    valid: true
  },
  {
    coffectId: 3,
    firstUserId: 5,
    secondUserId: 6,
    coffectDate: new Date("2024-07-22T16:00:00Z"),
    location: "투썸플레이스 신촌점",
    message: "백엔드 기술 스택에 대해 조언 부탁드려요.",
    createdAt: new Date("2024-07-11T12:00:00Z"),
    valid: false
  },
  {
    coffectId: 4,
    firstUserId: 7,
    secondUserId: 8,
    coffectDate: new Date("2024-07-23T10:00:00Z"),
    location: "이디야커피 종로점",
    message: "인프라와 마케팅의 만남!",
    createdAt: new Date("2024-07-09T10:00:00Z"),
    valid: true
  },
  {
    coffectId: 5,
    firstUserId: 9,
    secondUserId: 10,
    coffectDate: new Date("2024-07-24T13:00:00Z"),
    location: "컴포즈커피 건대점",
    message: "게임 개발과 데이터 분석의 접점을 찾아봐요.",
    createdAt: new Date("2024-07-07T14:00:00Z"),
    valid: true
  },
  {
    coffectId: 6,
    firstUserId: 2,
    secondUserId: 3,
    coffectDate: new Date("2024-07-25T11:00:00Z"),
    location: "할리스커피 강남역점",
    message: "디자인과 창업 아이디어 공유해요.",
    createdAt: new Date("2024-07-14T15:00:00Z"),
    valid: false
  },
  {
    coffectId: 7,
    firstUserId: 4,
    secondUserId: 5,
    coffectDate: new Date("2024-07-26T14:30:00Z"),
    location: "메가커피 서울대입구점",
    message: "AI와 풀스택 개발 트렌드를 논의해요.",
    createdAt: new Date("2024-07-12T17:00:00Z"),
    valid: true
  },
  {
    coffectId: 8,
    firstUserId: 6,
    secondUserId: 7,
    coffectDate: new Date("2024-07-27T15:30:00Z"),
    location: "파스쿠찌 잠실점",
    message: "프로덕트 매니지먼트와 인프라 연동.",
    createdAt: new Date("2024-07-10T14:30:00Z"),
    valid: true
  },
  {
    coffectId: 9,
    firstUserId: 8,
    secondUserId: 9,
    coffectDate: new Date("2024-07-28T12:00:00Z"),
    location: "엔제리너스 이대점",
    message: "마케팅 관점에서 본 게임 산업.",
    createdAt: new Date("2024-07-08T16:30:00Z"),
    valid: false
  },
  {
    coffectId: 10,
    firstUserId: 10,
    secondUserId: 1,
    coffectDate: new Date("2024-07-29T16:00:00Z"),
    location: "빽다방 신림점",
    message: "데이터 분석과 프론트엔드의 결합.",
    createdAt: new Date("2024-07-06T15:00:00Z"),
    valid: true
  }
];

// 19. SpecifyInfo 테이블 (10개)
const mockSpecifyInfos = [
  { userId: 1, info: JSON.stringify({ skills: ["React", "TypeScript", "Next.js"], experience: "2년", portfolio: "github.com/user001" }) },
  { userId: 2, info: JSON.stringify({ skills: ["Figma", "Adobe XD", "Sketch"], experience: "1.5년", portfolio: "behance.net/user002" }) },
  { userId: 3, info: JSON.stringify({ skills: ["기획", "마케팅", "사업계획서"], experience: "1년", portfolio: "linkedin.com/user003" }) },
  { userId: 4, info: JSON.stringify({ skills: ["Python", "TensorFlow", "Pandas"], experience: "2.5년", portfolio: "kaggle.com/user004" }) },
  { userId: 5, info: JSON.stringify({ skills: ["Node.js", "React", "MySQL"], experience: "3년", portfolio: "github.com/user005" }) },
  { userId: 6, info: JSON.stringify({ skills: ["프로덕트 기획", "데이터 분석", "Jira"], experience: "2년", portfolio: "notion.so/user006" }) },
  { userId: 7, info: JSON.stringify({ skills: ["Docker", "Kubernetes", "AWS"], experience: "2.5년", portfolio: "github.com/user007" }) },
  { userId: 8, info: JSON.stringify({ skills: ["광고기획", "SNS마케팅", "브랜딩"], experience: "1.5년", portfolio: "instagram.com/user008" }) },
  { userId: 9, info: JSON.stringify({ skills: ["Unity", "C#", "게임기획"], experience: "2년", portfolio: "itch.io/user009" }) },
  { userId: 10, info: JSON.stringify({ skills: ["SQL", "R", "Tableau"], experience: "2년", portfolio: "github.com/user010" }) }
];

// 20. UnivCert 테이블 (10개)
const mockUnivCerts = [
  { id: 1, email: "john.kim@university.ac.kr", certCode: 123456, createdAt: new Date("2024-01-15T09:00:00Z"), expiredAt: new Date("2024-01-15T09:05:00Z"), valid: true },
  { id: 2, email: "sarah.lee@university.ac.kr", certCode: 234567, createdAt: new Date("2024-02-20T14:30:00Z"), expiredAt: new Date("2024-02-20T14:35:00Z"), valid: true },
  { id: 3, email: "michael.park@university.ac.kr", certCode: 345678, createdAt: new Date("2024-03-10T11:15:00Z"), expiredAt: new Date("2024-03-10T11:20:00Z"), valid: true },
  { id: 4, email: "emma.choi@university.ac.kr", certCode: 456789, createdAt: new Date("2024-01-25T16:45:00Z"), expiredAt: new Date("2024-01-25T16:50:00Z"), valid: true },
  { id: 5, email: "david.jung@university.ac.kr", certCode: 567890, createdAt: new Date("2024-04-05T08:20:00Z"), expiredAt: new Date("2024-04-05T08:25:00Z"), valid: true },
  { id: 6, email: "lisa.han@university.ac.kr", certCode: 678901, createdAt: new Date("2024-02-14T13:10:00Z"), expiredAt: new Date("2024-02-14T13:15:00Z"), valid: true },
  { id: 7, email: "alex.yoon@university.ac.kr", certCode: 789012, createdAt: new Date("2024-03-22T10:35:00Z"), expiredAt: new Date("2024-03-22T10:40:00Z"), valid: true },
  { id: 8, email: "grace.ko@university.ac.kr", certCode: 890123, createdAt: new Date("2024-01-30T15:50:00Z"), expiredAt: new Date("2024-01-30T15:55:00Z"), valid: true },
  { id: 9, email: "ryan.lim@university.ac.kr", certCode: 901234, createdAt: new Date("2024-04-12T12:25:00Z"), expiredAt: new Date("2024-04-12T12:30:00Z"), valid: true },
  { id: 10, email: "sophia.seo@university.ac.kr", certCode: 412345, createdAt: new Date("2024-03-18T17:40:00Z"), expiredAt: new Date("2024-03-18T17:45:00Z"), valid: true }
];

// 21. UnivList 테이블 (10개)
const mockUnivLists = [
  { id: 1, name: "서울대학교", created_at: new Date("2024-01-01T00:00:00Z"), updated_at: new Date("2024-01-01T00:00:00Z"), name_initial: "서울대" },
  { id: 2, name: "연세대학교", created_at: new Date("2024-01-01T00:00:00Z"), updated_at: new Date("2024-01-01T00:00:00Z"), name_initial: "연세대" },
  { id: 3, name: "고려대학교", created_at: new Date("2024-01-01T00:00:00Z"), updated_at: new Date("2024-01-01T00:00:00Z"), name_initial: "고려대" },
  { id: 4, name: "성균관대학교", created_at: new Date("2024-01-01T00:00:00Z"), updated_at: new Date("2024-01-01T00:00:00Z"), name_initial: "성균관대" },
  { id: 5, name: "한양대학교", created_at: new Date("2024-01-01T00:00:00Z"), updated_at: new Date("2024-01-01T00:00:00Z"), name_initial: "한양대" },
  { id: 6, name: "중앙대학교", created_at: new Date("2024-01-01T00:00:00Z"), updated_at: new Date("2024-01-01T00:00:00Z"), name_initial: "중앙대" },
  { id: 7, name: "경희대학교", created_at: new Date("2024-01-01T00:00:00Z"), updated_at: new Date("2024-01-01T00:00:00Z"), name_initial: "경희대" },
  { id: 8, name: "이화여자대학교", created_at: new Date("2024-01-01T00:00:00Z"), updated_at: new Date("2024-01-01T00:00:00Z"), name_initial: "이화여대" },
  { id: 9, name: "서강대학교", created_at: new Date("2024-01-01T00:00:00Z"), updated_at: new Date("2024-01-01T00:00:00Z"), name_initial: "서강대" },
  { id: 10, name: "숙명여자대학교", created_at: new Date("2024-01-01T00:00:00Z"), updated_at: new Date("2024-01-01T00:00:00Z"), name_initial: "숙명여대" }
];

// Prisma를 사용한 전체 데이터 삽입 함수
const insertAllMockData = async () => {
  try {
    // 1. 기본 데이터 삽입 (참조 관계가 없는 테이블들)
    console.log('Inserting basic data...');
    
    // UnivList
    for (const univ of mockUnivLists) {
      await prisma.univList.create({ data: univ });
    }
    
    // Category
    for (const category of mockCategories) {
      await prisma.category.create({ data: category });
    }
    
    // ThreadSubject
    for (const subject of mockThreadSubjects) {
      await prisma.threadSubject.create({ data: subject });
    }
    
    // User
    for (const user of mockUsers) {
      await prisma.user.create({ data: user });
    }
    
    // 2. User 종속 테이블들 삽입
    console.log('Inserting user-dependent data...');
    
    // UserTimetable
    for (const timetable of mockUserTimetables) {
      await prisma.userTimetable.create({ data: timetable });
    }
    
    // CategoryMatch
    for (const categoryMatch of mockCategoryMatches) {
      await prisma.categoryMatch.create({ data: categoryMatch });
    }
    
    // Follow
    for (const follow of mockFollows) {
      await prisma.follow.create({ data: follow });
    }
    
    // RefreshToken
    for (const token of mockRefreshTokens) {
      await prisma.refeshToken.create({ data: token });
    }
    
    // SpecifyInfo
    for (const info of mockSpecifyInfos) {
      await prisma.specifyInfo.create({ data: info });
    }
    
    // Thread
    for (const thread of mockThreads) {
      await prisma.thread.create({ data: thread });
    }
    
    // ThreadScrap
    for (const scrap of mockThreadScraps) {
      await prisma.threadScrap.create({ data: scrap });
    }
    
    // 3. Thread 종속 테이블들 삽입
    console.log('Inserting thread-dependent data...');
    
    // SubjectMatch
    for (const subjectMatch of mockSubjectMatches) {
      await prisma.subjectMatch.create({ data: subjectMatch });
    }
    
    // ThreadImage
    for (const image of mockThreadImages) {
      await prisma.threadImage.create({ data: image });
    }
    
    // ThreadLike
    for (const like of mockThreadLikes) {
      await prisma.threadLike.create({ data: like });
    }
    
    // ScrapMatch
    for (const scrapMatch of mockScrapMatches) {
      await prisma.scrapMatch.create({ data: scrapMatch });
    }
    
    // Comment
    for (const comment of mockComments) {
      await prisma.comment.create({ data: comment });
    }
    
    // 4. 채팅 관련 테이블들 삽입
    console.log('Inserting chat-related data...');
    
    // ChatRoom
    for (const chatRoom of mockChatRooms) {
      await prisma.chatRoom.create({ data: chatRoom });
    }
    
    // ChatJoin
    for (const chatJoin of mockChatJoins) {
      await prisma.chatJoin.create({ data: chatJoin });
    }
    
    // Message
    for (const message of mockMessages) {
      await prisma.message.create({ data: message });
    }
    
    // 5. 기타 테이블들 삽입
    console.log('Inserting remaining data...');
    
    // CoffeeChat
    for (const coffeeChat of mockCoffeeChats) {
      await prisma.coffeeChat.create({ data: coffeeChat });
    }
    
    // UnivCert
    for (const cert of mockUnivCerts) {
      await prisma.univCert.create({ data: cert });
    }
    
    console.log('All mock data inserted successfully!');
  } catch (error) {
    console.error('Error inserting mock data:', error);
  }
};

module.exports = {
  mockUsers,
  mockUserTimetables,
  mockCategories,
  mockThreadSubjects,
  mockCategoryMatches,
  mockThreads,
  mockSubjectMatches,
  mockThreadImages,
  mockThreadLikes,
  mockThreadScraps,
  mockScrapMatches,
  mockComments,
  mockFollows,
  mockChatRooms,
  mockChatJoins,
  mockMessages,
  mockRefreshTokens,
  mockCoffeeChats,
  mockSpecifyInfos,
  mockUnivCerts,
  mockUnivLists,
  insertAllMockData
};