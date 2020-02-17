import { spawn } from 'child_process';
import { Context, monitor } from 'effection';
import * as Path from 'path';

import { AgentServer } from '../index';
import { main, once, self } from './helpers';


main(function* start() {
  let appDir = Path.join(__dirname, '../dist/app');
  let server: AgentServer = yield AgentServer.create('ws://localhost:24003', port(), appDir);
  let context: Context = yield self;

  yield function *bundle() {
    let child = spawn('ts-node', ['bin/run-parcel.ts'], {
      stdio: ['inherit', 'inherit', 'inherit', 'ipc'],
      detached: true
    });

    context['spawn'](monitor(({ fail, ensure }) => {
      child.on('error', fail);
      ensure(() => child.off('error', fail));
    }))
    context['ensure'](() => process.kill(-child.pid, 'SIGTERM'));

    yield once(child, 'message');
  }


  console.info(`serving agent application`);
  console.info(`--> connect agents at ${server.agentAppURL}`);
  console.info(`--> harness script at ${server.harnessScriptURL}`);

  yield server.join();
});

function port(): number | undefined {
  let [,, second ] = process.argv;
  if (second) {
    return parseInt(second);
  } else {
    return undefined;
  }
}