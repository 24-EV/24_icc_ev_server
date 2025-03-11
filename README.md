# 24 INHA EV 데이터 로깅 앱 사용법  



### 완성도를 높이기 위하여 조금씩 수정 예정입니다. 업데이트 날짜 확인하여 이전의 코드, 방식과의 차이점 파악 후 진행해주세요.

### 깃허브 레포지토리 주소

https://github.com/nitepp04/24_icc_ev_client

https://github.com/nitepp04/24_icc_ev_server

## 주요 기능

- 차량의 컨트롤러 및 모듈에서 오는 데이터 값을 시각화
    - 현재 받는 데이터
        - timestamp
            - Real TIme Clock 모듈
            - 당시 RTC 모듈 고장으로 인하여 서버의 시간으로 대체함
            - 복구 원할 시 서버 코드 수정 필요
        - RPM
        - MOTOR_CURRENT
        - BATTERY_VOLTAGE
        - THROTTLE_SIGNAL
        - CONTROLLER_TEMPERATURE
        - SPEED
            - 클라이언트에선 velocity라는 키값으로 사용됨
        - BATTERY_PERCENT
        - lat, lng
            - GPS 모듈 고장
            - 클라이언트 코드에는 구현되어 있으나, 서버 코드에서 삭제함.
            - 복구 원할 시 서버 코드 수정 필요
- 차량 현재 위치 시각화
    - 카카오맵 API를 통하여 차량의 현재 위치를 시각화한다.
- Excel 데이터 다운로드
    - 원하는 시간대의 데이터를 DB에서 불러와 액셀 파일로 다운로드



## 용어 정리

- JavaScript : 프로그래밍 언어
- React : JavaScript 기반 UI 라이브러리
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

프로그램 개선을 원할 때, 어떠한 용어가 있는지 알면 도움이 될 거라 생각하여 검색하기 난감할 것 같은 용어들 몇개만 짧게 적어둡니다.



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
        
    4. VS 코드를 열어 왼쪽 메뉴바의 Extension → Korean 검색하여 Korean Language Pack for Visual 인스톨
