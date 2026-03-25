const os = require('os');
const { uptime } = require('process');
const axios = require('axios');

let isMonitoring = false;

function formatBytes(bytes){
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

module.exports = { formatBytes };

function formatUptime(seconds) {
    const days = Math.floor(seconds/ (3600 * 24));
    const hours = Math.floor((seconds % (3600 * 24)) / 3600);
    return `${days}d ${hours}h`;
}

function startMonitoring(interval = 10000) {
    if (isMonitoring) return;

    isMonitoring = true;

    const timer = setInterval(() =>{
        const stats = {
            uptime: formatUptime(os.uptime()),
            totalMem: formatBytes(os.totalmem()),
            usedMem: formatBytes(os.totalmem() - os.freemem()),
            freeMem: formatBytes(os.freemem()),
            loadAvg: os.loadavg().map(n => n.toFixed(2))
        };

        console.log(`
        === System Monitor ===
        Uptime: ${stats.uptime}
        Memory Usage:
            Total = ${stats.totalMem};
            Used : ${stats.usedMem};
            Free: ${stats.freeMem}
        CPU Load (1, 5, 15m): [${stats.loadAvg.join(', ')}]
            `);

            if (os.freemem() < 100 * 1024 * 1024){
                console.warn('Memory critical! Shutting down..');
                clearInterval(timer);
                process.exit(1);
            }
    }, interval);
    return timer;
}

async function checkServerHealth() {
    try {
        const response = await axios.get('http://localhost:3000/health');
        console.log('Server Health: ', response.data);
    } catch (error) {
        console.error('Server unreachable');
    }
    
}

setInterval(checkServerHealth, 15000);

try {
    const monitor = startMonitoring();
    process.on('SIGINT', () => {
        clearInterval(monitor);
        console.log('Monitoring stopped');
        process.exit(1);
    });
} catch (error){
    console.error('Monitoring failed:', error);
}
