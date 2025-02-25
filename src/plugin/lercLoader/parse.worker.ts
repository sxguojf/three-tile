/**
 *@description: ArcGis-lerc tile geometry loader worker
 *@author: 郭江峰
 *@date: 2023-04-05
 */

import { DEMType, parse } from "./parse";

type MessageType = {
	demData: DEMType;
	clipBounds: [number, number, number, number];
	z: number;
};

self.onmessage = (msg: MessageEvent<MessageType>) => {
	const data = msg.data;
	const mesh = parse(data.demData, data.z, data.clipBounds);
	self.postMessage(mesh);
	self.close();
};