4. 프론트엔드, 백엔드 레포지토리 포크
    1. 현재 문서 상단에 기재되어 있는 프론트엔드, 백엔드의 깃허브 레포지토리 링크로 각각 접속 → 우측 상단의 Fork 버튼 클릭
        
        ![Image](https://github.com/user-attachments/assets/5d70b468-3c6c-47d6-ae72-d00f895edbbf)
        
    2. Owner : 자신 계정, Repository name : 원하는 대로
        
        ![Image](https://github.com/user-attachments/assets/764a0d09-5010-47f1-bfcc-c2e1e4bc7bda)
        
    3. 자신의 깃허브 레포지토리에 포크된 레포지토리가 잘 생성되었나 체크
    

### 포트포워딩 (사설 공유기 있다면 이 방법 추천)

1. git 설치 https://sfida.tistory.com/46
2. node.js 설치 [https://velog.io/@ljs923/Node.js-다운로드-및-설치하기https://velog.io/@ljs923/Node.js-다운로드-및-설치하기](https://velog.io/@ljs923/Node.js-%EB%8B%A4%EC%9A%B4%EB%A1%9C%EB%93%9C-%EB%B0%8F-%EC%84%A4%EC%B9%98%ED%95%98%EA%B8%B0)
3. 터미널 창 열기
    1. 터미널 창 열기
        1. terminal이라고 컴퓨터에 검색 후 뜨는 명령 프롬프트 열기
        2. 검은 바탕에 커서 깜빡거리는 프로그램입니다.
    2. 컴퓨터에 자신이 원하는 디렉토리에 폴더 생성 후 경로 복사
        1. 바탕화면에 “25ev서버들어올자리” 라는 폴더 만든 후 우클릭하여 경로로 복사
    3. 이때 복사된 경로를 다음과 같이 변경 
        1. "C:\Users\sondh\.ssh” → C:/Users/sondh/.ssh
        2. 쌍따옴표를 지우고 역슬래시를 슬래시로 바꾸기
    4. 변경된 경로를 복사하여 cd 변경된경로
        1. ex) cd C:/Users/sondh/.ssh
    5. 아래의 명령어를 입력하여 프로젝트 클론
        
        ```nasm
        git clone 포크한레포지토리
        ```
        
        1. 포크 레포지토리 → 초록색 code 버튼 눌러 바로 뜨는 주소 복사하시면 됩니다.
    6. VS 코드를 열어 왼쪽 상단의 File → Open Folder → 클론한 프로젝트 폴더 찾아 선택
    7. .env 파일 생성
        1. 이때 생성되는 디렉토리는 프로젝트의 가장 최상위 디렉토리여야 한다.
        2. 때문에 저 폴더들이 나열된 화면의 빈 공간을 클릭하여 어떠한 항목도 선택되지 않게 한 후에 우클릭 → New File → .env 입력
        3. 가장 왼쪽 메뉴들의 모양과 개수는 저와 달라도 상관 없습니다
            
            ![Image](https://github.com/user-attachments/assets/c0c2292e-e8b8-4e80-8387-2bf34872a436)
            
4. DynamoDB 연결
    1. AWS DynamoDB → 테이블 생성 → 테이블 이름 및 파티션 키 설정 후 테이블 생성
        
        ![Image](https://github.com/user-attachments/assets/caa70f59-b5e4-473e-a662-5e3402c1dd84)
        
        ![image.png](attachment:99ef6fcb-7a98-4f1e-a893-334b351dbae3:image.png)
       ![Image](https://github.com/user-attachments/assets/267127c2-1814-49ec-ad2c-72bafcf5a84b)
        
    3. 사용자 → 사용자 생성 → 이름 입력 후 다음
    4. 직접 정책 연결 → AmazonDynamoDBFullAccess 선택 후 다음 → 사용자 생성
        
       ![image](https://github.com/user-attachments/assets/1f70c348-7c46-4c93-91e5-53533b4c8758)

        
    5. 생성된 사용자 클릭 후 액세스 키 만들기 → 사용 사례 아무거나 선택 후 및에 동의 후 다음 → 입력 없이 액세스 키 만들기
        
       ![image](https://github.com/user-attachments/assets/a32ef3c7-2a17-4b44-852b-6a6e57f41bf9)

        
    7. 생성된 액세스 키, 비밀 액세스 키 복사 후 .csv 파일 다운로드하기. (다시 찾을 수 없기에 잃어 버리면 안 됨. 잃어버리면 새 사용자 만들어야 함.)
    8. VS 코드에서 전에 생성한 .env 파일에 다음과 같이 입력 후 저장
        
        ```nasm
        DYNAMODB_ACCESS_KEY=액세스키
        DYNAMODB_SECRET_ACCESS_KEY=비밀액세스키
        ```
        
       ![image](https://github.com/user-attachments/assets/088f9537-fde2-46d0-bfa0-7fd53cca89db)

        
5. 로컬에서 서버 실행해보기
    1. VS 코드에서 클론한 프로젝트를 연 후, Ctrl + Shift + ` 를 눌러 터미널 열기
    2. node index.js 입력하여 서버 실행
        
       ![image](https://github.com/user-attachments/assets/fe2ba544-b447-4d50-957c-2e207daafa22)

        
    4. index.js 에 입력된 포트 번호 확인 후 브라우저 주소창에 [localhost:2004](http://localhost:2004) 또는 내부.아이피.주.소:2004 입력 시 아래 화면이 뜬다면 로컬 환경에서 서버 구동 성공
        
       ![image](https://github.com/user-attachments/assets/9bc29eae-5b67-4d1f-9a3e-114758de5a8f)

        
        1. 클론한 서버 코드에 기재된 포트 번호는 2004. 변경하여도 무방함.
        2. 내부 IP 주소는 6. 공유기 포트포워딩 → ipconfig 부분에서 IPv4 주소
6. 공유기 포트포워딩
    1. 터미널 창 열기 → ipconfig → 기본 게이트웨이 값 복사 → 브라우저 주소창에 입력 → 공유기 회사마다 정해진 아이디 비밀번호가 있음. 이를 검색하여 찾아 입력 후 로그인
        1. SK 공유기 포트포워딩 이런 식으로 검색하면 됨
        2. 나빌레관 115호 ICC 동방의 경우 시설 관리팀에 문의하여 받아와야 하는 걸로 알아요
        
        ![image](https://github.com/user-attachments/assets/d0c41248-6ce2-4081-a7f4-708d10689913)

        
    3. 포트 포워드 또는 포트 포워딩 항목 찾기
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
                
                ![image](https://github.com/user-attachments/assets/88a1b1ee-1f61-49c7-a3a5-a280a339e6ee)

                
    4. 완료되었다면 자신의 외부 아이피 주소:외부포트 를 입력하여 로컬에서 실행한 환경과 같은 화면이 뜨는지 확인해보자.
7. 가상의 데이터를 입력하여 DB에 데이터가 정상적으로 들어가는지, 프론트엔드와의 연결은 원활한지 등의 테스트 진행해보면 좋습니다.

### AWS EC2에서 구동

1. AWS EC2 인스턴스 생성
    1. AWS EC2 검색
    2. 인스턴스 → 인스턴스 시작
    3. Amazon Linux 또는 Ubuntu 선택
        
        ![image](https://github.com/user-attachments/assets/8b6126d9-c4ee-44e2-889e-ff83eec9d34d)

    5. 인스턴스 유형 [t3.mini](http://t3.mini) 이상 추천 
        1. t3.micro (프리티어 인스턴스 구동 시 인스턴스 사양 한계치 바로 넘어섬)
        
       ![image](https://github.com/user-attachments/assets/2b145e2f-5ad9-4d12-af5e-e13db31749e5)
        
    7. 키페어 생성 후 선택 (키페어 잘 갖고 계세요)
        
       ![image](https://github.com/user-attachments/assets/b1404ab5-1e59-4cf2-b24b-d6e121221ca7)

        
    9. 인스턴스 생성
    10. EC2 탄력적 IP 설정
        1. EC2 → 탄력적 IP → 탄력적 IP 주소 할당 → 별다른 설정 없이 할당
        2. 탄력적 IP 페이지에서 생성된 탄력적 IP의 주소를 클릭 → 탄력적 IP 주소 연결 → 이전에 생성한 EC2 인스턴스 선택 → 연결
    11. 생성된 인스턴스의 인스턴스 ID 클릭 → 상단의 연결 클릭 후 SSH 클아이언트
        
        ![image](https://github.com/user-attachments/assets/58d81d53-2904-4df7-8456-9e55f69439d2)

        
    13. 이 창 닫지 않고 VS 코드 열기
2. VS 코드에 EC2 SSH 연결하기
    1. VS 코드 왼쪽 메뉴바 → Extensions  → Remote Development 설치
        
        ![image](https://github.com/user-attachments/assets/ce4dfeac-124b-41ca-ad01-71a3e262ef6c)

        
    3. Ctrl + Shift + ` 눌러 터미널 열기
    4. 키페어 우클릭 후 경로 복사
        1. Ctrl + V 대신 우클릭 사용
    5. 이때 복사된 경로를 다음과 같은 형식으로 변경 후 아래의 명령어 입력
        1. "C:\Users\sondh\.ssh\키페어.pem” → C:/Users/sondh/.ssh
    
    ```nasm
    cd C:/Users/.ssh/sondh
    chmod 400 키페어.pem
    ```
    
    1. 이전에 EC2 연결 창으로 이동하여 하단의 예시 복사
        
        ![image](https://github.com/user-attachments/assets/46e5012f-94e2-4635-b877-4ec0fbb92b3b)

        
    3. 다시 VS 코드로 돌아와 Ctrl +Shift + p → Add New SSH Host… → 붙여넣기 → 경로 마지막에 \config 되어 있는 거 클릭.
        
        ![image](https://github.com/user-attachments/assets/12e14f57-eafa-47e9-8a1b-7e49b78adaec)

        
    5. 우측 하단 알림창의 Open Config 버튼 또는 Ctrl + Shift + p → Open SSH Configuration File...
    6. 다음 설명에 맞게 변경
        1. Host 뒤에는 원하는 이름 아무거나 ex) happy
        2. HostName 뒤에는 인스턴스 ID 클릭했을 때 뜨는 인스턴스 요약 창에서 다음의 것들 중 원하는 것을 선택하여 입력.  순서대로 진행했다면 IPv4 DNS가 입력되어 있을 것임
            1. 퍼블릭 IPv4 주소
            2. 퍼블릭 IPv4 DNS
        3. User 뒤에는 그대로 두거나 자신이 선택한 os에 맞게 변경. ex) ubuntu 선택 시 ubuntu
        4. IdentityFile 뒤에는 키페어 주소
        5. 변경 완료 시 Ctrl + S 저장
            
            ![image](https://github.com/user-attachments/assets/505eb8ed-7b4b-4e69-844a-b6ebe999a7ac)

            
    7. Ctrl + Shift + p → Connect to Host… → Linux
    8. VS 코드 좌측 하단에 다음과 같이 표시되면 연결 성공
        
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
        git clone 포크한레포지토리
        ```
        
        1. 포크 레포지토리 → 초록색 code 버튼 눌러 바로 뜨는 주소 복사하시면 됩니다.git clone 아까 fork 한 또는 주소
    3. ls → 폴더 이름 파악 후 cd 폴더 이름
        1. ex) ls → cd 24_icc_ev
    4. npm i로 모듈 다운로드
    5. node index_role.js 입력 → 백엔드 서버 실행됨.
        1. 서버 끄고 싶으면 Ctrl + C
        2. 이거로 서버 크고 껐다 가능. 디버깅 이거로
    6. npm i pm2 -g
        1. ssh 꺼도 서버 계속 돌아가게 해주는 pm2 모듈 설치
    7. pm2 start 파일명
        1. 현재 EC2 상에서의 프로젝트는 index_role.js 가 서버 실행 파일임
        2. 따라서 pm2 start index_role.js 명령어 입력
        3. 이렇게 되면 EC2 ssh 연결이 끊어져도 EC2 상에서 계속 index_role.js 서버를 돌리게 됨
4. DB 생성 및 연결
    1. AWS DynamoDB → 테이블 생성 → 테이블 이름 및 파티션 키 설정 후 테이블 생성
        
        ![image](https://github.com/user-attachments/assets/aae4b0e0-c1e8-4a6e-9b65-a898801e3f5d)

        
        ![image](https://github.com/user-attachments/assets/431025f1-4145-4fdb-93fa-129bba61ad48)

        
    3. AWS IAM → 역할 → 역할 생성 → 엔티티 유형 : AWS 서비스, 사용 사례 : EC2 선택 후 다음 → AmazonDynamoDBFullAccess 선택 후 다음 → 역할 이름 입력 후 역할 생성
    4. AWS EC2 → 이전에 생성했던 서버용 인스턴스 진입
    5. 작업 → 보안 → IAM 역할 수정 →  직전에 생성했던 IAM 역할 선택 후 IAM 역할 업데이트
        1. 만약 EC2가 아닌 개인 노트북 등에서 DynamoDB를 연결하고 싶은 경우 포트포워딩에서의 DynamoDB 설정 참고
5. 가상의 데이터를 입력하여 DB에 데이터가 정상적으로 들어가는지, 프론트엔드와의 연결은 원활한지 등의 테스트 진행해보면 좋습니다.

---

### 프론트엔드

1. Vercel 배포
    1.  [Vercel.com](http://Vercel.com) 가입 후 Add New Project
    2. Import Git Repository
    3. Continue with GitHub → Import Git Repository → 포크한 레포지토리 선택 → Import
        
        ![image](https://github.com/user-attachments/assets/6f613039-7a24-486c-a57a-930b10b3f3b3)

        
    5. 원하는 프로젝트 명 입력, Framework Preset → Create React App 선택 → Deploy
        
       ![image](https://github.com/user-attachments/assets/e1cb14b4-94b4-4885-a81f-2534003a732d)

        
    7. 배포 완료
        1. Domains의 주소들이 배포된 프론트엔드 주소임
        
        ![image](https://github.com/user-attachments/assets/b36e2046-ee4a-45bb-b8c9-1166da900471)

        
2. 카카오맵 API 키 발급
    1. 카카오맵 API 접속 : https://apis.map.kakao.com/ → 우측 상단 APP KEY 발급 → 로그인
    2. 상단 메뉴의 내 애플리케이션 → 애플리케이션 추가하기 → 앱 이름 원하는 거, 나머지 아무거나, → 정책 동의 후 저장
    3. 만들어진 앱 들어가서 왼쪽 메뉴바의 플랫폼 → 웹 플랫폼 등록 → 버셀 도메인 주소 붙여넣기 → 저장
        1. 로컬에서도 원한다면 엔터 눌러서 localhost:포트번호
    4. 왼쪽 메뉴바의 앱 권한 신청 → 앱 권한 → 카카오맵 권한 신청
        1. 신청 불필요 뜨면 넘어가기
    5. 왼쪽 메뉴바의 엡 키 → JavaScript 키 복사
3. 버셀 환경변수 설정
    1. 버셀에서 이전에 배포한 프로젝트로 들어와 상단의 Settings → Environment Variables → Key - Value 항목에 다음과 같이 입력
        
        ```nasm
        KEY | VALUE
        REACT_APP_KAKAO | 앱 키 입력
        REACT_APP_SERVER_URL | 서버 주소 입력
        ```
        
        ![image](https://github.com/user-attachments/assets/8c894b38-8b28-445d-9d9b-a32741dad5c3)

        
    3. KEY 값은 임의로 바꾸면 안 됨. 바꾸려면 코드를 수정해야 함.
    4. 정상 동작하는지 확인
