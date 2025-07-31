import { KSTtime } from '../config/KSTtime';
import { prisma } from '../config/prisma.config';
import { coffectChatCardDTO, CoffeeChatRecord, CoffeeChatRecordDetail, CoffeeChatSchedule } from '../middleware/coffectChat.DTO/coffectChat.DTO';

export class HomeModel {

  // 하루 관심란 입력
  public async postTodayInterestModel (
    userId : number,
    todayInterest : number
  ):Promise<void> {
    await prisma.user.update({
      where : {userId : userId},
      data : {todayInterest : todayInterest}
    });
  };

  // userId에 해당하는 todayInterest 값 가져오기 (1,2,3,4)
  public async getTodayInterestValue (
    userId : number
  ):Promise<number> {
    const value = await prisma.user.findUniqueOrThrow({
      where : { userId : userId },
      select : { todayInterest : true }
    });

    if(value.todayInterest === 0) {
      return value.todayInterest;
    }

    if(value.todayInterest === null) {
      throw new Error (`Invalid todayInterest value for user ${userId}: ${value.todayInterest}`);
    }
    
    return value.todayInterest;
  };

  // userId에 해당하는 coffeeChatCount값 불러오기
  public async getCoffeeChatCount(
    userId: number
  ):Promise<number> {
    const result = await prisma.user.findUniqueOrThrow({
      where : {userId : userId},
      select : { coffeeChatCount : true }
    });

    return result.coffeeChatCount;
  };

  // userId에 해당하는 coffeeChatCount값 감소하기
  public async decreaseCoffeeChatCount(
    userId : number
  ):Promise<void> {
    await prisma.user.update({
      where: {
        userId: userId,
        coffeeChatCount: { gt: 0 } // 0보다 큰 경우만 업데이트
      },
      data: {
        coffeeChatCount: { decrement: 1 } // 1 감소
      }
    });
  };

  // userId에 해당하는 todayInterestArray 배열 가져오기
  public async getTodayInterestArray(
    userId : number
  ):Promise<number[]> {
    const result = await prisma.user.findUnique ({
      where : {userId : userId},
      select : { todayInterestArray : true} as any // any로 타입 우회
    });
 
    if(result?.todayInterestArray === null) {
      return [];
    }

    return (result!.todayInterestArray as unknown) as number[];
  };
  

  // 각 로직 별로 postTodainterestArray값을 userId로 채워넣는 함수 ( [3, 4, 5, 6] 총 4개 )
  public async postTodayInterestArray(
    userId : number,
    todayInterest : number
  ): Promise<void> {
    const filteredArray : number[] = await this.sameSchool(userId);

    switch(todayInterest) {
    case 1 :
      // 가까운 거리 순 (같은 학교)
      await this.closeDistance(userId, filteredArray);
      break;

    case 2 :
      // 나와 관심사가 비슷한 categoryMatch (다 대 다)
      await this.sameInterestCategory(userId, filteredArray);
      break;

    case 3 : 
      // 같은 학번 
      await this.sameGrade(userId, filteredArray);
      break;

    case 4 : 
      // 최근에 글을 쓴 사용자
      await this.recentPostUser(userId, filteredArray);
      break;
    }
  };

  // 같은 학교사람 구분하는 로직
  private async sameSchool(
    userId : number
  ):Promise<number[]> {
    const result = await prisma.user.findUniqueOrThrow({
      where : {userId : userId},
      select : {univId : true} 
    });

    const compareSameSchoole = result.univId; // 나의 학교 조회
    
    if (compareSameSchoole === null || compareSameSchoole === undefined) {
      throw new Error(`User ${userId} has no university ID`);
    }

    // 같은 학교 사용자 조회
    const sameSchoolUsers = await this.getUsersBySchoolDomain(userId, compareSameSchoole);

    return sameSchoolUsers;
  };

