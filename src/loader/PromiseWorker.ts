/**
 * @description: PromiseWorker封装类，简化worker的使用。
 * @author: 郭江峰
 * @date: 2023-04-06
 */

export class PromiseWorker {
	public worker: Worker;
	/**
	 * 构造函数
	 *
	 * @param creator 创建一个 Worker 实例的函数
	 */
	public constructor(creator: () => Worker) {
		this.worker = creator();
	}

	/**
	 * 异步执行worker任务，并返回结果。
	 *
	 * @param message 要传递给worker的消息。
	 * @param transfer 可转移对象的数组，用于优化内存传输。
	 * @returns 返回一个Promise，解析为worker返回的结果。
	 */
	public async run<T = any>(message: any, transfer: Transferable[]) {
		return new Promise<T>((resolve) => {
			this.worker.onmessage = (e) => {
				resolve(e.data);
			};
			this.worker.postMessage(message, transfer);
		});
	}

	/**
	 * 终止当前工作进程。
	 */
	public terminate() {
		this.worker.terminate();
	}
}
