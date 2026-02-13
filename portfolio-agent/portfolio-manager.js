#!/usr/bin/env node

/**
 * Portfolio Manager Agent
 * 포트폴리오 프로젝트 관리 자동화 도구
 *
 * 사용법:
 * - 프로젝트 추가: node portfolio-manager.js add
 * - 프로젝트 수정: node portfolio-manager.js edit <project-id>
 * - 프로젝트 삭제: node portfolio-manager.js delete <project-id>
 * - 프로젝트 목록: node portfolio-manager.js list
 * - HTML 생성: node portfolio-manager.js generate
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

// 상위 폴더의 파일들을 참조
const ROOT_DIR = path.join(__dirname, '..');
const DATA_FILE = path.join(ROOT_DIR, 'projects-data.json');
const INDEX_TEMPLATE = path.join(ROOT_DIR, 'index.html');

// 데이터 파일 읽기
function loadProjects() {
    if (!fs.existsSync(DATA_FILE)) {
        return { projects: [] };
    }
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(data);
}

// 데이터 파일 저장
function saveProjects(data) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
    console.log('✅ 프로젝트 데이터가 저장되었습니다.');
}

// readline 인터페이스 생성
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// 질문 함수
function question(query) {
    return new Promise(resolve => rl.question(query, resolve));
}

// 프로젝트 추가
async function addProject() {
    console.log('\n📝 새 프로젝트 추가\n');

    const id = await question('프로젝트 ID (예: my-project): ');
    const title = await question('제목 (Title): ');
    const subtitle = await question('부제목 (Subtitle): ');
    const date = await question('날짜 (예: Updates 13 February 2026): ');
    const thumbnail = await question('썸네일 경로 (예: img/thumb-project.png): ');
    const link = await question('상세페이지 링크 (예: detail-project.html): ');
    const inSlider = (await question('슬라이더에 포함? (y/n): ')).toLowerCase() === 'y';

    let sliderImage = null;
    if (inSlider) {
        sliderImage = await question('슬라이더 이미지 경로: ');
    }

    const data = loadProjects();
    const maxOrder = data.projects.reduce((max, p) => Math.max(max, p.order), -1);

    const newProject = {
        id,
        order: maxOrder + 1,
        title,
        subtitle,
        date,
        thumbnail,
        link,
        inSlider,
        ...(sliderImage && { sliderImage })
    };

    data.projects.push(newProject);
    saveProjects(data);

    console.log('\n✨ 프로젝트가 추가되었습니다!');
    console.log('💡 HTML을 업데이트하려면: node portfolio-manager.js generate');

    rl.close();
}

// 프로젝트 목록 보기
function listProjects() {
    const data = loadProjects();
    console.log('\n📋 프로젝트 목록\n');

    if (data.projects.length === 0) {
        console.log('등록된 프로젝트가 없습니다.');
    } else {
        data.projects
            .sort((a, b) => a.order - b.order)
            .forEach(p => {
                console.log(`[${p.order}] ${p.id}`);
                console.log(`    제목: ${p.title}`);
                console.log(`    날짜: ${p.date}`);
                console.log(`    슬라이더: ${p.inSlider ? '✓' : '✗'}`);
                console.log('');
            });
    }

    rl.close();
}

// 프로젝트 삭제
async function deleteProject(projectId) {
    if (!projectId) {
        console.log('❌ 프로젝트 ID를 입력해주세요.');
        console.log('사용법: node portfolio-manager.js delete <project-id>');
        rl.close();
        return;
    }

    const data = loadProjects();
    const index = data.projects.findIndex(p => p.id === projectId);

    if (index === -1) {
        console.log(`❌ 프로젝트 '${projectId}'를 찾을 수 없습니다.`);
        rl.close();
        return;
    }

    const confirm = await question(`'${data.projects[index].title}'를 삭제하시겠습니까? (y/n): `);

    if (confirm.toLowerCase() === 'y') {
        data.projects.splice(index, 1);

        // 순서 재정렬
        data.projects.sort((a, b) => a.order - b.order);
        data.projects.forEach((p, i) => p.order = i);

        saveProjects(data);
        console.log('✅ 프로젝트가 삭제되었습니다.');
        console.log('💡 HTML을 업데이트하려면: node portfolio-manager.js generate');
    } else {
        console.log('취소되었습니다.');
    }

    rl.close();
}

// HTML 생성
function generateHTML() {
    const data = loadProjects();

    // 슬라이더 HTML 생성
    const sliderHTML = data.projects
        .filter(p => p.inSlider && p.sliderImage)
        .map(p => `                        <div class="swiper-slide">
                            <a href="${p.link}" style="width: 100%;">
                                <img src="${p.sliderImage}"
                                    style="width: 100%; object-fit: cover; border-radius: 12px;">
                            </a>
                        </div>`)
        .join('\n');

    // 프로젝트 그리드 HTML 생성
    const projectsHTML = data.projects
        .sort((a, b) => a.order - b.order)
        .map(p => `                <!-- Item ${p.order}: ${p.title} -->
                <div class="portfolio-item" data-order="${p.order}" style="margin-bottom: 40px;">
                    <div class="main-block" style="margin-bottom: 8px;">
                        <a href="${p.link}" class="thumb-img-box">
                            <img src="${p.thumbnail}" class="thumb-block-img">
                            <div class="thumb-caption">
                                <p style="margin: 0;">View Project</p>
                            </div>
                        </a>
                    </div>
                    <div class="main-block-title">
                        <p class="thumb-main-title">${p.title}</p>
                        <p class="thumb-sub-title">${p.subtitle}</p>
                        <p class="thumb-date">${p.date}</p>
                    </div>
                </div>`)
        .join('\n\n');

    // 템플릿 읽기
    if (!fs.existsSync(INDEX_TEMPLATE)) {
        console.log('❌ index.html 파일을 찾을 수 없습니다.');
        rl.close();
        return;
    }

    let html = fs.readFileSync(INDEX_TEMPLATE, 'utf8');

    // 슬라이더 섹션 교체
    const sliderRegex = /(<!-- Slides -->)([\s\S]*?)(<!-- If we need pagination -->)/;
    html = html.replace(sliderRegex, `$1\n${sliderHTML}\n                        \n                    $3`);

    // 프로젝트 섹션 교체
    const projectsRegex = /(<!-- Item \d+:[\s\S]*?<\/div>\n\n)/g;
    const flexMasonryStart = html.indexOf('<!-- Item 0:');
    const flexMasonryEnd = html.indexOf('</div>\n\n            <!-- Footer-->');

    if (flexMasonryStart !== -1 && flexMasonryEnd !== -1) {
        const before = html.substring(0, flexMasonryStart);
        const after = html.substring(flexMasonryEnd);
        html = before + projectsHTML + '\n\n            ' + after;
    }

    // 백업 생성
    const backupFile = path.join(ROOT_DIR, `index.backup.${Date.now()}.html`);
    fs.copyFileSync(INDEX_TEMPLATE, backupFile);
    console.log(`📦 백업 생성: ${path.basename(backupFile)}`);

    // 새 HTML 저장
    fs.writeFileSync(INDEX_TEMPLATE, html, 'utf8');
    console.log('✅ index.html이 업데이트되었습니다!');

    rl.close();
}

// 프로젝트 수정
async function editProject(projectId) {
    if (!projectId) {
        console.log('❌ 프로젝트 ID를 입력해주세요.');
        console.log('사용법: node portfolio-manager.js edit <project-id>');
        rl.close();
        return;
    }

    const data = loadProjects();
    const project = data.projects.find(p => p.id === projectId);

    if (!project) {
        console.log(`❌ 프로젝트 '${projectId}'를 찾을 수 없습니다.`);
        rl.close();
        return;
    }

    console.log('\n✏️  프로젝트 수정 (Enter를 누르면 기존 값 유지)\n');
    console.log(`현재 값: ${project.title}\n`);

    const title = await question(`제목 [${project.title}]: `);
    const subtitle = await question(`부제목 [${project.subtitle}]: `);
    const date = await question(`날짜 [${project.date}]: `);
    const thumbnail = await question(`썸네일 [${project.thumbnail}]: `);
    const link = await question(`링크 [${project.link}]: `);

    if (title) project.title = title;
    if (subtitle) project.subtitle = subtitle;
    if (date) project.date = date;
    if (thumbnail) project.thumbnail = thumbnail;
    if (link) project.link = link;

    saveProjects(data);
    console.log('\n✅ 프로젝트가 수정되었습니다!');
    console.log('💡 HTML을 업데이트하려면: node portfolio-manager.js generate');

    rl.close();
}

// 도움말
function showHelp() {
    console.log(`
📚 Portfolio Manager Agent - 사용 가이드

명령어:
  add                    새 프로젝트 추가
  list                   프로젝트 목록 보기
  edit <project-id>      프로젝트 수정
  delete <project-id>    프로젝트 삭제
  generate               index.html 생성/업데이트
  help                   도움말 보기

예시:
  node portfolio-manager.js add
  node portfolio-manager.js list
  node portfolio-manager.js edit my-project
  node portfolio-manager.js delete my-project
  node portfolio-manager.js generate
    `);
    rl.close();
}

// 메인 함수
async function main() {
    const command = process.argv[2];
    const arg = process.argv[3];

    switch (command) {
        case 'add':
            await addProject();
            break;
        case 'list':
            listProjects();
            break;
        case 'edit':
            await editProject(arg);
            break;
        case 'delete':
            await deleteProject(arg);
            break;
        case 'generate':
            generateHTML();
            break;
        case 'help':
        default:
            showHelp();
            break;
    }
}

main().catch(err => {
    console.error('❌ 오류 발생:', err);
    rl.close();
    process.exit(1);
});
