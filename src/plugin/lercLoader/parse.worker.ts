/**
 *@description: ArcGis-lerc tile geometry loader worker
 *@author: 郭江峰
 *@date: 2023-04-05
 */

import { parse } from "./parse";

self.onmessage = (msg: MessageEvent) => {
	const data = msg.data;
	const mesh = parse(data.demData, data.z, data.clipBounds);
	self.postMessage(mesh);
	self.close();
};