  // // 이메일 도메인 추출
  // private extractSchoolDomain(email: string): string | null {
  //   // 정규표현식: @ 다음부터 .kr 전까지
  //   const match = email.match(/@([^.]+)\.kr$/);
  //   return match ? match[1] : null;
  // };

  // 같은 학교 도메인 추출 (filteredArray 생성)
  private async getUsersBySchoolDomain(
    userId: number,
    schoolDomain: number
  ): Promise<number[]> {
    const users = await prisma.user.findMany({
      where: {
        userId: { not: userId },
        univId: { equals: schoolDomain }
      },
      select: { userId : true },
      take: 20
    });

    return users.map((user: any) => user.userId);
  };

  // <1> 가까운 거리 순 (같은 학교)
  private async closeDistance(
    userId : number,
    filteredArray : number[]
  ):Promise<void> {
    const array : number[] = [];

    const copyFiltedArray  = [... filteredArray];

    // 최대 4개까지 선택하되, 배열 크기보다 작으면 그만큼만 선택
    const maxCount = Math.min(4, copyFiltedArray.length);

    for(let i = 0; i < maxCount; i++) {
      if (copyFiltedArray.length === 0) break;

      const randomIndex = Math.floor(Math.random() * copyFiltedArray.length);

      array.push(copyFiltedArray[randomIndex]);

      copyFiltedArray.splice(randomIndex, 1);
    }

    await prisma.user.update({
      where : {userId : userId},
      data : {
        todayInterestArray : array
      } as any // any로 타입 우회
    });
  };

  // <2> 나와 관심사가 비슷한 categoryMatch
  private async sameInterestCategory(
    userId : number,
    filteredArray : number[]
  ):Promise<void> {
    let array : number[] = [];

    const currentUserCategory = await prisma.user.findUniqueOrThrow({
      where : {userId :userId},
      select : {
        categoryMatch : {
          select : {
            category : {
              select : {
                categoryName: true
              }
            }
          }
        }
      }
    });

    const myCategory = currentUserCategory.categoryMatch.map(
      (match: any) => match.category.categoryName
    );

    const ArrayuserCategory = await prisma.user.findMany({
      where : {userId : {in: filteredArray}},
      select : {
        userId : true,
        categoryMatch : {
          select : {
            category : {
              select : {
                categoryName: true
              }
            }
          }
        }
      }
    });

    const score = ArrayuserCategory.map((user: any) => {
      const userCategory = user.categoryMatch.map(
        (match: any) => match.category.categoryName);

      const sameCategory = userCategory.filter(
        (category: any) => myCategory.includes(category));

      return {
        userId : user.userId,
        sameCategory : sameCategory,
        score : sameCategory.length
      };
    }).filter((user: any) => user.score > 0)
      .sort((a: any, b: any) => b.score - a.score);

      
    const selectedUser = new Set<number>();

    for(const user of score) {
      if(selectedUser.size >= 4) break;

      selectedUser.add(user.userId);
    }

    array = Array.from(selectedUser);

    // 만약 4명보다 적으면 나머지는 랜덤으로 채움
    if (array.length < 4 && filteredArray.length > array.length) {
      const remainingUsers = filteredArray.filter(id => !array.includes(id));
      const additionalCount = Math.min(4 - array.length, remainingUsers.length);
      
      for (let i = 0; i < additionalCount; i++) {
        const randomIndex = Math.floor(Math.random() * remainingUsers.length);
        array.push(remainingUsers[randomIndex]);
        remainingUsers.splice(randomIndex, 1);
      }
    }

    await prisma.user.update({
      where : {userId : userId},
      data : {
        todayInterestArray : array
      } as any // any로 타입 우회
    });
  };

