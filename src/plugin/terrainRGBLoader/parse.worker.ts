import { parse } from "./parse";

self.onmessage = (msg: MessageEvent) => {
	const geometryData = parse(msg.data.imgData);
	self.postMessage(geometryData);
	self.close();
};
