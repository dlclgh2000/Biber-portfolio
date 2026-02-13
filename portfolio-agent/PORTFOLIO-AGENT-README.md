# 포트폴리오 관리 에이전트 📋

포트폴리오 프로젝트를 자동으로 관리하고 HTML을 생성하는 CLI 도구입니다.

## 🚀 빠른 시작

```bash
# 프로젝트 목록 보기
node portfolio-manager.js list

# 새 프로젝트 추가
node portfolio-manager.js add

# HTML 생성/업데이트
node portfolio-manager.js generate
```

## 📖 사용 가이드

### 1. 프로젝트 목록 보기
```bash
node portfolio-manager.js list
```

현재 등록된 모든 프로젝트를 순서대로 보여줍니다.

### 2. 새 프로젝트 추가
```bash
node portfolio-manager.js add
```

대화형 인터페이스로 새 프로젝트를 추가합니다.
- 프로젝트 ID (고유 식별자)
- 제목
- 부제목
- 날짜
- 썸네일 이미지 경로
- 상세 페이지 링크
- 슬라이더 포함 여부

### 3. 프로젝트 수정
```bash
node portfolio-manager.js edit <project-id>
```

예시:
```bash
node portfolio-manager.js edit podo-tutor
```

### 4. 프로젝트 삭제
```bash
node portfolio-manager.js delete <project-id>
```

예시:
```bash
node portfolio-manager.js delete podo-tutor
```

### 5. HTML 생성
```bash
node portfolio-manager.js generate
```

`projects-data.json` 파일을 기반으로 `index.html`을 자동으로 업데이트합니다.
- 기존 `index.html`은 자동으로 백업됩니다
- 슬라이더와 프로젝트 그리드가 모두 업데이트됩니다

## 📁 파일 구조

```
Biber-portfolio/
├── projects-data.json          # 프로젝트 데이터 (JSON)
├── portfolio-manager.js        # 관리 도구 스크립트
├── index.html                  # 메인 페이지
└── PORTFOLIO-AGENT-README.md   # 이 파일
```

## 🎯 데이터 구조

`projects-data.json` 파일의 각 프로젝트는 다음 구조를 가집니다:

```json
{
  "id": "my-project",
  "order": 0,
  "title": "프로젝트 제목",
  "subtitle": "프로젝트 부제목",
  "date": "Updates 13 February 2026",
  "thumbnail": "img/thumb-project.png",
  "link": "detail-project.html",
  "inSlider": true,
  "sliderImage": "img/slider-project.png"
}
```

## ⚡ 워크플로우 예시

1. **새 프로젝트 추가**
   ```bash
   node portfolio-manager.js add
   # 대화형으로 정보 입력
   ```

2. **데이터 확인**
   ```bash
   node portfolio-manager.js list
   ```

3. **HTML 업데이트**
   ```bash
   node portfolio-manager.js generate
   ```

4. **결과 확인**
   - 브라우저에서 `index.html` 열기
   - 백업 파일 확인: `index.backup.[timestamp].html`

## 💡 팁

- 프로젝트를 추가/수정/삭제한 후에는 항상 `generate` 명령으로 HTML을 업데이트하세요
- HTML 생성 시 자동으로 백업이 생성되므로 안전합니다
- `projects-data.json` 파일을 직접 수정할 수도 있습니다
- 슬라이더에 표시할 프로젝트는 `inSlider: true`로 설정하세요

## 🔧 문제 해결

**Q: "프로젝트를 찾을 수 없습니다" 오류가 발생해요**
- `node portfolio-manager.js list`로 정확한 project-id를 확인하세요

**Q: HTML이 깨졌어요**
- `index.backup.[timestamp].html` 백업 파일을 `index.html`로 복원하세요

**Q: 프로젝트 순서를 바꾸고 싶어요**
- `projects-data.json` 파일에서 `order` 값을 직접 수정한 후 `generate`를 실행하세요