  // <3> 같은 학번
  private async sameGrade(
    userId : number,
    filteredArray : number[]
  ):Promise<void> {
    const array : number[] = [];

    const userGrade = await prisma.user.findUniqueOrThrow({
      where : {userId : userId},
      select : {studentId : true}
    });

    const currentGrade = userGrade.studentId;

    if(currentGrade === null || currentGrade === undefined) {
      // studentId가 없으면 filteredArray 그대로 사용
      return;
    }

    // filteredArray를 순회하면서 조건에 맞는 사용자를 탐색
    for(const targetUserId of filteredArray) {
      if(array.length >= 4) {
        break;
      }

      const targetUser = await prisma.user.findFirst({
        where : { userId : targetUserId },
        select : { studentId : true }
      });

      if(targetUser) {
        const targetGrade = targetUser.studentId;

        if(targetGrade === currentGrade) {
          array.push(targetUserId);
        }
      }
    }

    // 만약 4명보다 적으면 나머지는 랜덤으로 채움
    if (array.length < 4 && filteredArray.length > array.length) {
      const remainingUsers = filteredArray.filter(id => !array.includes(id));
      const additionalCount = Math.min(4 - array.length, remainingUsers.length);
      
      for (let i = 0; i < additionalCount; i++) {
        const randomIndex = Math.floor(Math.random() * remainingUsers.length);
        array.push(remainingUsers[randomIndex]);
        remainingUsers.splice(randomIndex, 1);
      }
    }

    await prisma.user.update({
      where: { userId: userId },
      data: { todayInterestArray: array } as any // any로 타입 우회
    });
  };
  
  // private extractGrade(
  //   email: string
  // ):string{
  //   // 202010836@school.kr에서 앞 4자리(2020) 추출
  //   const match = email.match(/^(\d{4})/);

  //   return match![0]; 
  // };

  // <4> 최근에 글을 쓴 사용자
  private async recentPostUser(
    userId : number,
    filteredArray : number[]
  ):Promise<void> {
    let array : number[] = [];

    // 사용자별 최근 게시물 조회
    const userRecentThread = await prisma.user.findMany({
      where : { userId : { in: filteredArray }},
      select : {
        userId : true, 
        threads : {
          orderBy : {
            createdAt : 'desc'
          },
          take : 1,
          select : {
            createdAt : true
          }
        }
      }
    });

    // 최근 게시물이 존재하는 user별로 정렬 진행
    const userFilterThread = userRecentThread
      .filter((user: any) => user.threads.length > 0)
      .map((user: any) => ({
        userId: user.userId,
        createdAt : user.threads[0].createdAt
      }))
      .sort((a: any, b: any) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0,4)
      .map((user: any) => user.userId);

    array = userFilterThread;

    // 만약 4명보다 적으면 나머지는 랜덤으로 채움
    if (array.length < 4 && filteredArray.length > array.length) {
      const remainingUsers = filteredArray.filter(id => !array.includes(id));
      const additionalCount = Math.min(4 - array.length, remainingUsers.length);
      
      for (let i = 0; i < additionalCount; i++) {
        const randomIndex = Math.floor(Math.random() * remainingUsers.length);
        array.push(remainingUsers[randomIndex]);
        remainingUsers.splice(randomIndex, 1);
      }
    }

    await prisma.user.update({
      where : {userId : userId},
      data : { todayInterestArray : array } as any // any로 타입 우회
    });
  };

  // 특정 사용자 CardProfile 가져오는 API
  public async showFrontProfile(
    userId: number
  ):Promise<coffectChatCardDTO> {
    const result  = await prisma.user.findUniqueOrThrow({
      where : {userId : userId},
      select: {
        userId : true,
        name : true,
        studentId : true,
        introduce : true,
        profileImage : true,

        categoryMatch : {
          select : {
            category : {
              select : {
                categoryName : true
              }
            }
          }
        }
      }
    });

    const grade = result.studentId;
    
    if (grade === null || grade === undefined) {
      throw new Error(`User ${userId} has no student ID`);
    }
    const categoryNames = result.categoryMatch.map(
      (match: any) => match.category.categoryName
    );

    const cardDTO = new coffectChatCardDTO (
      result.userId,
      result.name,
      grade,
      result.introduce || '',
      categoryNames,
      result.profileImage
    );

    return cardDTO;
  };

