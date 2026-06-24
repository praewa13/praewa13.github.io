// Deadlock Educational Website JavaScript Logic
// Handles navigation, interactive diagrams, and the Banker's Algorithm Game

document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------
    // 1. Navigation & Scroll Spy
    // ----------------------------------------------------
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const menuToggle = document.getElementById('menuToggle');
    const navLinksContainer = document.getElementById('navLinks');

    // Sticky Navbar on Scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Scroll Spy: Highlight active section in nav
        let current = '';
        const sections = document.querySelectorAll('section, header');
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= (sectionTop - 120)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // Mobile Menu Toggle
    menuToggle.addEventListener('click', () => {
        navLinksContainer.classList.toggle('active');
        menuToggle.classList.toggle('active');
    });

    // Close menu when link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navLinksContainer.classList.remove('active');
            menuToggle.classList.remove('active');
        });
    });

    // ----------------------------------------------------
    // 2. Lesson Tab Switcher
    // ----------------------------------------------------
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabName = button.getAttribute('data-tab');
            
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            button.classList.add('active');
            document.getElementById(`tab-${tabName}`).classList.add('active');
        });
    });

    // ----------------------------------------------------
    // 3. Coffman Conditions Accordion
    // ----------------------------------------------------
    const accItems = document.querySelectorAll('.acc-item');

    accItems.forEach(item => {
        const header = item.querySelector('.acc-header');
        header.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all
            accItems.forEach(i => i.classList.remove('active'));
            
            // Toggle clicked
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    // ----------------------------------------------------
    // 4. Interactive Traffic Analogy Diagram
    // ----------------------------------------------------
    const btnTrafficNormal = document.getElementById('btn-traffic-normal');
    const btnTrafficDeadlock = document.getElementById('btn-traffic-deadlock');
    const btnTrafficResolve = document.getElementById('btn-traffic-resolve');
    const trafficStatus = document.getElementById('traffic-status');
    const collisionAlert = document.getElementById('collision-alert');
    
    // Cars elements
    const carA = document.getElementById('car-A');
    const carB = document.getElementById('car-B');
    const carC = document.getElementById('car-C');
    const carD = document.getElementById('car-D');

    let trafficInterval = null;
    let normalTrafficStep = 0;

    function resetTrafficInterval() {
        if (trafficInterval) {
            clearInterval(trafficInterval);
            trafficInterval = null;
        }
    }

    // Set initial positions
    function resetCarPositions() {
        resetTrafficInterval();
        collisionAlert.style.opacity = 0;
        
        carA.style.transform = 'translate(40px, 165px)';
        carB.style.transform = 'translate(165px, 260px)';
        carC.style.transform = 'translate(260px, 125px)';
        carD.style.transform = 'translate(125px, 40px)';
        
        carA.style.transition = 'transform 1s ease';
        carB.style.transition = 'transform 1s ease';
        carC.style.transition = 'transform 1s ease';
        carD.style.transition = 'transform 1s ease';
    }

    // Normal Traffic: Cars cross one by one
    function runNormalTraffic() {
        resetCarPositions();
        trafficStatus.innerHTML = 'สถานะระบบ: 🟢 ปกติ (สลับกันข้ามทางแยกทีละคันอย่างเป็นระเบียบ)';
        trafficStatus.className = 'status-indicator';
        
        normalTrafficStep = 0;
        
        const animateNext = () => {
            resetCarPositions();
            setTimeout(() => {
                if (normalTrafficStep === 0) {
                    // Car A crosses
                    carA.style.transform = 'translate(280px, 165px)';
                    normalTrafficStep = 1;
                } else if (normalTrafficStep === 1) {
                    // Car B crosses
                    carB.style.transform = 'translate(165px, 20px)';
                    normalTrafficStep = 2;
                } else if (normalTrafficStep === 2) {
                    // Car C crosses
                    carC.style.transform = 'translate(20px, 125px)';
                    normalTrafficStep = 3;
                } else if (normalTrafficStep === 3) {
                    // Car D crosses
                    carD.style.transform = 'translate(125px, 280px)';
                    normalTrafficStep = 0;
                }
            }, 100);
        };

        animateNext();
        trafficInterval = setInterval(animateNext, 2000);
    }

    // Deadlock Traffic: All enter intersection together
    function runDeadlockTraffic() {
        resetCarPositions();
        trafficStatus.innerHTML = 'สถานะระบบ: 🔴 วงจรอับ (Deadlock! ทุกคันติดชะงัก ขยับต่อไม่ได้)';
        trafficStatus.className = 'status-indicator text-danger';

        setTimeout(() => {
            // Cars move to block each other in the middle
            carA.style.transform = 'translate(110px, 165px)';
            carB.style.transform = 'translate(165px, 190px)';
            carC.style.transform = 'translate(190px, 125px)';
            carD.style.transform = 'translate(125px, 110px)';

            // Show alert after they arrive
            setTimeout(() => {
                collisionAlert.style.opacity = 1;
            }, 1000);
        }, 100);
    }

    // Resolve Traffic: Back up one car, let others pass
    function runResolveTraffic() {
        resetCarPositions();
        trafficStatus.innerHTML = 'สถานะระบบ: 🟡 กำลังแก้ไข (ใช้กฎการแทรกแซง/ถอยรถออกเพื่อให้คันอื่นไปได้)';
        trafficStatus.className = 'status-indicator text-secondary';

        // 1. Move to deadlock first
        carA.style.transform = 'translate(110px, 165px)';
        carB.style.transform = 'translate(165px, 190px)';
        carC.style.transform = 'translate(190px, 125px)';
        carD.style.transform = 'translate(125px, 110px)';
        
        setTimeout(() => {
            collisionAlert.style.opacity = 1;
            
            // 2. Resolve: Back up Car A (Rollback/Preemption)
            setTimeout(() => {
                collisionAlert.style.opacity = 0;
                trafficStatus.innerHTML = 'สถานะระบบ: 🟢 ถอยรถ A เพื่อเปิดทางให้รถ D ขยับ';
                carA.style.transform = 'translate(40px, 165px)'; // A backs up
                
                // 3. Car D can now go through
                setTimeout(() => {
                    carD.style.transform = 'translate(125px, 280px)'; // D crosses
                    
                    // 4. Car C can now go through
                    setTimeout(() => {
                        carC.style.transform = 'translate(20px, 125px)'; // C crosses
                        
                        // 5. Car B can now go through
                        setTimeout(() => {
                            carB.style.transform = 'translate(165px, 20px)'; // B crosses
                            
                            // 6. Finally, Car A crosses
                            setTimeout(() => {
                                carA.style.transform = 'translate(280px, 165px)'; // A crosses
                                trafficStatus.innerHTML = 'สถานะระบบ: 🟢 ปลดล็อกเดดล็อกสำเร็จ! รถทุกคันข้ามผ่านได้';
                                trafficStatus.className = 'status-indicator text-success';
                            }, 1200);
                        }, 1200);
                    }, 1200);
                }, 1200);
            }, 1500);
        }, 1000);
    }

    // Event Listeners for Traffic Analogy
    btnTrafficNormal.addEventListener('click', () => {
        document.querySelectorAll('.btn-group .btn').forEach(btn => btn.classList.remove('active'));
        btnTrafficNormal.classList.add('active');
        runNormalTraffic();
    });

    btnTrafficDeadlock.addEventListener('click', () => {
        document.querySelectorAll('.btn-group .btn').forEach(btn => btn.classList.remove('active'));
        btnTrafficDeadlock.classList.add('active');
        runDeadlockTraffic();
    });

    btnTrafficResolve.addEventListener('click', () => {
        document.querySelectorAll('.btn-group .btn').forEach(btn => btn.classList.remove('active'));
        btnTrafficResolve.classList.add('active');
        runResolveTraffic();
    });

    // Start with Normal Traffic
    runNormalTraffic();


    // ----------------------------------------------------
    // 5. Interactive Resource Allocation Graph (RAG) Diagram
    // ----------------------------------------------------
    const btnRagSafe = document.getElementById('btn-rag-safe');
    const btnRagDeadlock = document.getElementById('btn-rag-deadlock');
    const edgeP2R2 = document.getElementById('edge-p2-r2');
    const ragExpText = document.getElementById('rag-exp-text');
    const nodeP1 = document.getElementById('node-P1').querySelector('circle');
    const nodeP2 = document.getElementById('node-P2').querySelector('circle');

    btnRagSafe.addEventListener('click', () => {
        btnRagSafe.classList.add('active');
        btnRagDeadlock.classList.remove('active');
        
        // Hide cycle edge
        edgeP2R2.style.opacity = '0.1';
        edgeP2R2.setAttribute('stroke', '#C85A53');
        edgeP2R2.setAttribute('stroke-dasharray', '4 4');

        // Reset nodes color
        nodeP1.setAttribute('stroke', '#E07A5F');
        nodeP1.setAttribute('fill', '#FAF6F0');
        nodeP2.setAttribute('stroke', '#E07A5F');
        nodeP2.setAttribute('fill', '#FAF6F0');

        ragExpText.innerHTML = `<span class="badge badge-success">สถานะ: ปลอดภัย (Safe)</span> R2 จัดสรรให้ P1 และ R1 จัดสรรให้ P2 แม้ P1 ร้องขอ R1 แต่เมื่อ P2 ทำงานเสร็จก็สามารถปล่อย R1 ให้ P1 ได้`;
    });

    btnRagDeadlock.addEventListener('click', () => {
        btnRagDeadlock.classList.add('active');
        btnRagSafe.classList.remove('active');

        // Show cycle edge fully and highlight loop
        edgeP2R2.style.opacity = '1';
        edgeP2R2.setAttribute('stroke', '#C85A53');
        edgeP2R2.setAttribute('stroke-dasharray', '4 4');
        edgeP2R2.classList.add('pulse-line');

        // Highlight nodes in red
        nodeP1.setAttribute('stroke', '#C85A53');
        nodeP1.setAttribute('fill', 'var(--danger-light)');
        nodeP2.setAttribute('stroke', '#C85A53');
        nodeP2.setAttribute('fill', 'var(--danger-light)');

        ragExpText.innerHTML = `<span class="badge badge-danger">สถานะ: วงจรอับ (Deadlock)</span> เกิดวัฏจักรวงกลมขึ้น! <strong>P1 ➔ R1 ➔ P2 ➔ R2 ➔ P1</strong> ทุกโปรเซสติดรอทรัพยากรซึ่งกันและกันอย่างไม่มีวันสิ้นสุด (Circular Wait)`;
    });


    // ----------------------------------------------------
    // 6. Educational Game: Deadlock Dispatcher
    // ----------------------------------------------------
    
    // Level Configurations
    const gameLevels = {
        1: {
            title: "ด่าน 1: แหล่งเดียวจำลอง",
            resourceNames: ["RAM"],
            resourceIcons: ["💻"],
            totalResources: [5],
            available: [2],
            processes: [
                { id: 0, name: "Process A", allocation: [1], max: [3], request: [2], state: "waiting", completed: false },
                { id: 1, name: "Process B", allocation: [2], max: [5], request: [2], state: "waiting", completed: false }
            ],
            guide: "มีทรัพยากรประเภทเดียวคือ RAM: พิจารณาว่าการให้ยืมส่งผลให้อีกโปรเซสที่เหลือขยับได้หรือไม่?"
        },
        2: {
            title: "ด่าน 2: ทรัพยากรคู่",
            resourceNames: ["RAM", "Disk"],
            resourceIcons: ["💻", "💾"],
            totalResources: [5, 4],
            available: [1, 1],
            processes: [
                { id: 0, name: "Process A", allocation: [1, 1], max: [2, 2], request: [1, 1], state: "waiting", completed: false },
                { id: 1, name: "Process B", allocation: [2, 1], max: [4, 2], request: [1, 0], state: "waiting", completed: false },
                { id: 2, name: "Process C", allocation: [1, 1], max: [3, 1], request: [1, 0], state: "waiting", completed: false }
            ],
            guide: "มี 2 ทรัพยากร (RAM, Disk) โปรเซส A ขอ RAM: 1, Disk: 1 เพื่อปิดงาน. ส่วน B และ C ขอ RAM: 1 เพิ่มเติมเพื่อดำเนินงานต่อ."
        },
        3: {
            title: "ด่าน 3: สมดุลธนาคาร (Banker's Algorithm)",
            resourceNames: ["RAM", "Disk", "CPU"],
            resourceIcons: ["💻", "💾", "⚡"],
            totalResources: [6, 5, 5],
            available: [1, 1, 2],
            processes: [
                { id: 0, name: "Process A", allocation: [2, 1, 1], max: [3, 2, 2], request: [1, 1, 1], state: "waiting", completed: false },
                { id: 1, name: "Process B", allocation: [1, 2, 1], max: [3, 2, 2], request: [1, 0, 1], state: "waiting", completed: false },
                { id: 2, name: "Process C", allocation: [2, 1, 1], max: [4, 2, 2], request: [1, 0, 1], state: "waiting", completed: false }
            ],
            guide: "ด่านท้าทายที่มี 3 ทรัพยากร: คิดให้ดีก่อนอนุมัติ! การอนุมัติจะต้องทำให้เกิด Safe Sequence เสมอ"
        }
    };

    let currentLevelNum = 1;
    let gameState = {
        available: [],
        processes: [],
        resourceNames: [],
        resourceIcons: [],
        score: 0,
        totalToWin: 0,
        isDeadlocked: false,
        history: [] // for reset/undo
    };

    // DOM Elements
    const gameLevelsContainer = document.getElementById('game-levels');
    const gameSafetyLabel = document.getElementById('game-safety');
    const gameScoreLabel = document.getElementById('game-score');
    const availResourcesContainer = document.getElementById('available-resources');
    const processListContainer = document.getElementById('process-list');
    const gameLogContainer = document.getElementById('game-log');
    
    const btnResetLevel = document.getElementById('btn-reset-level');
    
    // Modals
    const modalWin = document.getElementById('modal-win');
    const modalLose = document.getElementById('modal-lose');
    const modalComplete = document.getElementById('modal-complete');
    
    const modalWinText = document.getElementById('modal-win-text');
    const modalLoseText = document.getElementById('modal-lose-text');
    const modalLoseReason = document.getElementById('modal-lose-reason');
    
    const btnNextLevel = document.getElementById('btn-next-level');
    const btnRetryLevel = document.getElementById('btn-retry-level');
    const btnRestartGame = document.getElementById('btn-restart-game');

    // Initialize Game level
    function initGameLevel(levelNum) {
        currentLevelNum = levelNum;
        const lvlConfig = JSON.parse(JSON.stringify(gameLevels[levelNum])); // deep copy
        
        gameState.available = [...lvlConfig.available];
        gameState.processes = lvlConfig.processes;
        gameState.resourceNames = lvlConfig.resourceNames;
        gameState.resourceIcons = lvlConfig.resourceIcons;
        gameState.score = 0;
        gameState.totalToWin = lvlConfig.processes.length;
        gameState.isDeadlocked = false;
        gameState.history = [];
        
        // Update level buttons UI
        document.querySelectorAll('.level-btn').forEach(btn => {
            btn.classList.remove('active');
            if (parseInt(btn.getAttribute('data-level')) === levelNum) {
                btn.classList.add('active');
            }
        });

        // Clear log
        gameLogContainer.innerHTML = `<div class="log-entry system-msg">🏁 โหลด ${lvlConfig.title} สำเร็จ: ${lvlConfig.guide}</div>`;
        
        updateGameUI();
    }

    // Write message to game log
    function logMsg(text, type = 'system-msg') {
        const entry = document.createElement('div');
        entry.className = `log-entry ${type}`;
        entry.textContent = text;
        gameLogContainer.appendChild(entry);
        gameLogContainer.scrollTop = gameLogContainer.scrollHeight;
    }

    // Standard Banker's Algorithm Safety Checker
    function checkSafety(available, processes) {
        let work = [...available];
        let activeProcesses = processes.filter(p => !p.completed);
        let finish = new Array(activeProcesses.length).fill(false);
        
        while (true) {
            let found = false;
            for (let i = 0; i < activeProcesses.length; i++) {
                if (!finish[i]) {
                    const p = activeProcesses[i];
                    // Calculate current need
                    let canRun = true;
                    for (let r = 0; r < work.length; r++) {
                        let need = p.max[r] - p.allocation[r];
                        if (need > work[r]) {
                            canRun = false;
                            break;
                        }
                    }
                    if (canRun) {
                        for (let r = 0; r < work.length; r++) {
                            work[r] += p.allocation[r];
                        }
                        finish[i] = true;
                        found = true;
                    }
                }
            }
            if (!found) break;
        }
        return finish.every(f => f);
    }

    // Update the Game Dashboard layout dynamically
    function updateGameUI() {
        // 1. Update stats
        gameScoreLabel.textContent = `${gameState.score} / ${gameState.totalToWin}`;
        
        if (gameState.isDeadlocked) {
            gameSafetyLabel.innerHTML = '🔴 เกิดวงจรอับ (Deadlock)';
            gameSafetyLabel.style.color = 'var(--danger)';
        } else {
            const safe = checkSafety(gameState.available, gameState.processes);
            if (safe) {
                gameSafetyLabel.innerHTML = '🟢 ปลอดภัย (Safe State)';
                gameSafetyLabel.style.color = 'var(--success)';
            } else {
                gameSafetyLabel.innerHTML = '🟡 ไม่ปลอดภัย (Unsafe State)';
                gameSafetyLabel.style.color = 'var(--secondary)';
            }
        }

        // 2. Render Available Resources Pool
        availResourcesContainer.innerHTML = '';
        gameState.available.forEach((qty, idx) => {
            const icon = gameState.resourceIcons[idx] || '📦';
            const name = gameState.resourceNames[idx];
            
            const card = document.createElement('div');
            card.className = `resource-card ${idx === 0 ? 'res-ram' : idx === 1 ? 'res-disk' : 'res-cpu'}`;
            card.innerHTML = `
                <span class="res-icon">${icon}</span>
                <div class="res-details">
                    <span class="res-title">${name}</span>
                    <span class="res-qty">${qty}</span>
                </div>
            `;
            availResourcesContainer.appendChild(card);
        });

        // 3. Render Processes list
        processListContainer.innerHTML = '';
        gameState.processes.forEach(p => {
            const card = document.createElement('div');
            card.className = `process-card ${p.completed ? 'completed' : p.state === 'running' ? 'running' : 'waiting'}`;
            
            let statusText = 'กำลังรอคอย';
            let statusClass = 'status-waiting';
            if (p.completed) {
                statusText = 'เสร็จสมบูรณ์';
                statusClass = 'status-completed';
            } else if (p.state === 'running') {
                statusText = 'กำลังประมวลผล';
                statusClass = 'status-ready';
            }

            // Generate resource bars inside card
            let resHtml = '';
            gameState.available.forEach((_, idx) => {
                const resIcon = gameState.resourceIcons[idx];
                const resName = gameState.resourceNames[idx];
                const allocVal = p.allocation[idx];
                const maxVal = p.max[idx];
                const pctAlloc = (allocVal / maxVal) * 100;
                
                resHtml += `
                    <div class="proc-res-row">
                        <div class="proc-res-info">
                            <span>${resIcon} ${resName}</span>
                            <span>ถืออยู่: <strong>${allocVal}</strong> / สูงสุด: <strong>${maxVal}</strong></span>
                        </div>
                        <div class="proc-bar-bg">
                            <div class="proc-bar-fill bar-allocated" style="width: ${pctAlloc}%"></div>
                        </div>
                    </div>
                `;
            });

            // Generate Request section if active
            let requestHtml = '';
            let actionButtonsHtml = '';
            
            if (!p.completed && p.request) {
                const reqDesc = p.request.map((qty, idx) => {
                    return qty > 0 ? `${gameState.resourceIcons[idx]} ${qty}` : null;
                }).filter(x => x).join(', ');
                
                requestHtml = `
                    <div class="request-box">
                        <span>⚠️ ร้องขอทรัพยากร:</span>
                        <span><strong>${reqDesc}</strong></span>
                    </div>
                `;

                // Check if system has enough available resources to even consider approving
                let hasEnoughAvail = true;
                for (let r = 0; r < gameState.available.length; r++) {
                    if (p.request[r] > gameState.available[r]) {
                        hasEnoughAvail = false;
                        break;
                    }
                }

                actionButtonsHtml = `
                    <div class="proc-actions">
                        <button class="proc-btn proc-btn-approve" 
                                onclick="gameApproveRequest(${p.id})" 
                                ${!hasEnoughAvail ? 'disabled style="opacity: 0.5; cursor: not-allowed;" title="ทรัพยากรว่างมีไม่พอจัดสรร"' : ''}>
                            อนุมัติคำขอ
                        </button>
                        <button class="proc-btn proc-btn-delay" onclick="gameDelayRequest(${p.id})">
                            ให้รอก่อน
                        </button>
                    </div>
                `;
            }

            card.innerHTML = `
                <div class="proc-header">
                    <span class="proc-title">${p.name}</span>
                    <span class="proc-status ${statusClass}">${statusText}</span>
                </div>
                <div class="proc-resources">
                    ${resHtml}
                </div>
                ${requestHtml}
                ${actionButtonsHtml}
            `;
            
            processListContainer.appendChild(card);
        });
    }

    // Global action wrapper for button clicks
    window.gameApproveRequest = function(processId) {
        const process = gameState.processes.find(p => p.id === processId);
        if (!process || !process.request) return;

        logMsg(`👉 กดอนุมัติคำขอของ ${process.name}`, 'process-msg');

        // 1. Deduct resources from Available pool, add to Process Allocation
        for (let r = 0; r < gameState.available.length; r++) {
            gameState.available[r] -= process.request[r];
            process.allocation[r] += process.request[r];
        }
        
        process.request = null; // Clear request
        process.state = 'running';

        // 2. Perform safety check on this new state
        const isSafe = checkSafety(gameState.available, gameState.processes);
        
        if (!isSafe) {
            // Unsafe State! Deadlock occurs
            gameState.isDeadlocked = true;
            updateGameUI();
            
            // Build error reason text
            let reasonStr = `เพราะคุณจัดสรรทรัพยากรให้ ${process.name} จนหมด ทำให้ทรัพยากรในระบบคงเหลือ [${gameState.available.join(', ')}] ซึ่งน้อยกว่าความต้องการที่ขาดอยู่ของทุกโปรเซส:<br>`;
            gameState.processes.forEach(p => {
                if (!p.completed) {
                    let missing = p.max.map((maxVal, idx) => maxVal - p.allocation[idx]);
                    reasonStr += `• <strong>${p.name}</strong> ขาดอีก [${missing.join(', ')}] (แต่ในระบบมีว่างเพียง [${gameState.available.join(', ')}])<br>`;
                }
            });

            setTimeout(() => {
                showLoseModal(reasonStr);
            }, 800);
            return;
        }

        // 3. If Safe, and process allocated matches max, it runs and finishes
        let isFullySatisfied = true;
        for (let r = 0; r < gameState.available.length; r++) {
            if (process.allocation[r] < process.max[r]) {
                isFullySatisfied = false;
            }
        }

        if (isFullySatisfied) {
            logMsg(`⚡ ${process.name} ได้รับทรัพยากรครบถ้วนและเริ่มประมวลผล...`, 'system-msg');
            
            // Simulating run delay
            setTimeout(() => {
                // Complete process, return resources
                process.completed = true;
                process.state = 'completed';
                
                for (let r = 0; r < gameState.available.length; r++) {
                    gameState.available[r] += process.allocation[r];
                }
                
                gameState.score += 1;
                logMsg(`✅ ${process.name} ทำงานเสร็จสิ้น ปล่อยทรัพยากรคืนระบบ: +[${process.allocation.join(', ')}]`, 'success-msg');
                
                // Check win condition
                if (gameState.score === gameState.totalToWin) {
                    setTimeout(handleLevelWin, 800);
                } else {
                    // Update requests for remaining processes
                    // If a process was waiting, keep it waiting
                    updateGameUI();
                }
            }, 1000);
        } else {
            // State is safe, but process still needs more resources in future steps
            logMsg(`ℹ️ จัดสรรให้ ${process.name} เรียบร้อย ระบบยังอยู่ในสถานะปลอดภัย`, 'system-msg');
            updateGameUI();
        }
    };

    window.gameDelayRequest = function(processId) {
        const process = gameState.processes.find(p => p.id === processId);
        if (!process) return;
        
        logMsg(`⏸️ สั่งให้ ${process.name} รอการจัดสรรลำดับถัดไป`, 'system-msg');
        // Just cycle or alert
        // In this simple puzzle, delaying lets you examine other requests. No state changes.
    };

    function handleLevelWin() {
        if (currentLevelNum < 3) {
            modalWinText.innerHTML = `คุณควบคุมการแบ่งปันทรัพยากรของ <strong>ด่านที่ ${currentLevelNum}</strong> ได้อย่างสมบูรณ์แบบโดยไม่เกิดเดดล็อก!`;
            modalWin.classList.add('active');
        } else {
            // Completed all levels
            modalComplete.classList.add('active');
        }
    }

    function showLoseModal(reason) {
        modalLoseReason.innerHTML = reason;
        modalLose.classList.add('active');
    }

    // Modal Control buttons
    btnNextLevel.addEventListener('click', () => {
        modalWin.classList.remove('active');
        initGameLevel(currentLevelNum + 1);
    });

    btnRetryLevel.addEventListener('click', () => {
        modalLose.classList.remove('active');
        initGameLevel(currentLevelNum);
    });

    btnResetLevel.addEventListener('click', () => {
        initGameLevel(currentLevelNum);
    });

    btnRestartGame.addEventListener('click', () => {
        modalComplete.classList.remove('active');
        initGameLevel(1);
    });

    // Level selector tabs click listeners
    gameLevelsContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('level-btn')) {
            const levelSelected = parseInt(e.target.getAttribute('data-level'));
            initGameLevel(levelSelected);
        }
    });

    // Initialize Game on level 1
    initGameLevel(1);
});
