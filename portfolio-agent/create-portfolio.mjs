#!/usr/bin/env node

/**
 * Create Portfolio - Claude Code 완전 통합 버전
 * 이 스크립트를 실행하면 Claude Code가 자동으로 포트폴리오를 생성합니다.
 */

import fs from 'fs';
import readline from 'readline';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.join(__dirname, '..');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function question(query) {
    return new Promise(resolve => rl.question(query, resolve));
}

console.log(`
╔═══════════════════════════════════════════════════════════════════╗
║                                                                   ║
║          🎨 AI 포트폴리오 생성기 - Claude Code 통합              ║
║                                                                   ║
║      시니어 프로덕트 디자이너 수준의 포트폴리오를 자동 생성      ║
║                                                                   ║
╚═══════════════════════════════════════════════════════════════════╝

`);

async function main() {
    console.log('📋 프로젝트 정보를 입력해주세요\n');

    const projectId = await question('1️⃣  프로젝트 ID (영문, 예: my-app): ');
    const title = await question('2️⃣  프로젝트 제목: ');
    const subtitle = await question('3️⃣  부제목 (한 줄 요약): ');

    console.log('\n4️⃣  피그마 디자인 링크 (선택사항, 없으면 엔터):');
    const figmaUrl = await question('    Figma URL: ');

    console.log('\n5️⃣  프로젝트에 대해 설명해주세요.');
    console.log('    (배경, 목표, 기능, 타겟 유저, 성과 등)');
    console.log('    여러 줄 입력 가능. 완료 후 빈 줄에서 엔터 두 번.\n');

    let description = '';
    let emptyCount = 0;

    while (true) {
        const line = await question('');
        if (line === '') {
            emptyCount++;
            if (emptyCount >= 2) break;
        } else {
            emptyCount = 0;
            description += line + '\n';
        }
    }

    console.log('\n6️⃣  이미지 경로 설정\n');
    const thumbnail = await question('    썸네일 이미지 (예: img/thumb-myapp.png): ');
    const heroImage = await question('    히어로 이미지 (선택, 없으면 엔터): ');
    const inSlider = (await question('    메인 슬라이더에 표시? (y/n): ')).toLowerCase() === 'y';
    let sliderImage = '';
    if (inSlider) {
        sliderImage = await question('    슬라이더 이미지 경로: ');
    }

    const data = {
        projectId: projectId.trim(),
        title: title.trim(),
        subtitle: subtitle.trim(),
        figmaUrl: figmaUrl.trim() || null,
        description: description.trim(),
        thumbnail: thumbnail.trim(),
        heroImage: heroImage.trim() || null,
        inSlider,
        sliderImage: sliderImage.trim() || null,
        date: new Date().toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        })
    };

    const filename = path.join(ROOT_DIR, `portfolio-request-${data.projectId}.json`);
    fs.writeFileSync(filename, JSON.stringify(data, null, 2));

    console.log('\n✅ 프로젝트 정보가 저장되었습니다!\n');
    console.log(`📄 설정 파일: ${path.basename(filename)}\n`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('🤖 이제 Claude Code에게 다음 메시지를 전달하세요:\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log(`${path.basename(filename)} 파일을 읽고, 시니어 프로덕트 디자이너 관점에서 전문적인 포트폴리오를 작성해주세요.`);

    if (data.figmaUrl) {
        console.log(`\n먼저 피그마 링크를 분석해주세요:`);
        console.log(`${data.figmaUrl}`);
    }

    console.log(`
다음 구조로 포트폴리오 케이스 스터디를 작성하고,
detail-${data.projectId}.html 파일을 생성해주세요:

1. 프로젝트 개요
2. 문제 정의
3. 디자인 목표 (3-5개)
4. 주요 기능 (3-5개)
5. 디자인 프로세스
6. 주요 디자인 결정
7. 성과 및 임팩트
8. 배운 점

그리고 projects-data.json과 index.html도 자동으로 업데이트해주세요.`);

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    rl.close();
}

main();