  public async postSuggestCoffeeChatModel (
    myUserId : number,
    otherUserId : number,
    suggestion : string
  ):Promise<void> {
    const currentDate = KSTtime();

    await prisma.coffeeChat.create({
      data: {
        firstUserId: myUserId,   
        secondUserId: otherUserId,
        message: suggestion,
        coffectDate: currentDate,
        location: '',
        valid: false
      }
    });
  }

  /** 커피챗 일정 가져오는 Model */
  public async GetCoffeeChatScheduleModel (
    userId : number
  ):Promise<CoffeeChatSchedule[]> {

    const currentDate = KSTtime();

    const result = await prisma.coffeeChat.findMany({
      where : { 
        OR: [
          { firstUserId: userId },
          { secondUserId: userId }
        ],
        valid: true,
        // 커피챗 일정이 오늘 이후인 경우만 조회
        coffectDate: {
          gte: currentDate
        }
      },
      include: {
        firstUser: {
          select: {
            profileImage: true
          }
        },
        secondUser: {
          select: {
            profileImage: true
          }
        }
      },
      orderBy: {
        coffectDate: 'asc'
      }
    });

    const schedules: CoffeeChatSchedule[] = result.map((coffeeChat: any) => {
      const opponentId = coffeeChat.firstUserId === userId 
        ? coffeeChat.secondUserId.toString() 
        : coffeeChat.firstUserId.toString();
      
      const firstUserImage = coffeeChat.firstUser?.profileImage || '';
      const secondUserImage = coffeeChat.secondUser?.profileImage || '';
      
      // 남은 일수 계산 (밀리초를 일수로 변환)
      const restDate = new Date(coffeeChat.coffectDate.getTime() - currentDate.getTime());
      
      return new CoffeeChatSchedule(
        opponentId,
        coffeeChat.coffectDate,
        coffeeChat.location,
        restDate,
        firstUserImage,
        secondUserImage
      );
    });

    return schedules;
  }

  /** 과거 커피챗 기록 가져오는 Model */
  public async getPastCoffeeChatModel(
    userId: number
  ): Promise<CoffeeChatRecord[]> {
    // 과거 커피챗 기록 조회
    const result = await prisma.coffeeChat.findMany({
      where: {
        OR: [{ firstUserId: userId }, { secondUserId: userId }],
        valid: true
      },
      orderBy: {
        coffectDate: 'desc'
      },
      include: {
        firstUser: {
          select: {
            userId: true,
            name: true,
            categoryMatch: {
              orderBy: { createdAt: 'desc' },
              take: 1,
              select: {
                category: {
                  select: {
                    categoryColor: true
                  }
                }
              }
            }
          }
        },
        secondUser: {
          select: {
            userId: true,
            name: true,
            categoryMatch: {
              orderBy: { createdAt: 'desc' },
              take: 1,
              select: {
                category: {
                  select: {
                    categoryColor: true
                  }
                }
              }
            }
          }
        }
      }
    });

    // CoffeeChatRecord[] 생성
    const records: CoffeeChatRecord[] = result.map((chat: any) => {
      // 상대방 구분
      let opponent; let me;
      if (chat.firstUserId === userId) {
        opponent = chat.secondUser;
        me = chat.firstUser;
      } else {
        opponent = chat.firstUser;
        me = chat.secondUser;
      }
      
      const opponentName = opponent?.name || '';
      // 상대방 카테고리 컬러
      const color1 = (opponent?.categoryMatch?.[0]?.category?.categoryColor) || '';
      // 내 카테고리 컬러
      const color2 = (me?.categoryMatch?.[0]?.category?.categoryColor) || '';
      
      const coffeeDate = chat.coffectDate;
      return new CoffeeChatRecord(opponentName, color1, color2, coffeeDate);
    });

    return records;
  }

