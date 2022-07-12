import os from 'os';
import cluster from 'cluster';

const runPrimaryProcess = () => {
  const processesCount = 1; //os.cpus().length * 2

  console.log('info', `Primary ${process.pid} is running`, '');

  console.log('info', `Forking Server with ${processesCount} processes`, '\n');

  for (let index = 0; index < processesCount; index++) cluster.fork();

  cluster.on('exit', (worker, code, signal) => {
    if (code !== 0 && !worker.exitedAfterDisconnect) {
      console.log(
        'info',
        `${code || 500} Worker ${
          worker.process.pid
        } died... scheduling another one! - ${signal}`,
        {},
      );
      cluster.fork();
    }
  });
};

const runWorkerProcess = async () => {
  await import('./server');
};

cluster.isPrimary ? runPrimaryProcess() : runWorkerProcess();
