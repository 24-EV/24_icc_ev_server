# 24 INHA EV 데이터 로깅 앱 사용법

### 완성도를 높이기 위하여 조금씩 수정 예정입니다. 업데이트 날짜 확인하여 이전의 코드, 방식과의 차이점 파악 후 진행해주세요.

### 또한 잘못되거나 예전 버전의 설명이 남아있을 수 있습니다. 양해부탁드립니다.

<br/>
<br/>
<br/>

## 업데이트 적용방법 (간단)

1. VS 코드 열기 -> 터미널 -> git pull 해서 빨간글씨 없으면 에러 안 나고 잘 된 거에요.

<br/>

## 깃허브 레포지토리 주소

클라이언트 : https://github.com/24-EV/24_icc_ev_client

서버 : https://github.com/24-EV/24_icc_ev_server

펌웨어 : https://github.com/24-EV/24_icc_ev_firmware

<br/>
<br/>
<br/>

## 주요 기능

- 차량의 컨트롤러 및 모듈에서 오는 데이터 값을 시각화
  - 데이터 카드로 대시보드와 차트로 값을 시각화함.
  - lat, lng
    - GPS 모듈 고장
    - 클라이언트 코드에는 구현되어 있으나, 서버 코드에서 삭제함.
    - 복구 원할 시 서버 코드 수정 필요
- 차량 현재 위치 시각화
  - 카카오맵 API를 통하여 차량의 현재 위치를 시각화한다.
- Excel 데이터 다운로드
  - 원하는 시간대의 데이터를 DB에서 불러와 액셀 파일로 다운로드

<br/>
<br/>
<br/>

## 용어 정리

- JavaScript : 프로그래밍 언어
- React : JavaScript 기반 UI 라이브러리
- Vite : React 빌드 툴. 기존보다 더 좋음
- Node.js : JavaScript 실행 환경
  - 브라우저에서만 실행 가능했던 JavaScript를 서버에서도 실행 가능하도록 해줌
- Express : Node.js의 프레임워크. Express 는 Node.js 위에서 동작하는 웹 프레임 워크
- AWS EC2 : 아마존에서 빌려주는 컴퓨터
- AWS DynamoDB : NoSQL 데이터베이스
  - 고정된 테이블 구조를 사용하지 않고, 다양한 데이터 구조를 저장할 수 있는 데이터 베이스.
  - JSON 형식 저장 가능
- JSON : 사람도 기계도 읽기 쉬운 경량 데이터 형식.
- Vercel : 프론트엔드 프로젝트 배포 클라우드 플랫폼으로, 깃허브와 연동하여 코드 푸시 때마다 자동 업데이트.
- Git : 버전 관리 시스템
- GitHub : Git을 온라인에서 저장하고 협업할 수 있는 플랫폼.
  - 코드를 수정할 때마다 git에 업데이트 하거나, 예전 코드로 다시 돌아갈 수 있고, 이를 github에 올려 온라인으로 저장하고 협업할 수 있습니다.
- 터미널 명령어(CLI) : 터미널에서 사용하는 명령어
  - 이제 등장할 cd, chmod, ls 등이 있다.
- 포트포워딩 : 포트 열어주기

프로그램 개선을 원할 때, 어떠한 용어가 있는지 알면 도움이 될 거라 생각하여 검색하기 난감할 것 같은 용어들 몇개만 짧게 적어둡니다.

<br/>
<br/>
<br/>

## 설치 및 실행 방법

### 기본 설정

1. AWS 계정 생성 : https://deoking.tistory.com/27
   1. aws.amazon.com/ko/
   2. 관리 잘 하셔야 돼요. 안 그러면 비용 폭탄 맞아요
2. GitHub 계정 생성
   1. github.com
