/**
 *@description: Terrain-RGB parser worker
 *@author: 郭江峰
 *@date: 2023-04-05
 */

import { parse } from "./parse";

type MessageType = {
	imgData: ImageData;
};

self.onmessage = (msg: MessageEvent<MessageType>) => {
	const geometry = parse(msg.data.imgData);
	self.postMessage(geometry);
	// self.close();
};
