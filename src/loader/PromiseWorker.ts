/**
 *@description: PromiseWorker封装类，简化worker的使用。
 *@author: 郭江峰
 *@date: 2023-04-06
 */

export class PromiseWorker {
	public worker: Worker;
	public constructor(creator: () => Worker) {
		this.worker = creator();
	}

	public async run<T = any>(message: any, transfer: Transferable[]) {
		return new Promise<T>((resolve) => {
			this.worker.onmessage = (e) => {
				resolve(e.data);
			};
			this.worker.postMessage(message, transfer);
		});
	}

	public terminate() {
		this.worker.terminate();
	}
}
