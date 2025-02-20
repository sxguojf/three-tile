import { parse } from "./parse";

self.onmessage = (msg: MessageEvent) => {
	const { buffer } = msg.data;
	const mesh = parse(buffer);
	self.postMessage(mesh);
	self.close();
};
