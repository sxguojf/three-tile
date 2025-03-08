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
