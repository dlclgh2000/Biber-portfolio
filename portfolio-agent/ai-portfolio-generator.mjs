#!/usr/bin/env node

/**
 * AI Portfolio Generator - Claude Code 통합 버전
 * Claude Code와 통합되어 자동으로 포트폴리오를 생성합니다.
 */

import fs from 'fs';
import readline from 'readline';
import { spawn } from 'child_process';

const DATA_FILE = 'projects-data.json';

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

console.log(`
╔════════════════════════════════════════════════════════════════╗
║                                                                ║
║       🎨 AI Portfolio Generator - Powered by Claude           ║
║                                                                ║
║   시니어 프로덕트 디자이너 수준의 포트폴리오를 자동 생성     ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝

`);

console.log('이 도구는 다음과 같이 작동합니다:\n');
console.log('1️⃣  프로젝트 기본 정보 입력');
console.log('2️⃣  피그마 링크 입력 (선택)');
console.log('3️⃣  프로젝트 상세 설명 입력');
console.log('4️⃣  Claude가 전문적인 포트폴리오 작성');
console.log('5️⃣  상세 페이지 HTML 자동 생성');
console.log('6️⃣  메인 index.html 업데이트\n');

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

async function collectProjectInfo() {
    console.log('📋 1단계: 기본 정보 입력\n');

    const projectId = await question('프로젝트 ID (영문, 하이픈 사용 가능, 예: podo-tutor): ');
    const title = await question('프로젝트 제목: ');
    const subtitle = await question('프로젝트 부제목 (한 줄 요약): ');

    console.log('\n🎨 2단계: 피그마 링크 (선택사항)\n');
    console.log('피그마 디자인 링크가 있으면 입력하세요.');
    console.log('없으면 엔터를 눌러 스킵하세요.\n');

    const figmaUrl = await question('Figma URL: ');

    console.log('\n📝 3단계: 프로젝트 상세 설명\n');
    console.log('프로젝트에 대해 자유롭게 설명해주세요.');
    console.log('포함하면 좋은 내용:');
    console.log('  • 프로젝트 배경 및 목표');
    console.log('  • 해결하려는 문제');
    console.log('  • 주요 기능');
    console.log('  • 타겟 사용자');
    console.log('  • 사용한 도구/기술');
    console.log('  • 성과나 결과 (있다면)\n');
    console.log('입력 완료 후 빈 줄에서 엔터를 두 번 누르세요.\n');

    let description = '';
    let emptyLineCount = 0;

    while (true) {
        const line = await question('');
        if (line === '') {
            emptyLineCount++;
            if (emptyLineCount >= 2) break;
        } else {
            emptyLineCount = 0;
            description += line + '\n';
        }
    }

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    return {
        projectId,
        title,
        subtitle,
        figmaUrl: figmaUrl.trim() || null,
        description: description.trim()
    };
}

async function main() {
    try {
        const projectInfo = await collectProjectInfo();

        // 설정 파일 저장
        const configFile = `ai-portfolio-${projectInfo.projectId}.json`;
        fs.writeFileSync(configFile, JSON.stringify(projectInfo, null, 2));

        console.log('✅ 프로젝트 정보가 수집되었습니다!\n');
        console.log(`📄 설정 파일: ${configFile}\n`);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

        console.log('🤖 4단계: Claude에게 포트폴리오 작성 요청\n');
        console.log('다음 메시지를 Claude Code에 전달하세요:\n');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

        const requestMessage = `ai-portfolio-${projectInfo.projectId}.json 파일을 읽고, 시니어 프로덕트 디자이너 관점에서 전문적인 포트폴리오 케이스 스터디를 작성해주세요.

${projectInfo.figmaUrl ? `먼저 피그마 링크(${projectInfo.figmaUrl})를 분석하여 디자인 특징을 파악한 후, ` : ''}다음 구조로 포트폴리오를 작성하고 detail-${projectInfo.projectId}.html 파일을 생성해주세요:

1. 프로젝트 개요 (2-3문장)
2. 문제 정의 (Problem Statement)
3. 디자인 목표 (3-5개)
4. 주요 기능 (3-5개, 각 기능의 목적 설명)
5. 디자인 프로세스 (리서치 → 아이디어 → 프로토타입 → 테스트 → 반복)
6. 주요 디자인 결정 (3-4개, 각 결정의 근거)
7. 성과 및 임팩트 (측정 가능한 성과, 사용자 피드백, 비즈니스 임팩트)
8. 배운 점 (2-3가지)

프로젝트 정보는 ${configFile} 파일에 있습니다.`;

        console.log(requestMessage);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

        console.log('💡 Claude가 작업을 완료하면 자동으로 다음이 생성됩니다:');
        console.log(`   • detail-${projectInfo.projectId}.html`);
        console.log(`   • projects-data.json 업데이트`);
        console.log(`   • index.html 업데이트\n`);

    } catch (error) {
        console.error('❌ 오류 발생:', error);
    } finally {
        rl.close();
    }
}

main();
