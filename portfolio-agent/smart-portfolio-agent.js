#!/usr/bin/env node

/**
 * Smart Portfolio Agent
 * 피그마 링크와 프로젝트 설명을 받아 시니어 프로덕트 디자이너 수준의 포트폴리오를 자동 생성
 *
 * 사용법: node smart-portfolio-agent.js
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { execSync } = require('child_process');

// 상위 폴더의 파일들을 참조
const ROOT_DIR = path.join(__dirname, '..');
const DATA_FILE = path.join(ROOT_DIR, 'projects-data.json');
const TEMPLATE_DIR = 'templates';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function question(query) {
    return new Promise(resolve => rl.question(query, resolve));
}

function loadProjects() {
    if (!fs.existsSync(DATA_FILE)) {
        return { projects: [] };
    }
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
}

function saveProjects(data) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
}

// 프로젝트 분석을 위한 프롬프트 생성
function generateAnalysisPrompt(projectInfo) {
    return `당신은 10년 이상 경력의 시니어 프로덕트 디자이너입니다. 아래 프로젝트 정보를 바탕으로 전문적인 포트폴리오 케이스 스터디를 작성해주세요.

프로젝트 정보:
- 제목: ${projectInfo.title}
- 설명: ${projectInfo.description}
${projectInfo.figmaAnalysis ? `- 피그마 디자인 분석: ${projectInfo.figmaAnalysis}` : ''}

다음 구조로 작성해주세요:

1. **프로젝트 개요** (2-3문장)
   - 프로젝트의 핵심 목표와 배경

2. **문제 정의** (Problem Statement)
   - 해결하고자 하는 사용자 문제
   - 비즈니스 과제

3. **디자인 목표** (Design Goals)
   - 3-5개의 핵심 디자인 목표

4. **주요 기능** (Key Features)
   - 핵심 기능 3-5개
   - 각 기능이 문제를 해결하는 방법

5. **디자인 프로세스** (Design Process)
   - 리서치 → 아이디어 발산 → 프로토타이핑 → 테스트 → 반복
   - 각 단계에서 수행한 활동

6. **디자인 결정** (Design Decisions)
   - 주요 디자인 결정 사항 3-4개
   - 각 결정의 근거

7. **성과 및 임팩트** (Impact & Results)
   - 측정 가능한 성과 (가능한 경우)
   - 사용자 피드백
   - 비즈니스 임팩트

8. **배운 점** (Learnings)
   - 프로젝트를 통해 배운 2-3가지 인사이트

JSON 형식으로 반환해주세요:
{
  "overview": "...",
  "problem": "...",
  "goals": ["goal1", "goal2", ...],
  "features": [
    {"title": "...", "description": "..."},
    ...
  ],
  "process": {
    "research": "...",
    "ideation": "...",
    "prototyping": "...",
    "testing": "...",
    "iteration": "..."
  },
  "decisions": [
    {"decision": "...", "rationale": "..."},
    ...
  ],
  "impact": {
    "metrics": "...",
    "feedback": "...",
    "business": "..."
  },
  "learnings": ["learning1", "learning2", ...]
}`;
}

// HTML 템플릿 생성
function generateDetailHTML(projectData, portfolioContent) {
    return `<!DOCTYPE html>
<html lang="ko">

<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
    <meta name="description" content="${portfolioContent.overview}" />
    <meta name="author" content="" />
    <title>${projectData.title} - Biber Portfolio</title>
    <link rel="icon" type="image/x-icon" href="assets/favicon.ico" />
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.5.0/font/bootstrap-icons.css" rel="stylesheet" />
    <link rel="preconnect" href="https://fonts.gstatic.com">
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@100;300;400;500;700;900&display=swap" rel="stylesheet">
    <link href="css/styles.css" rel="stylesheet" />
    <link href="css/main.css" rel="stylesheet" />
    <link href="css/menu.css" rel="stylesheet" />
    <link href="css/sticky-footer-navbar.css" rel="stylesheet">
    <link rel="stylesheet" href="https://unpkg.com/aos@next/dist/aos.css" />
</head>

<body id="page-top">
    <!-- Mobile Header -->
    <div class="mobile-header">
        <a href="index.html" class="mobile-logo">BIEBER</a>
        <button class="mobile-menu-btn" aria-label="메뉴 열기">
            <span class="hamburger-line"></span>
            <span class="hamburger-line"></span>
            <span class="hamburger-line"></span>
        </button>
    </div>

    <div class="layout-wrapper">
        <!-- Navigation -->
        <div class="side-list scroll" id="sidebar-container"></div>

        <!-- Contents -->
        <div class="contents-place">
            <!-- Project Header -->
            <div class="main-block" style="margin-bottom: 40px;">
                <h1 style="font-size: 2.5rem; font-weight: 700; margin-bottom: 16px;">${projectData.title}</h1>
                <p style="font-size: 1.2rem; color: #666; margin-bottom: 8px;">${projectData.subtitle}</p>
                <p style="color: #999;">${projectData.date}</p>
            </div>

            <!-- Hero Image -->
            ${projectData.heroImage ? `
            <div class="main-block" style="margin-bottom: 60px;">
                <img src="${projectData.heroImage}" style="width: 100%; border-radius: 12px;" alt="${projectData.title}">
            </div>
            ` : ''}

            <!-- Overview -->
            <section class="main-block" style="margin-bottom: 60px;" data-aos="fade-up">
                <h2 style="font-size: 1.8rem; font-weight: 700; margin-bottom: 24px;">프로젝트 개요</h2>
                <p style="font-size: 1.1rem; line-height: 1.8; color: #333;">${portfolioContent.overview}</p>
            </section>

            <!-- Problem Statement -->
            <section class="main-block" style="margin-bottom: 60px;" data-aos="fade-up">
                <h2 style="font-size: 1.8rem; font-weight: 700; margin-bottom: 24px;">문제 정의</h2>
                <p style="font-size: 1.1rem; line-height: 1.8; color: #333;">${portfolioContent.problem}</p>
            </section>

            <!-- Design Goals -->
            <section class="main-block" style="margin-bottom: 60px;" data-aos="fade-up">
                <h2 style="font-size: 1.8rem; font-weight: 700; margin-bottom: 24px;">디자인 목표</h2>
                <ul style="font-size: 1.1rem; line-height: 2; color: #333;">
                    ${portfolioContent.goals.map(goal => `<li>${goal}</li>`).join('\n                    ')}
                </ul>
            </section>

            <!-- Key Features -->
            <section class="main-block" style="margin-bottom: 60px;" data-aos="fade-up">
                <h2 style="font-size: 1.8rem; font-weight: 700; margin-bottom: 24px;">주요 기능</h2>
                ${portfolioContent.features.map((feature, index) => `
                <div style="margin-bottom: 32px;">
                    <h3 style="font-size: 1.3rem; font-weight: 600; margin-bottom: 12px;">${index + 1}. ${feature.title}</h3>
                    <p style="font-size: 1.05rem; line-height: 1.8; color: #555;">${feature.description}</p>
                </div>
                `).join('\n                ')}
            </section>

            <!-- Design Process -->
            <section class="main-block" style="margin-bottom: 60px;" data-aos="fade-up">
                <h2 style="font-size: 1.8rem; font-weight: 700; margin-bottom: 24px;">디자인 프로세스</h2>

                <div style="margin-bottom: 24px;">
                    <h3 style="font-size: 1.2rem; font-weight: 600; margin-bottom: 12px;">🔍 리서치</h3>
                    <p style="line-height: 1.8; color: #555;">${portfolioContent.process.research}</p>
                </div>

                <div style="margin-bottom: 24px;">
                    <h3 style="font-size: 1.2rem; font-weight: 600; margin-bottom: 12px;">💡 아이디어 발산</h3>
                    <p style="line-height: 1.8; color: #555;">${portfolioContent.process.ideation}</p>
                </div>

                <div style="margin-bottom: 24px;">
                    <h3 style="font-size: 1.2rem; font-weight: 600; margin-bottom: 12px;">🎨 프로토타이핑</h3>
                    <p style="line-height: 1.8; color: #555;">${portfolioContent.process.prototyping}</p>
                </div>

                <div style="margin-bottom: 24px;">
                    <h3 style="font-size: 1.2rem; font-weight: 600; margin-bottom: 12px;">🧪 테스트</h3>
                    <p style="line-height: 1.8; color: #555;">${portfolioContent.process.testing}</p>
                </div>

                <div style="margin-bottom: 24px;">
                    <h3 style="font-size: 1.2rem; font-weight: 600; margin-bottom: 12px;">🔄 반복 및 개선</h3>
                    <p style="line-height: 1.8; color: #555;">${portfolioContent.process.iteration}</p>
                </div>
            </section>

            <!-- Design Decisions -->
            <section class="main-block" style="margin-bottom: 60px;" data-aos="fade-up">
                <h2 style="font-size: 1.8rem; font-weight: 700; margin-bottom: 24px;">주요 디자인 결정</h2>
                ${portfolioContent.decisions.map((item, index) => `
                <div style="margin-bottom: 24px; padding: 20px; background: #f8f9fa; border-radius: 8px;">
                    <h3 style="font-size: 1.2rem; font-weight: 600; margin-bottom: 12px;">${index + 1}. ${item.decision}</h3>
                    <p style="line-height: 1.8; color: #555;"><strong>근거:</strong> ${item.rationale}</p>
                </div>
                `).join('\n                ')}
            </section>

            <!-- Impact & Results -->
            <section class="main-block" style="margin-bottom: 60px;" data-aos="fade-up">
                <h2 style="font-size: 1.8rem; font-weight: 700; margin-bottom: 24px;">성과 및 임팩트</h2>

                <div style="margin-bottom: 24px;">
                    <h3 style="font-size: 1.2rem; font-weight: 600; margin-bottom: 12px;">📊 측정 가능한 성과</h3>
                    <p style="line-height: 1.8; color: #555;">${portfolioContent.impact.metrics}</p>
                </div>

                <div style="margin-bottom: 24px;">
                    <h3 style="font-size: 1.2rem; font-weight: 600; margin-bottom: 12px;">💬 사용자 피드백</h3>
                    <p style="line-height: 1.8; color: #555;">${portfolioContent.impact.feedback}</p>
                </div>

                <div style="margin-bottom: 24px;">
                    <h3 style="font-size: 1.2rem; font-weight: 600; margin-bottom: 12px;">💼 비즈니스 임팩트</h3>
                    <p style="line-height: 1.8; color: #555;">${portfolioContent.impact.business}</p>
                </div>
            </section>

            <!-- Learnings -->
            <section class="main-block" style="margin-bottom: 60px;" data-aos="fade-up">
                <h2 style="font-size: 1.8rem; font-weight: 700; margin-bottom: 24px;">배운 점</h2>
                <ul style="font-size: 1.1rem; line-height: 2; color: #333;">
                    ${portfolioContent.learnings.map(learning => `<li>${learning}</li>`).join('\n                    ')}
                </ul>
            </section>

            <!-- Footer -->
            <div class="footer-copyright">
                Copyright 2024 Chiho Lee all rights reserved.
            </div>
        </div>
    </div>

    <script src="https://code.jquery.com/jquery-latest.min.js"></script>
    <script src="https://unpkg.com/aos@next/dist/aos.js"></script>
    <script>AOS.init();</script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/js/bootstrap.bundle.min.js"></script>
    <script src="js/scripts.js"></script>
    <script src="js/main.js"></script>
    <script src="js/sidebar-loader.js"></script>
</body>

</html>`;
}

async function main() {
    console.log('🎨 Smart Portfolio Agent - AI 기반 포트폴리오 생성기\n');
    console.log('시니어 프로덕트 디자이너 수준의 전문적인 포트폴리오를 자동으로 생성합니다.\n');

    // 1. 기본 정보 수집
    const projectId = await question('프로젝트 ID (예: my-awesome-project): ');
    const title = await question('프로젝트 제목: ');
    const subtitle = await question('프로젝트 부제목 (한줄 설명): ');

    console.log('\n피그마 링크를 입력하세요 (선택사항, 엔터로 스킵):');
    const figmaLink = await question('Figma URL: ');

    console.log('\n프로젝트에 대해 자유롭게 설명해주세요.');
    console.log('(배경, 목표, 주요 기능, 성과 등 - 여러 줄 입력 가능, 입력 완료 후 빈 줄에서 엔터):');

    let description = '';
    let line;
    while (true) {
        line = await question('> ');
        if (line === '' && description !== '') break;
        if (line !== '') description += line + '\n';
    }

    console.log('\n📝 정보를 수집했습니다. AI가 포트폴리오를 작성 중입니다...\n');

    // 2. AI 프롬프트 출력 (실제 Claude API 호출은 사용자가 직접)
    const projectInfo = {
        title,
        subtitle,
        description,
        figmaLink: figmaLink || null
    };

    const prompt = generateAnalysisPrompt(projectInfo);

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('다음 프롬프트를 Claude에게 전달하여 포트폴리오 내용을 생성해주세요:\n');
    console.log(prompt);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    console.log('생성된 JSON 응답을 파일로 저장합니다.');
    console.log(`파일명: portfolio-content-${projectId}.json\n`);

    const outputFile = path.join(ROOT_DIR, `portfolio-content-${projectId}.json`);
    fs.writeFileSync(outputFile, JSON.stringify({
        projectInfo,
        prompt,
        instructions: 'Claude API로 위 prompt를 전달하여 받은 JSON 응답을 여기에 붙여넣으세요.'
    }, null, 2));

    console.log(`✅ 설정 파일이 생성되었습니다: ${path.basename(outputFile)}`);
    console.log('\n다음 단계:');
    console.log('1. Claude API로 위 프롬프트 전달');
    console.log(`2. 받은 JSON을 ${path.basename(outputFile)}에 추가`);
    console.log('3. node smart-portfolio-agent.js finalize 실행\n');

    rl.close();
}

// JSON 응답을 받아 최종 HTML 생성
async function finalize() {
    const projectId = process.argv[3];
    if (!projectId) {
        console.log('사용법: node smart-portfolio-agent.js finalize <project-id>');
        rl.close();
        return;
    }

    const contentFile = path.join(ROOT_DIR, `portfolio-content-${projectId}.json`);
    if (!fs.existsSync(contentFile)) {
        console.log(`❌ ${path.basename(contentFile)} 파일을 찾을 수 없습니다.`);
        rl.close();
        return;
    }

    const data = JSON.parse(fs.readFileSync(contentFile, 'utf8'));

    if (!data.portfolioContent) {
        console.log('❌ portfolioContent가 없습니다. JSON 응답을 추가해주세요.');
        rl.close();
        return;
    }

    const thumbnail = await question('썸네일 이미지 경로 (예: img/thumb-project.png): ');
    const heroImage = await question('히어로 이미지 경로 (선택사항): ');
    const inSlider = (await question('슬라이더에 포함? (y/n): ')).toLowerCase() === 'y';
    let sliderImage = null;
    if (inSlider) {
        sliderImage = await question('슬라이더 이미지 경로: ');
    }

    const projectData = {
        id: projectId,
        title: data.projectInfo.title,
        subtitle: data.projectInfo.subtitle,
        date: `Updates ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}`,
        thumbnail,
        link: `detail-${projectId}.html`,
        inSlider,
        ...(sliderImage && { sliderImage }),
        ...(heroImage && { heroImage })
    };

    // HTML 생성
    const html = generateDetailHTML(projectData, data.portfolioContent);
    const htmlPath = path.join(ROOT_DIR, `detail-${projectId}.html`);
    fs.writeFileSync(htmlPath, html);
    console.log(`✅ detail-${projectId}.html 생성 완료!`);

    // projects-data.json 업데이트
    const projectsData = loadProjects();
    const maxOrder = projectsData.projects.reduce((max, p) => Math.max(max, p.order), -1);
    projectData.order = maxOrder + 1;

    projectsData.projects.push(projectData);
    saveProjects(projectsData);
    console.log('✅ projects-data.json 업데이트 완료!');

    console.log('\n💡 다음 단계: node portfolio-manager.js generate');

    rl.close();
}

// 명령 처리
const command = process.argv[2];
if (command === 'finalize') {
    finalize();
} else {
    main();
}