3. VS 코드 설치 및 환경 설정

   1. Visual Studio Code 검색하여 인스톨
   2. 쭉쭉 넘기다가 추가 작업 선택에서 다음과 같이 체크 (권장)

      ![Image](https://github.com/user-attachments/assets/edc1ac56-6e15-4a5e-bb69-75ea12d84e3a)

   3. VS 코드를 열어 왼쪽 메뉴바의 Extension → Korean 검색하여 Korean Language Pack for Visual 인스톨

4. 프론트엔드, 백엔드 레포지토리

   1. 현재 문서 상단에 기재되어 있는 프론트엔드, 백엔드의 깃허브 레포지토리 링크로 각각 접속

      ![Image](https://github.com/user-attachments/assets/5d70b468-3c6c-47d6-ae72-d00f895edbbf)

5. 카카오맵 API 키 발급
   1. 카카오맵 API 접속 : https://apis.map.kakao.com/ → 우측 상단 APP KEY 발급 → 로그인
   2. 상단 메뉴의 내 애플리케이션 → 애플리케이션 추가하기 → 앱 이름 원하는 거, 나머지 아무거나, → 정책 동의 후 저장
   3. 만들어진 앱 들어가서 왼쪽 메뉴바의 플랫폼 → 웹 플랫폼 등록 → 버셀 도메인 주소 붙여넣기 → 저장
      1. 로컬에서도 원한다면 엔터 눌러서 localhost:포트번호
   4. 왼쪽 메뉴바의 앱 권한 신청 → 앱 권한 → 카카오맵 권한 신청
      1. 신청 불필요 뜨면 넘어가기
   5. 왼쪽 메뉴바의 엡 키 → JavaScript 키 복사
6. 원하는 디렉토리에 폴더 만들기
   - 원하는 디렉토리 (바탕화면, 문서 etc.) 에 "icc_motor" 라는 이름의 폴더 만들기
7. 환경변수 및 데이터 포맷 관련 설명은 문서 하단에 기재되어 있습니다.

<br/>
<br/>
<br/>

## 백엔드

서버를 실행시킬 두가지 방법

- 포트포워딩
- AWS EC2

<br/>
<br/>
<br/>

### 포트포워딩 (사설 공유기 있다면 이 방법 추천)

1. git 설치 https://sfida.tistory.com/46
2. node.js 설치 [https://velog.io/@ljs923/Node.js-다운로드-및-설치하기https://velog.io/@ljs923/Node.js-다운로드-및-설치하기](https://velog.io/@ljs923/Node.js-%EB%8B%A4%EC%9A%B4%EB%A1%9C%EB%93%9C-%EB%B0%8F-%EC%84%A4%EC%B9%98%ED%95%98%EA%B8%B0)
3. 터미널 창 열기

   1. 터미널 창 열기
      1. terminal이라고 컴퓨터에 검색 후 뜨는 명령 프롬프트 열기
      2. 검은 바탕에 커서 깜빡거리는 프로그램입니다.
   2. 앞서 만든 icc_motor 폴더의 경로 복사
   3. 이때 복사된 경로를 다음과 같이 변경
      1. "C:\Users\sondh\.ssh" → C:/Users/sondh/.ssh
         - 우클릭 하여 경로로 복사가 아닌, 폴더 주소창을 클릭하여 복사하신 분들은 안 하셔도 돼요. 그게 현재 챕터에서 변경하려는 형식입니다. (C:\Users\sondh\dev_project\source\repos 이런 형태)
      2. 쌍따옴표를 지우고 역슬래시를 슬래시로 바꾸기
   4. 변경된 경로를 복사하여 cd 변경된경로
      1. cd C:/Users/sondh/.ssh
   5. 아래의 명령어를 입력하여 프로젝트 클론

      ```nasm
      git clone 서버레포지토리
      ```

      1. 포크 레포지토리 → 초록색 code 버튼 눌러 바로 뜨는 주소 복사하시면 됩니다. (HTTPS 탭 주소 복사)

   6. VS 코드를 열어 왼쪽 상단의 File → Open Folder → 클론한 프로젝트 폴더 찾아 선택
   7. .env 파일 생성

      1. 이때 생성되는 디렉토리는 프로젝트의 가장 최상위 디렉토리여야 한다.
      2. 때문에 저 폴더들이 나열된 화면의 빈 공간을 클릭하여 어떠한 항목도 선택되지 않게 한 후에 우클릭 → New File → .env 입력
      3. 가장 왼쪽 메뉴들의 모양과 개수는 저와 달라도 상관 없습니다

         ![Image](https://github.com/user-attachments/assets/c0c2292e-e8b8-4e80-8387-2bf34872a436)

4. DynamoDB 연결

   1. VS 코드에서 전에 생성한 .env 파일에 다음과 같이 입력 후 저장

      ```nasm
      DYNAMODB_ACCESS_KEY=액세스키
      DYNAMODB_SECRET_ACCESS_KEY=비밀액세스키
      ```

      ![Image](https://github.com/user-attachments/assets/7cb1e36d-cc4d-46bf-bf46-917e61323a64)

   2. src/services/dynamoDBServices.js 에서 getDynamoDBClient함수의 인자를 'key'로 설정 (작음따옴표까지 그대로)

5. 로컬에서 서버 실행해보기

   1. VS 코드에서 클론한 프로젝트를 연 후, Ctrl + Shift + ` 를 눌러 터미널 열기

   2. npm install 입력하여 의존성 설치

   3. node index.js 입력하여 서버 실행
      ![Image](https://github.com/user-attachments/assets/2cf0aabd-88a8-4767-864b-25f5fcd62c99)
   4. index.js 에 입력된 포트 번호 확인 후 브라우저 주소창에 [localhost:2004/api/](http://localhost:2004/api/) 또는 내부.아이피.주.소:2004/api/ 입력 시 아래 화면이 뜬다면 로컬 환경에서 서버 구동 성공

      ![Image](https://github.com/user-attachments/assets/e9fa765c-4dde-40c2-8f0f-02ed4633a7a7)

      1. 클론한 서버 코드에 기재된 포트 번호는 2004. 변경하여도 무방함.
      2. 내부 IP 주소는 6. 공유기 포트포워딩 → ipconfig 부분에서 IPv4 주소

6. 공유기 포트포워딩

   1. 터미널 창 열기 → ipconfig → 기본 게이트웨이 값 복사 → 브라우저 주소창에 입력 → 공유기 회사마다 정해진 아이디 비밀번호가 있음. 이를 검색하여 찾아 입력 후 로그인

      1. SK 공유기 포트포워딩 이런 식으로 검색하면 됨
      2. 나빌레관 115호 ICC 동방의 경우 시설 관리팀에 문의하여 받아와야 하는 걸로 알아요

      ![Image](https://github.com/user-attachments/assets/41a485ce-a4e7-418c-8bcf-fb1ad2af7ece)

   2. 포트 포워드 또는 포트 포워딩 항목 찾기
      1. 외부 접속 포트 설정
         1. 0~65535 원하는 포트 번호 입력. 주로 3000or8080등의 포트가 쓰임.
      2. ex) 1101 / 1101 → 1101 포트만 포트 포워딩, 1101 / 1103 → 1101 ~ 1103 의 포트 포트 포워딩
      3. 내부 접속 포트 설정
         1. 서버 포트 주소는 현재 2004로 설정되어 있다. 원하는 포트 번호로 바꿔도 무방하다.
      4. 내부 IP 설정
         1. ipconfig → IPv4 주소 입력
      - 간단하게 설명
        - [naver.com](http://naver.com), [google.com](http://google.com) 등의 DNS 주소는 Public IP를 입력하기 쉬운 문자열로 바꾼 것. 실제로는 111.1.1.1:1234 의 외부.아이피.주.소:외부포트 의 구조로 되어 있음.
        - 그리고 이는 해당 프로그램이 구동되고 있는 내부 IP:내부포트 로 연결되어 있음.
        - 예를 들어 내 퍼블릭 아이피 주소가 111.1.1.1이고, 외부 포트 3000 ~ 3003, 내부 포트 2004로 설정 후 포트포워딩을 하였다.
        - 이때 내 컴퓨터에서 내가 2004번 포트에 어떤 프로그램을 실행시킬 때, 누구든지 111.1.1.1:3000~3003을 입력하여 내 프로그램에 접속할 수 있다.
          ![Image](https://github.com/user-attachments/assets/eabc5654-825f-44a7-8231-5c972a7195df)
   3. 완료되었다면 자신의 외부 아이피 주소:외부포트 를 입력하여 로컬에서 실행한 환경과 같은 화면이 뜨는지 확인해보자.

7. 가상의 데이터를 입력하여 DB에 데이터가 정상적으로 들어가는지, 프론트엔드와의 연결은 원활한지 등의 테스트 진행해보면 좋습니다.

<br/>
<br/>
<br/>

---

### AWS EC2에서 구동

1. AWS EC2 인스턴스 생성

   1. AWS EC2 검색
   2. 인스턴스 → 인스턴스 시작
   3. Amazon Linux 또는 Ubuntu 선택

      ![Image](https://github.com/user-attachments/assets/679b38f1-3a9a-4686-8295-611a5054f2bb)

   4. 인스턴스 유형 [t3.mini](http://t3.mini) 이상 추천
      1. t3.micro (프리티어 인스턴스 구동 시 인스턴스 사양 한계치 바로 넘어섬)
         ![image](https://github.com/user-attachments/assets/2b145e2f-5ad9-4d12-af5e-e13db31749e5)
   5. 키페어 생성 후 선택 (키페어 잘 갖고 계세요)
      ![image](https://github.com/user-attachments/assets/b1404ab5-1e59-4cf2-b24b-d6e121221ca7)
   6. 인스턴스 생성
   7. EC2 탄력적 IP 설정
      1. EC2 → 탄력적 IP → 탄력적 IP 주소 할당 → 별다른 설정 없이 할당
      2. 탄력적 IP 페이지에서 생성된 탄력적 IP의 주소를 클릭 → 탄력적 IP 주소 연결 → 이전에 생성한 EC2 인스턴스 선택 → 연결
   8. 생성된 인스턴스의 인스턴스 ID 클릭 → 상단의 연결 클릭 후 SSH 클아이언트

      ![image](https://github.com/user-attachments/assets/58d81d53-2904-4df7-8456-9e55f69439d2)

   9. 이 창 닫지 않고 VS 코드 열기

2. VS 코드에 EC2 SSH 연결하기

   1. VS 코드 왼쪽 메뉴바 → Extensions → Remote Development 설치

      ![image](https://github.com/user-attachments/assets/ce4dfeac-124b-41ca-ad01-71a3e262ef6c)

   2. Ctrl + Shift + ` 눌러 터미널 열기
   3. 키페어 우클릭 후 경로 복사
      1. Ctrl + V 대신 우클릭 사용
   4. 이때 복사된 경로를 다음과 같은 형식으로 변경 후 아래의 명령어 입력
      1. "C:\Users\sondh\.ssh\키페어.pem" → C:/Users/sondh/.ssh

   ```nasm
   cd C:/Users/.ssh/sondh
   chmod 400 키페어.pem
   ```

   1. 이전에 EC2 연결 창으로 이동하여 하단의 예시 복사

      ![image](https://github.com/user-attachments/assets/46e5012f-94e2-4635-b877-4ec0fbb92b3b)

   2. 다시 VS 코드로 돌아와 Ctrl +Shift + p → Add New SSH Host… → 붙여넣기 → 경로 마지막에 \config 되어 있는 거 클릭.

      ![image](https://github.com/user-attachments/assets/12e14f57-eafa-47e9-8a1b-7e49b78adaec)

   3. 우측 하단 알림창의 Open Config 버튼 또는 Ctrl + Shift + p → Open SSH Configuration File...
   4. 다음 설명에 맞게 변경

      1. Host 뒤에는 원하는 이름 아무거나 ex) happy
      2. HostName 뒤에는 인스턴스 ID 클릭했을 때 뜨는 인스턴스 요약 창에서 다음의 것들 중 원하는 것을 선택하여 입력. 순서대로 진행했다면 IPv4 DNS가 입력되어 있을 것임
         1. 퍼블릭 IPv4 주소
         2. 퍼블릭 IPv4 DNS
      3. User 뒤에는 그대로 두거나 자신이 선택한 os에 맞게 변경. ex) ubuntu 선택 시 ubuntu
      4. IdentityFile 뒤에는 키페어 주소
      5. 변경 완료 시 Ctrl + S 저장

         ![Image](https://github.com/user-attachments/assets/aa6d1a39-a9dc-4599-975f-f6de39358a1a)

   5. Ctrl + Shift + p → Connect to Host… → Linux
   6. VS 코드 좌측 하단에 다음과 같이 표시되면 연결 성공

      ![image](https://github.com/user-attachments/assets/30a7259f-121c-4154-a62e-431741ecd409)

3. EC2 설정

   1. node.js 설치

      1. Ctrl + Shift + ` 로 터미널창을 열어 명령어 차례로 입력

         1. Ubuntu 기준 :

            ```nasm
            sudo apt-get update
            sudo apt-get install -y build-essential
            sudo apt-get install curl
            curl -sL https://deb.nodesource.com/setup_16.x | sudo -E bash --
            sudo apt-get install -y nodejs
            sudo apt install npm
            ```

            1. 한번에 복사 후 터미널창에 우클릭하면 됨
            2. Amazon Linux 경우, apt-get 대신 yum 입력

         2. node -v로 설치 완료됐는지 체크 (버전이 뜨면 설치 완료)

   2. 아래의 명령어를 입력하여 프로젝트 클론

      ```nasm
      git clone 서버레포지토리
      ```

      1. 서버 레포지토리 → 초록색 code 버튼 눌러 바로 뜨는 주소 복사하시면 됩니다. git clone 서버주소

   3. ls → 폴더 이름 파악 후 cd 폴더 이름
      1. ex) ls → cd 24_icc_ev
   4. npm i로 모듈 다운로드
   5. touch .env로 .env파일 만들기.
   6. nano .env로 .env 내부 변수 입력하기.
      - Ctrl + O : 저장. Ctrl + X : 종료
   7. node index_role.js 입력 → 백엔드 서버 실행됨.
      1. 서버 끄고 싶으면 Ctrl + C
      2. 이거로 서버 크고 껐다 가능. 디버깅 이거로
   8. npm i pm2 -g
      1. ssh 꺼도 서버 계속 돌아가게 해주는 pm2 모듈 설치
   9. pm2 start 파일명
      1. 현재 EC2 상에서의 프로젝트는 index_role.js 가 서버 실행 파일임
      2. 따라서 pm2 start index_role.js 명령어 입력
      3. 이렇게 되면 EC2 ssh 연결이 끊어져도 EC2 상에서 계속 index_role.js 서버를 돌리게 됨

4. DB 생성 및 연결

   1. AWS DynamoDB → 테이블 생성 → 테이블 이름 및 파티션 키 설정 후 테이블 생성

      ![image](https://github.com/user-attachments/assets/aae4b0e0-c1e8-4a6e-9b65-a898801e3f5d)

      ![image](https://github.com/user-attachments/assets/431025f1-4145-4fdb-93fa-129bba61ad48)

   2. AWS IAM → 역할 → 역할 생성 → 엔티티 유형 : AWS 서비스, 사용 사례 : EC2 선택 후 다음 → AmazonDynamoDBFullAccess 선택 후 다음 → 역할 이름 입력 후 역할 생성
   3. AWS EC2 → 이전에 생성했던 서버용 인스턴스 진입
   4. 작업 → 보안 → IAM 역할 수정 → 직전에 생성했던 IAM 역할 선택 후 IAM 역할 업데이트
      1. 만약 EC2가 아닌 개인 노트북 등에서 DynamoDB를 연결하고 싶은 경우 포트포워딩에서의 DynamoDB 설정 참고
   5. src/services/dynamoDBServices.js 에서 getDynamoDBClient함수의 인자를 'role'로 설정 (작음따옴표까지 그대로)

5. 프론트엔드와의 연결은 원활한지 등의 테스트 진행해보면 좋습니다.
   - 위에 서버 모드에 관한 설명 기재되어 있음.

### 여기까지 완료했고, 클라이언트가 포트포워딩 또는 AWS EC2까지 완료했다면

1.  클라이언트 주소가 정해졌을 겁니다 .env파일의 CLIENT_URL=클라이언트주소 로 교체
    - (클라이언트 주소 -----> Vercel or 포트포워딩으로 도메인 or 퍼블릭 IP:포트. 도메인 : naver.com 같은 주소 / 퍼블릭 IP : 111.xxx.xxx.xxx 등의 IP. 가장 앞이 10, 172, 16이 아닌 모든 IP)
    - CLIENT_URL=http://test.com/ 또는 CLIENT_URL=http://123.123.123.123:2004
2.  실행해보기. (클라이언트도 동일 부분 설명 찾아서 클라이언트 주소 세팅)

### 클라이언트가 Vercel로 배포했을 경우 (중요!!!!!!!!!!!!!!!!!!!!)

1.

## 정상 실행된다면 끝입니다.

# 기타

<br/>

## .env 파일 구조 설명

- .env파일은 보안 상의 이유로 github에 올라가 있지 않습니다. 때문에 앞으로의 설명에 따라 .env을 만들어 변수를 만들어 값을 직접 입력해주셔야 합니다.
- 이때, 서버와 클라이언트 각각 envConfig.js 파일이 존재합니다. 이 파일에서의 키값이 .env의 변수명입니다.
- .env파일을 루트 디렉토리에 만든 후, 키=밸류 로 설정해주시기 바랍니다.
  - envConfig에서 PORT: process.env.PORT || 2004 -> .env에서 PORT=2004 이런 식으로 변경하기.

<br/>

### 서버

- DYNAMODB_ACCESS_KEY : 다이나모디비 엑세스 키. 밑에 설명 있음.
- DYNAMODB_SECRET_ACCESS_KEY : 다이나모디비 비밀 액세스 키. 밑에 설명 있음.
- PORT : 현재 서버는 2004번 포트가 기본으로 설정되어 있음. 바꾸어도 무방하나, 혹시 모를 오류를 생각하여 바꾸지 않는 것을 권장함.
- SERVER_MODE : development, test, production 세가지 모드가 있음.
  - development : 개발 모드. ESP32에서 데이터를 받아오지 않고, 서버에서 가상 더미 데이터를 만들어 클라이언트에 보내며 통신함. 이땐 DynamoDB에 데이터를 올리지 않음.
  - production : 배포 모드. ESP32와 통신함. development 모드와 달리, 가상 더미 데이터를 만들지 않고, ESP32에서 받는 데이터를 처리함. 이땐 DynamoDB에 데이터를 올림.
- CONTROLLER_VERSION : 현재 24, 25 버전 두가지가 있음. 데이터 포맷 형식에 직접 쓰이는 변수임.
- CLIENT_URL : 클라이언트 주소. 기본적으로는 http://localhost:1101로 되어 있음. 이는 개발이나 테스트 시에 쓰일 로컬 환경에서의 테스트 주소. 밑에 설명된 것과 같이, 서버와 클라이언트 모두 외부에서 접근 가능한 주소가 정해졌다면, 이를 그 주소로 변경해야 함.

- <img width="336" height="147" alt="Image" src="https://github.com/user-attachments/assets/4fd1c41e-d896-48b5-b319-56dba76d987c" />
- <img width="712" height="313" alt="Image" src="https://github.com/user-attachments/assets/78e9cc8b-1d9d-4580-89a8-a96d8abc3a58" />

### 클라이언트

클라이언트는 .env에 추가할 떄 VITE\_ 붙이기.

- envConfig의 PORT -> .env의 VITE_PORT

<br/>

- VITE_SERVER_URL : 서버 주소. 기본적으로는 http://localhost:2004로 되어 있음. 이는 개발이나 테스트 시에 쓰일 로컬 환경에서의 테스트 주소. 밑에 설명된 것과 같이, 서버와 클라이언트 모두 외부에서 접근 가능한 주소가 정해졌다면, 이를 그 주소로 변경해야 함.
- VITE_KAKAO_MAP_API_KEY : 카카오맵 API 키. 밑에 설명 있음.
- VITE_CONTROLLER_VERSION : 현재 24, 25 버전 두가지가 있음. 데이터 포맷 형식에 직접 쓰이는 변수임.
- VITE_PORT : 현재 클라이언트는 1101번 포트가 기본으로 설정되어 있음. 바꾸어도 무방하나, 혹시 모를 오류를 생각하여 바꾸지 않는 것을 권장함.

  - <img width="438" height="155" alt="Image" src="https://github.com/user-attachments/assets/3520139d-87f9-4f41-aa0a-d908d59168b0" />
  - <img width="898" height="342" alt="Image" src="https://github.com/user-attachments/assets/1d75ccd8-e065-4cf4-aeb1-777189fd2ff1" />

<br/>
<br/>
<br/>

## 데이터 포맷

<br/>
<br/>
<br/>

### 서버

서버 데이터 포맷입니다.

- constants 디렉토리의 dataFormat.js
- JSON 형식
  24, 25 키를 가진 객체 내부에 컨트롤러 버전 별 데이터가 있음.

- 만약 현재 25년도 컨트롤러 버전의 데이터를 추가하거나 삭제, 값의 변경이 필요하다면 여기서 찾아서 변경하면 됨.
- 다만 이에 맞게 클라이언트쪽 코드도 수정해야 함.

```
// 데이터 파싱 함수 관련
const dataFormat = {
  // 24년도 컨트롤러
  24: {
    RPM: null,
    MOTOR_CURRENT: null,
    BATTERY_VOLTAGE: null,
    THROTTLE_SIGNAL: null,
    CONTROLLER_TEMPERATURE: null,
    SPEED: null,
    BATTERY_PERCENT: null,
  },
  // 25년도 컨트롤러
  25: {
    // Controller L
    Motor_temp_L: null,
    Controller_temp_L: null,
    Current_L: null,
    Voltage_L: null,
    Power_L: null,
    RPM_L: null,
    Torque_L: null,
    Torque_cmd_L: null,
    // Controller_R
    Motor_temp_R: null,
    Controller_temp_R: null,
    Current_R: null,
    Voltage_R: null,
    Power_R: null,
    RPM_R: null,
    Torque_R: null,
    Torque_cmd_R: null,
    // Car_State
    ADC_Signal: null,
    Speed: null,
    Yaw_Rate: null,
    Steering_angle: null,
    Batt_percent: null,
    Total_power: null,
    Delta_T: null,
  },
};

module.exports = dataFormat;
```

<br/>
<br/>
<br/>

### 클라이언트

클라이언트 데이터 포맷입니다.

- constants 디렉토리의 dataFormat.js
- JSON 형식
  24, 25 키를 가진 객체 내부에 컨트롤러 버전 별 데이터가 있음.

- 만약 현재 25년도 컨트롤러 버전의 데이터를 추가하거나 삭제, 값의 변경이 필요하다면 여기서 찾아서 변경하면 됨.
- 다만 이에 맞게 서버쪽 코드도 수정해야 함.

```
const dataFormat = {
  // 24년도 컨트롤러
  24: {
    timestamp: null,
    vehicle: {
      SPEED: {
        label: '속도',
        value: null,
        unit: 'km/h'
      }
    },
    hv: {
      BATTERY_VOLTAGE: {
        label: '전압',
        value: null,
        unit: 'V'
      },
      MOTOR_CURRENT: {
        label: '전류',
        value: null,
        unit: 'A'
      },
      BATTERY_PERCENT: {
        label: '배터리 잔량',
        value: null,
        unit: '%'
      }
    },
    motor: {
      RPM: {
        label: 'RPM',
        value: null,
        unit: 'RPM'
      },
      THROTTLE_SIGNAL: {
        label: 'Throttle',
        value: null,
        unit: '/ 255'
      },
      CONTROLLER_TEMPERATURE: {
        label: '컨트롤러 온도',
        value: null,
        unit: '℃'
      }
    },
    gps: {
      lat: {
        label: '위도',
        value: null,
        unit: '°'
      },
      lng: {
        label: '경도',
        value: null,
        unit: '°'
      }
    }
  },
  // 25년도 컨트롤러
  25: {
    timestamp: null,
    vehicle: {
      Speed: {
        label: '속도',
        value: null,
        unit: 'km/h'
      },
      ADC_Signal: {
        label: 'ADC 신호',
        value: null,
        unit: ''
      },
      Yaw_Rate: {
        label: '요 속도',
        value: null,
        unit: '°/s'
      },
      Steering_angle: {
        label: '조향각',
        value: null,
        unit: '°'
      },
      Batt_percent: {
        label: '배터리 잔량',
        value: null,
        unit: 'km/h'
      },
      Total_power: {
        label: '총 출력',
        value: null,
        unit: 'W'
      },
      Delta_T: {
        label: '샘플링 타임',
        value: null,
        unit: 's'
      }
    },
    hv: {
      Current: {
        label: '전류',
        value: null,
        unit: 'A'
      },
      Voltage: {
        label: '전압',
        value: null,
        unit: 'V'
      }
    },
    motor: {
      Motor_temp: {
        label: '모터 온도',
        value: null,
        unit: '℃'
      },
      Controller_temp: {
        label: '컨트롤러 온도',
        value: null,
        unit: '℃'
      },
      Power: {
        label: '출력',
        value: null,
        unit: 'W'
      },
      RPM: {
        label: 'RPM',
        value: null,
        unit: 'RPM'
      },
      Torque: {
        label: '토크',
        value: null,
        unit: 'Nm'
      },
      Torque_cmd: {
        label: '토크 커맨드',
        value: null,
        unit: 'Nm'
      }
    },
    gps: {
      lat: {
        label: '위도',
        value: null,
        unit: '°'
      },
      lng: {
        label: '경도',
        value: null,
        unit: '°'
      }
    }
  }
};

export default dataFormat;

```
