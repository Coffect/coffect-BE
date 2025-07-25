# coffect Backend Repo
Coffect BackEnd Repository

## 📚Stack
* TypeScript
* JavaScript
* ORM
* MySql

## 주요 기능
* 커피챗 게시글 업로드 및 조회
* 커피챗 실시간 채팅
* 커피챗 스토리 조회 및 매칭 시스템

## Commit Meaage Convention
| Tag Name       | Description                                    |
|----------------|------------------------------------------------|
| :sparkles: Feature    | 새로운 기능을 추가                              |
| :bug: Fix          | 버그 수정                                      |
| :hammer:  Refactoring | 프로덕션 코드 리팩토링                         |
| :memo: Docs        | 문서 수정 및 기타 코드 수정 (CICD)                                      |


## File Struct
### DDD (Domain Driven Design)
<pre>
📁 COFFE...
├── 📁 dist
│   └── 📁 config
├── 📁 user
│   ├── 📁 user.Controller
│   ├── 📁 user.Model
│   ├── 📁 user.Server
│   ├── user.Router.ts
├── 📁 thread
│   ├── 📁 thread.Controller
│   ├── 📁 thread.Model
│   ├── 📁 thread.Server
│   ├── thread.Router.ts
├── index.ts
├── 📁 node_modules
├── 📁 prisma
</pre>

## init Develope Env Setting 
<pre>
<code>
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs


npm init
npm i express
npm install -g typescript
npm install -g ts-node
npm install --save-dev ts-node
tsc --init
tsc -w
npm i mysql2
npm i bcrypt
npm i crypto
npm i cors
npm i swagger-autogen
npm i swagger-ui-express
npm install swagger-jsdoc
npm i morgan
npm i nodemailer
npm i jsonwebtoken
npm i nodemon
npm install \
  @prisma/client \
  prisma

npm exec prisma init
</code>
</pre>


<pre>
<code>
npm i --save-dev @types/express
npm i dotenv
npm i --save-dev @types/cors
npm i --save-dev @types/bcrypt
npm i --save-dev @types/swagger-ui-express
npm i --save-dev @types/swagger-jsdoc
npm i --save-dev @types/morgan
npm i --save-dev @types/nodemailer
</code>
</pre>