  /** 커피챗 상세 보기 Model */
  public async getSpecifyCoffeeChatModel(
    userId : number
  ):Promise<CoffeeChatRecordDetail> {
    // 과거 커피챗 기록 조회
    const result = await prisma.coffeeChat.findFirstOrThrow({
      where: {
        OR: [{ firstUserId: userId }, { secondUserId: userId }],
        valid: true
      },
      orderBy: {
        coffectDate: 'desc'
      },
      include: {
        firstUser: {
          select: {
            userId: true,
            name: true,
            profileImage: true,
            categoryMatch: {
              orderBy: { createdAt: 'desc' },
              take: 1,
              select: {
                category: {
                  select: {
                    categoryColor: true
                  }
                }
              }
            }
          }
        },
        secondUser: {
          select: {
            userId: true,
            name: true,
            profileImage: true,
            categoryMatch: {
              orderBy: { createdAt: 'desc' },
              take: 1,
              select: {
                category: {
                  select: {
                    categoryColor: true
                  }
                }
              }
            }
          }
        }
      }
    });

    // 상대방/본인 구분
    let opponent; let me;
    if (result.firstUserId === userId) {
      opponent = result.secondUser;
      me = result.firstUser;
    } else {
      opponent = result.firstUser;
      me = result.secondUser;
    }
    const opponentName = opponent?.name || '';
    const color1 = (opponent?.categoryMatch?.[0]?.category?.categoryColor) || '';
    const color2 = (me?.categoryMatch?.[0]?.category?.categoryColor) || '';
    const coffeeDate = result.coffectDate;
    const location = result.location;
    const firstUserImage = result.firstUser?.profileImage || '';
    const secondUserImage = result.secondUser?.profileImage || '';

    return new CoffeeChatRecordDetail(
      opponentName,
      color1,
      color2,
      coffeeDate,
      location,
      firstUserImage,
      secondUserImage
    );
  };

  public async fixCoffeeChatScheduleModel(
    userId : number,
    coffectId : number,
    coffeeChat : Date,
    location : string,
    time : Date
  ):Promise<void> {
    const combineDate = new Date(coffeeChat.getTime() + time.getTime());

    await prisma.coffeeChat.update({
      where : {
        coffectId : coffectId,
        OR : [{firstUserId : userId}, {secondUserId : userId}]
      },
      data : {
        coffectDate : combineDate,
        location : location
      }
    });
  };

  public async acceptCoffeeChatModel(
    userId : number,
    coffectId : number
  ):Promise<void> {
    await prisma.coffeeChat.update({
      where : {
        OR : [{firstUserId : userId}, {secondUserId : userId}],
        coffectId : coffectId
      },
      data : {
        valid : true
      }
    });
  };

  /** 스케줄러 수동 실행 모델 */
  public async resetDailyFieldsModel(): Promise<void> {
    console.log('Manual reset job started at:', new Date().toISOString());
    
    try {
      // 먼저 전체 사용자 수 확인
      const totalUsers = await prisma.user.count();
      console.log(`Total users in database: ${totalUsers}`);
      
      // 모든 사용자의 daily 필드 초기화
      const result = await prisma.user.updateMany({
        where: {}, // 모든 사용자 대상
        data: {
          coffeeChatCount: 4,
          todayInterest: null,
          todayInterestArray: []
        }
      });
      
      console.log(`Manual reset completed. Updated ${result.count} users out of ${totalUsers} total users`);
      
      // 변경된 사용자 수가 전체 사용자 수와 일치하는지 확인
      if (result.count !== totalUsers) {
        console.warn(`Warning: Only ${result.count} users were updated, but there are ${totalUsers} total users`);
      }
    } catch (err) {
      console.error('Failed to reset daily fields:', err);
      throw err;
    }
  };
}