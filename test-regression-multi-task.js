'use strict';

const path = require('path');
const { createWorker, createScheduler } = require('./src');

const IMAGE_PATH = path.resolve(__dirname, 'tests/assets/images');

const RESULTS = {
  'simple.png': 'Tesseract.js',
  'cosmic.png': 'HellO World',
  'testocr.png': 'This is a lot',
};

function generateReport(passed, failures = []) {
  const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
  const status = passed ? 'PASS' : 'FAIL';
  
  let report = `[${timestamp}] MULTI-TASK OCR REGRESSION TEST: ${status}\n`;
  report += `='.repeat(70) + '\n\n`;
  
  if (!passed && failures.length > 0) {
    report += 'FAILURES:\n';
    failures.forEach(f => {
      report += `  - ${f}\n`;
    });
    report += '\n';
  }
  
  report += `SUMMARY: ${passed ? 'All tests passed!' : failures.length + ' test(s) failed'}\n`;
  report += `='.repeat(70) + '\n`;
  
  return report;
}

(async () => {
  console.log('='.repeat(70));
  console.log('多任务 OCR 回归测试');
  console.log('='.repeat(70));

  const scheduler = createScheduler();
  let allPassed = true;
  const failures = [];

  console.log('\n[1/4] 创建 Worker...');
  let worker;
  try {
    worker = await createWorker('eng', 1, {
      cachePath: './tests/assets/traineddata',
    });
    scheduler.addWorker(worker);
    console.log('  ✓ Worker 创建成功');
  } catch (err) {
    console.log(`  ✗ Worker 创建失败: ${err.message}`);
    allPassed = false;
    failures.push(`Worker creation failed: ${err.message}`);
    console.log(generateReport(allPassed, failures));
    process.exit(1);
  }

  console.log('\n[场景1] 多任务并发进度隔离');
  console.log('---');
  const progressLogs = [];
  
  const workerWithLogger = await createWorker('eng', 1, {
    cachePath: './tests/assets/traineddata',
    logger: (m) => {
      progressLogs.push({
        userJobId: m.userJobId,
        status: m.status,
        progress: m.progress,
        timestamp: Date.now(),
      });
    },
  });

  const scheduler2 = createScheduler();
  scheduler2.addWorker(workerWithLogger);

  console.log('  提交并发任务...');
  const images1 = ['simple.png', 'cosmic.png', 'testocr.png'];
  const files1 = images1.map(f => `${IMAGE_PATH}/${f}`);
  
  progressLogs.length = 0;
  const results1 = await Promise.allSettled(
    files1.map((f, idx) => {
      console.log(`    [提交] 任务 ${idx}: ${images1[idx]}`);
      return scheduler2.addJob('recognize', f);
    })
  );

  const jobIds = [...new Set(progressLogs.map(l => l.userJobId))];
  console.log(`  涉及 ${jobIds.length} 个不同的任务ID`);
  
  let progressIsolationPassed = true;
  progressLogs.forEach((log, idx) => {
    if (!log.userJobId || log.userJobId === 'undefined') {
      console.log(`    ✗ 进度日志 ${idx}: userJobId 无效 (${log.userJobId})`);
      progressIsolationPassed = false;
      allPassed = false;
      failures.push(`场景1: 进度日志 ${idx} 的 userJobId 无效`);
    }
  });

  if (jobIds.length === 3) {
    console.log('  ✓ 每个任务有独立的 userJobId');
  } else {
    console.log(`  ✗ 期望 3 个任务ID，实际 ${jobIds.length} 个`);
    allPassed = false;
    failures.push(`场景1: 期望 3 个任务ID，实际 ${jobIds.length} 个`);
  }

  if (progressIsolationPassed && jobIds.length === 3) {
    console.log('  ✓ 场景1 通过: 多任务并发进度隔离');
  }

  await scheduler2.terminate();

  console.log('\n[场景2] 失败任务不中断其他任务');
  console.log('---');
  
  console.log('  提交混合任务（失败 + 成功）...');
  const nonexistent1 = `${IMAGE_PATH}/nonexistent_${Date.now()}_1.png`;
  const nonexistent2 = `${IMAGE_PATH}/nonexistent_${Date.now()}_2.png`;
  
  const batch2 = [
    nonexistent1,
    `${IMAGE_PATH}/simple.png`,
    nonexistent2,
    `${IMAGE_PATH}/cosmic.png`,
  ];
  const batch2Names = batch2.map(f => path.basename(f));
  
  const results2 = await Promise.allSettled(
    batch2.map((f, idx) => {
      console.log(`    [提交] 任务 ${idx}: ${batch2Names[idx]}`);
      return scheduler.addJob('recognize', f);
    })
  );

  let expectedFailures = 0;
  let expectedSuccesses = 0;
  let actualFailures = 0;
  let actualSuccesses = 0;
  let errorMappingCorrect = true;

  results2.forEach((result, idx) => {
    const isFailureExpected = batch2Names[idx].includes('nonexistent');
    
    if (isFailureExpected) {
      expectedFailures++;
      if (result.status === 'rejected') {
        actualFailures++;
        const hasJobId = result.reason && result.reason.jobId !== undefined;
        const hasFilePath = result.reason && 
          (result.reason.message && result.reason.message.includes('ENOENT'));
        
        if (hasJobId) {
          console.log(`    ✓ 任务 ${idx}: 失败，包含 jobId=${result.reason.jobId}`);
        } else {
          console.log(`    ✗ 任务 ${idx}: 失败，但缺少 jobId`);
          errorMappingCorrect = false;
          allPassed = false;
          failures.push(`场景2: 任务 ${idx} 失败但缺少 jobId`);
        }
        
        if (hasFilePath) {
          console.log(`      ✓ 错误信息包含文件路径`);
        }
      } else {
        console.log(`    ✗ 任务 ${idx}: 应该失败但成功了`);
        allPassed = false;
        failures.push(`场景2: 任务 ${idx} 应该失败但成功`);
      }
    } else {
      expectedSuccesses++;
      if (result.status === 'fulfilled') {
        actualSuccesses++;
        const text = result.value.data.text || '';
        const expected = RESULTS[batch2Names[idx]];
        if (text.includes(expected)) {
          console.log(`    ✓ 任务 ${idx}: 成功，文本包含 "${expected}"`);
        } else {
          console.log(`    ⚠ 任务 ${idx}: 成功，但文本为 "${text.substring(0, 30)}..."`);
        }
      } else {
        console.log(`    ✗ 任务 ${idx}: 应该成功但失败了`);
        allPassed = false;
        failures.push(`场景2: 任务 ${idx} 应该成功但失败`);
      }
    }
  });

  if (actualFailures === expectedFailures && actualSuccesses === expectedSuccesses) {
    console.log(`  ✓ 场景2 通过: ${actualFailures} 个失败任务，${actualSuccesses} 个成功任务，互不影响`);
  }

  console.log('\n[场景3] 连续两批任务状态隔离');
  console.log('---');
  
  console.log('  提交第一批任务...');
  const batch3a = ['simple.png', 'cosmic.png'];
  const files3a = batch3a.map(f => `${IMAGE_PATH}/${f}`);
  
  progressLogs.length = 0;
  
  const scheduler3 = createScheduler();
  const worker3 = await createWorker('eng', 1, {
    cachePath: './tests/assets/traineddata',
    logger: (m) => {
      progressLogs.push({
        userJobId: m.userJobId,
        status: m.status,
        progress: m.progress,
        timestamp: Date.now(),
      });
    },
  });
  scheduler3.addWorker(worker3);

  await Promise.allSettled(
    files3a.map((f, idx) => {
      console.log(`    [提交] 任务 ${idx}: ${batch3a[idx]}`);
      return scheduler3.addJob('recognize', f);
    })
  );

  const batch1JobIds = [...new Set(progressLogs.map(l => l.userJobId))];
  console.log(`  第一批任务ID: ${batch1JobIds.join(', ')}`);

  console.log('  提交第二批任务...');
  const batch3b = ['testocr.png', 'simple.png'];
  const files3b = batch3b.map(f => `${IMAGE_PATH}/${f}`);
  
  progressLogs.length = 0;
  
  await Promise.allSettled(
    files3b.map((f, idx) => {
      console.log(`    [提交] 任务 ${idx}: ${batch3b[idx]}`);
      return scheduler3.addJob('recognize', f);
    })
  );

  const batch2JobIds = [...new Set(progressLogs.map(l => l.userJobId))];
  console.log(`  第二批任务ID: ${batch2JobIds.join(', ')}`);

  console.log('  验证状态隔离...');
  let stateIsolationPassed = true;
  
  progressLogs.forEach((log, idx) => {
    if (batch1JobIds.includes(log.userJobId)) {
      console.log(`    ✗ 进度日志 ${idx}: userJobId=${log.userJobId} 属于第一批任务!`);
      stateIsolationPassed = false;
      allPassed = false;
      failures.push(`场景3: 第二批任务进度日志包含第一批任务ID ${log.userJobId}`);
    } else if (batch2JobIds.includes(log.userJobId)) {
      console.log(`    ✓ 进度日志 ${idx}: userJobId=${log.userJobId}`);
    }
  });

  if (stateIsolationPassed) {
    console.log('  ✓ 场景3 通过: 连续两批任务状态隔离');
  }

  await scheduler3.terminate();

  console.log('\n[场景4] 输出顺序与输入顺序一致');
  console.log('---');
  
  console.log('  提交顺序任务验证结果顺序...');
  const batch4 = [
    { file: 'simple.png', expected: 'Tesseract.js' },
    { file: 'cosmic.png', expected: 'HellO World' },
    { file: 'testocr.png', expected: 'This is a lot' },
  ];
  const files4 = batch4.map(item => `${IMAGE_PATH}/${item.file}`);
  
  const results4 = await Promise.allSettled(
    files4.map((f, idx) => {
      console.log(`    [提交] 任务 ${idx}: ${batch4[idx].file}`);
      return scheduler.addJob('recognize', f);
    })
  );

  let orderCorrect = true;
  results4.forEach((result, idx) => {
    const item = batch4[idx];
    if (result.status === 'fulfilled') {
      const text = result.value.data.text || '';
      if (text.includes(item.expected)) {
        console.log(`    ✓ 任务 ${idx}: 文本包含 "${item.expected}"`);
      } else {
        console.log(`    ⚠ 任务 ${idx}: 文本为 "${text.substring(0, 30)}..."`);
      }
    } else {
      console.log(`    ✗ 任务 ${idx}: 失败 - ${result.reason.message || result.reason}`);
      orderCorrect = false;
      allPassed = false;
      failures.push(`场景4: 任务 ${idx} 失败`);
    }
  });

  if (orderCorrect) {
    console.log('  ✓ 场景4 通过: 结果顺序与输入顺序一致');
  }

  console.log('\n[清理] 终止 Worker...');
  await scheduler.terminate();
  console.log('  ✓ 资源已清理');

  console.log('\n' + '='.repeat(70));
  console.log('测试总结');
  console.log('='.repeat(70));
  
  console.log(generateReport(allPassed, failures));
  
  process.exit(allPassed ? 0 : 1);
})();
