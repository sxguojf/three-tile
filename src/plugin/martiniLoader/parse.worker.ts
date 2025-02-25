/**
 *@description: terrain-RGB parse
 *@author: 郭江峰
 *@date: 2023-04-05
 */

import { parse } from "./parse";

self.onmessage = (msg: MessageEvent) => {
	const { imgData, z } = msg.data;
	const mesh = parse(imgData, z);
	// 将结果发送回主线程
	self.postMessage(mesh);
	self.close();
};
