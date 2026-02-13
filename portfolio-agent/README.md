# 🤖 Portfolio Agent

AI 기반 포트폴리오 자동 생성 에이전트

## 🚀 빠른 시작

```bash
# 1. 이 폴더로 이동
cd portfolio-agent

# 2. AI 포트폴리오 생성
node create-portfolio.mjs
```

## 📁 파일 구조

```
portfolio-agent/
├── create-portfolio.mjs          # 🌟 메인 실행 파일 (AI 기반)
├── portfolio-manager.js          # 수동 관리 도구
├── smart-portfolio-agent.js      # 고급 에이전트
├── ai-portfolio-generator.mjs    # AI 생성기
│
├── COMPLETE-GUIDE.md             # 📚 완전 가이드
├── AI-PORTFOLIO-README.md        # AI 사용법
├── PORTFOLIO-AGENT-README.md     # 기본 사용법
└── README.md                     # 이 파일
```

## 🎯 주요 기능

### 1. AI 포트폴리오 생성 (추천)

```bash
node create-portfolio.mjs
```

- 피그마 링크 자동 분석
- 시니어 디자이너 수준 작성
- HTML 자동 생성
- 데이터베이스 자동 업데이트

### 2. 수동 프로젝트 관리

```bash
# 프로젝트 목록
node portfolio-manager.js list

# 프로젝트 추가
node portfolio-manager.js add

# 프로젝트 수정
node portfolio-manager.js edit <project-id>

# 프로젝트 삭제
node portfolio-manager.js delete <project-id>

# HTML 생성
node portfolio-manager.js generate
```

## 📖 사용 예시

### AI 기반 생성 (5분)

```bash
$ node create-portfolio.mjs

프로젝트 ID: my-app
제목: My Awesome App
부제목: 혁신적인 모바일 앱
Figma: https://figma.com/file/...
설명: [프로젝트 설명]
...

# 출력된 메시지를 Claude에게 전달
# → 자동으로 전문 포트폴리오 생성!
```

### 수동 관리 (전통적 방식)

```bash
$ node portfolio-manager.js add
# 정보 입력...

$ node portfolio-manager.js generate
# HTML 생성
```

## 🎨 생성 결과

AI 에이전트가 생성하는 것:
- ✅ `detail-{project-id}.html` - 상세 페이지
- ✅ `projects-data.json` 업데이트
- ✅ `index.html` 업데이트
- ✅ `portfolio-request-{id}.json` - 설정 파일

## 📚 문서

- **COMPLETE-GUIDE.md** - 전체 가이드 (시작은 여기서!)
- **AI-PORTFOLIO-README.md** - AI 기능 상세 설명
- **PORTFOLIO-AGENT-README.md** - 수동 도구 설명

## 💡 팁

### 빠르게 시작하려면
1. `COMPLETE-GUIDE.md` 읽기 (5분)
2. `node create-portfolio.mjs` 실행
3. Claude에게 메시지 전달

### 문제 해결
- 에이전트 파일이 상위 폴더의 `projects-data.json`을 자동으로 찾습니다
- 생성된 HTML은 상위 폴더에 저장됩니다
- 이미지 경로는 상위 폴더 기준입니다 (예: `img/thumb.png`)

## 🔗 상위 폴더와의 관계

```
Biber-portfolio/              ← 프로젝트 루트
├── portfolio-agent/          ← 에이전트 폴더 (현재 위치)
│   ├── create-portfolio.mjs
│   └── ...
├── projects-data.json        ← 데이터 (상위 폴더)
├── index.html                ← 메인 페이지 (상위 폴더)
├── detail-*.html             ← 생성된 페이지 (상위 폴더)
└── img/                      ← 이미지 (상위 폴더)
```

## 🎯 추천 워크플로우

```bash
# 1. AI 포트폴리오 생성
cd portfolio-agent
node create-portfolio.mjs

# 2. Claude에게 요청
# (출력된 메시지 복사 & 붙여넣기)

# 3. 결과 확인
cd ..
open detail-{project-id}.html
open index.html

# 4. 필요시 수정
cd portfolio-agent
node portfolio-manager.js edit {project-id}
node portfolio-manager.js generate
```

---

**Made with ❤️ and AI**
