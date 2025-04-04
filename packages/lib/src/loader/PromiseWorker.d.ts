/**
 * @description: PromiseWorker封装类，简化worker的使用。
 * @author: 郭江峰
 * @date: 2023-04-06
 */
export declare class PromiseWorker {
    worker: Worker;
    /**
     * 构造函数
     *
     * @param creator 创建一个 Worker 实例的函数
     */
    constructor(creator: () => Worker);
    /**
     * 异步执行worker任务，并返回结果。
     *
     * @param message 要传递给worker的消息。
     * @param transfer 可转移对象的数组，用于优化内存传输。
     * @returns 返回一个Promise，解析为worker返回的结果。
     */
    run<T = unknown>(message: Record<string, unknown>, transfer: Transferable[]): Promise<T>;
    /**
     * 终止当前工作进程。
     */
    terminate(): void;
}
