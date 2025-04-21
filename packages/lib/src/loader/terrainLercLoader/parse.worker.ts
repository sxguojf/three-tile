/**
 *@description: ArcGis-lerc tile geometry loader worker
 *@author: 郭江峰
 *@date: 2023-04-05
 */

import { parse } from "./parse";

type MessageType = {
	demData: ArrayBuffer;
	z: number;
	clipBounds: [number, number, number, number];
};

self.onmessage = (msg: MessageEvent<MessageType>) => {
	const data = msg.data;
	const mesh = parse(data.demData, data.z, data.clipBounds);
	self.postMessage(mesh);
};
