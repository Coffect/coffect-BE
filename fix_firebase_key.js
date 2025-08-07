#!/usr/bin/env node

/**
 * Firebase Private Key 형식 수정 스크립트
 * 
 * 현재 환경 변수에서 'n' 문자를 '\n'으로 변환하여 올바른 형식으로 만듭니다.
 */

// 현재 문제가 있는 형식
const currentKey = `-----BEGIN PRIVATE KEY-----nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCriqAGQya4JE9Xnjev9FUxtrIRGz+d+qbcpSSzuGbUs+cGoYfIgy5249FABgFzoKysBld4h1sd7ISa+nKY5swn/CZrwI3h/kynCADWkyk2B99hpuBsFxEqXBNmcq6nZ2bB6g41M3o1x90EJUn31NRLd/YUubqGzlN9pKWAvFspp64XGPid8OuyIsVBLM1ZmGCUxQ12OYcG8Xzolp1njTnmSJE9k2kX43ZD1e+2epEQRU1f+6kqxjwg4CxNIH1TNsL7HvjyZNFjEQwxmkK2nvMT/3xyY7nzk67zO8KdY4LLf2wSwax/VpcgJuI96W579f5ehdoqJ4G9/Stlwsj8XnGgT2bXJLAgMBAAECggEASi3kDVE0iSSKet4QUpzHNBYKDWUSQh+56MyP9VaAljZannCnevnfOeJCNmFid1Hf2XPUl3ZQ3JvOrAUiPIlDpVnN+lIcZW6J/C6DBAPHiJBYsnT6/0LqVVsDuKWXCSUZtnk0M6VTD7ahyI0pLQQKaJyc3vtQSYvzIFKYGUTNuwfyAfnPI9jPcnfV5UH8XwX1oEhZJvBnkrg8POu4XFPM7yaLE7TEgQXldXhPrQDGcYDaospniYDFh+pVutFqDSWiT5WYzu73US1/yW8yz5yjRyuHKUN6NvlKOKFyQnM/K9svGYtyn6lFxZgZMN3uhuT88q0pE2VtWKIOUuwT0eEdfeEuAAQKBgQDdgirW9qPlwb/uu9hYn0sNr8B+pQeFlHrtzi93zkTzoUvsAtfMbNC3Xg5xYkAvjncoSDgqB6d9Xpmn1xSb4nS7aQUpmYucJpYLou9s1WTenCnctMttRzXcv1iCWbA0mDJ3WZ6uMWoVgr664JN3LtnX4nyvuvfWBEKhf99oizkvvBCSwKBgQDGQKkjFp66V2JmixQuvwRnJUQckUWM18A0nloFqotdJTRWBMriWqaQOVEeH+gR3zyRdcEBOkcUNZ73SCZDmEBBHDVmi0V71kcK8nNgWXfZzp7SqZoRHR7xGXJn8Gq6jbbS+oC+QVB8KvhzxxWA2NE1vYHMIN0vLeW6t/nZSNBPrmQAQKBgHTYtFZ+9og9g0yhBIgebf3jRiBX41kfNAzIrEVOyQ1YsJV4ZYxlnIwV7pJ7HJa5lTvHlPD+5qhona9+8p0j1T5GkMOfynY5O+wfJIxoysWv7JwIJs9pDnkVKtBgFWY5Hu38dYs3/9jnBku4KbIGH9Mty9P9mqMBsYAmU4hmwIGN8vAoGAURF5n2GZUi+BV1ZbDrwXfWApOGtxws1I6P4bX7vId1NSXmZhTERDXjCB8i6b6Er/6n9banBQborD2iynOs89bXwSY9ZC33hbWQCwSQLs1nz+RyihXqQo1fBQ7x3JlvWCMC3NXXn852Tx9EmLzcRe4HSCcJgu+Rp+fFEZLjHvNNYcAECgYBSwHKcmMBeZA7EI4dfRzTanApudSwq8JnKqxxTArNKtabI05LWD2KHPVo3/doelhS34AVRAypL+5M1ewiVQ6Q4ZnPmjK/DPtyYrsBACq1e9pQZylv564ZYTa9NLFSjzbOwD779IAKYvBipl0TCsrH8gUnFnsXrefLTCOaiz7sJqFT+w==n-----END PRIVATE KEY-----n`;

console.log('=== Firebase Private Key 형식 수정 ===\n');

console.log('현재 형식 (문제가 있는 형식):');
console.log(currentKey.substring(0, 100) + '...\n');

// 형식 수정
let fixedKey = currentKey
  .replace(/n-----BEGIN PRIVATE KEY-----n/g, '\n-----BEGIN PRIVATE KEY-----\n')
  .replace(/n-----END PRIVATE KEY-----n/g, '\n-----END PRIVATE KEY-----\n');

console.log('수정된 형식 (올바른 형식):');
console.log(fixedKey.substring(0, 100) + '...\n');

console.log('=== .env 파일에 추가할 내용 ===\n');
console.log('FIREBASE_PRIVATE_KEY="' + fixedKey + '"\n');

console.log('=== 사용 방법 ===');
console.log('1. 위의 내용을 .env 파일에 추가하세요.');
console.log('2. 애플리케이션을 재시작하세요.');
console.log('3. "Firebase Admin SDK 초기화 성공" 메시지가 나타나면 성공입니다.\n');

// 유효성 검사
if (fixedKey.includes('-----BEGIN PRIVATE KEY-----') && fixedKey.includes('-----END PRIVATE KEY-----')) {
  console.log('✅ Private key 형식이 올바르게 수정되었습니다.');
} else {
  console.log('❌ Private key 형식에 문제가 있습니다.');
} 