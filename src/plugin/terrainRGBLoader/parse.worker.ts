import { parse } from "./parse";

self.onmessage = (msg: MessageEvent) => {
	const mesh = parse(msg.data.imgData);
	self.postMessage(mesh);
	self.close();
};
